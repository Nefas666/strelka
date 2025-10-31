import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { sendContactNotification } from "@/utils/email"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, phone, projectType, budget, message } = body

    // Basic validation
    if (!name || !email || !projectType || !budget || !message) {
      return NextResponse.json(
        { success: false, message: "Tutti i campi obbligatori devono essere compilati." },
        { status: 400 },
      )
    }

    // Initialize Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Insert data into Supabase
    const { error } = await supabase.from("contact_submissions").insert([
      {
        name,
        email,
        phone: phone || null,
        project_type: projectType,
        budget,
        message,
        created_at: new Date().toISOString(),
      },
    ])

    if (error) {
      console.error("Error submitting form:", error)
      return NextResponse.json(
        { success: false, message: "Si è verificato un errore durante l'invio del modulo." },
        { status: 500 },
      )
    }

    // Send email notification
    await sendContactNotification({ name, email, phone, projectType, budget, message })

    return NextResponse.json({
      success: true,
      message: "Grazie! La tua richiesta è stata inviata con successo. Ti contatteremo al più presto.",
    })
  } catch (error) {
    console.error("Error processing form submission:", error)
    return NextResponse.json(
      { success: false, message: "Si è verificato un errore durante l'elaborazione del modulo." },
      { status: 500 },
    )
  }
}
