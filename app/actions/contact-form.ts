"use server"

import { createClient } from "@supabase/supabase-js"
import { z } from "zod"
import { sendContactNotification } from "@/utils/email"
import { generateQuotePDF } from "@/utils/pdf-generator"
import { v4 as uuidv4 } from "uuid"

// Form validation schema
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Il nome deve contenere almeno 2 caratteri.",
  }),
  email: z.string().email({
    message: "Inserisci un indirizzo email valido.",
  }),
  phone: z.string().optional(),
  projectType: z.string({
    required_error: "Seleziona il tipo di progetto.",
  }),
  budget: z.string({
    required_error: "Seleziona il budget.",
  }),
  message: z.string().min(10, {
    message: "Il messaggio deve contenere almeno 10 caratteri.",
  }),
})

export type ContactFormData = z.infer<typeof formSchema>

export async function submitContactForm(formData: ContactFormData) {
  try {
    // Validate form data
    const validatedData = formSchema.parse(formData)

    // Initialize Supabase client with server-side credentials
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Genera un ID univoco per il preventivo
    const quoteId = `QUOTE-${uuidv4().substring(0, 8).toUpperCase()}`

    // Insert data into Supabase
    const { data, error } = await supabase
      .from("contact_submissions")
      .insert([
        {
          name: validatedData.name,
          email: validatedData.email,
          phone: validatedData.phone || null,
          project_type: validatedData.projectType,
          budget: validatedData.budget,
          message: validatedData.message,
          quote_id: quoteId,
          created_at: new Date().toISOString(),
        },
      ])
      .select()

    if (error) {
      console.error("Error submitting form:", error)
      return { success: false, message: "Si è verificato un errore durante l'invio del modulo." }
    }

    let pdfUrl = null

    // Genera il PDF del preventivo
    try {
      const pdfBlob = await generateQuotePDF(validatedData, quoteId)

      // Converti il Blob in File
      const pdfFile = new File([pdfBlob], `preventivo-${quoteId}.pdf`, { type: "application/pdf" })

      // Carica il PDF su Supabase Storage
      const { data: storageData, error: storageError } = await supabase.storage
        .from("quotes")
        .upload(`${quoteId}.pdf`, pdfFile) // Percorso semplificato

      if (storageError) {
        console.error("Error uploading PDF:", storageError)
      } else {
        // Ottieni l'URL pubblico del PDF
        const { data: publicUrlData } = supabase.storage.from("quotes").getPublicUrl(`${quoteId}.pdf`) // Percorso semplificato

        // Aggiorna il record con l'URL del PDF
        if (publicUrlData?.publicUrl) {
          pdfUrl = publicUrlData.publicUrl
          await supabase
            .from("contact_submissions")
            .update({ pdf_url: publicUrlData.publicUrl })
            .eq("quote_id", quoteId)
        }
      }
    } catch (pdfError) {
      console.error("Error generating PDF:", pdfError)
      // Continuiamo comunque, anche se la generazione del PDF fallisce
    }

    // Invia la notifica email - prima tenta con il PDF, se fallisce riprova senza PDF
    let emailSent = false

    try {
      // Prima prova con il PDF
      if (pdfUrl) {
        emailSent = await sendContactNotification(validatedData, quoteId, pdfUrl)
      }

      // Se non c'è un PDF o l'invio con PDF fallisce, riprova senza PDF
      if (!pdfUrl || !emailSent) {
        emailSent = await sendContactNotification(validatedData, quoteId)
      }
    } catch (emailError) {
      console.error("Error sending email:", emailError)
    }

    // Log warning if email fails
    if (!emailSent) {
      console.warn("Form data saved to database but email notification failed")
    }

    return {
      success: true,
      message: "Grazie! La tua richiesta è stata inviata con successo. Ti contatteremo al più presto.",
      quoteId,
    }
  } catch (error) {
    console.error("Error processing form submission:", error)
    return { success: false, message: "Si è verificato un errore durante l'elaborazione del modulo." }
  }
}
