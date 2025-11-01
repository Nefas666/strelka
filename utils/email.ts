import { Resend } from "resend";
import type { ContactFormData } from "@/app/actions/contact-form";

// Initialize Resend with your API key
// Check if API key exists and provide better error handling
const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function sendContactNotification(
  formData: ContactFormData,
  quoteId?: string,
  pdfUrl?: string | null
): Promise<boolean> {
  try {
    // Check if Resend is properly initialized
    if (!resend) {
      console.error("Resend API key is missing or invalid");
      return false;
    }

    const { name, email, phone, projectType, budget, message } = formData;

    // Format budget for display
    const budgetMap: Record<string, string> = {
      "<1000": "Meno di 1000€",
      "1000-3000": "1000€ - 3000€",
      "3000-5000": "3000€ - 5000€",
      "5000-10000": "5000€ - 10000€",
      ">10000": "Più di 10000€",
    };

    // Format project type for display
    const projectTypeMap: Record<string, string> = {
      website: "Sito Web",
      ecommerce: "E-commerce",
      app: "Applicazione",
      branding: "Branding",
      other: "Altro",
    };

    // Costruisci l'email HTML
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
        <h2 style="color: #6d28d9;">Nuova richiesta di contatto</h2>
        <p>Hai ricevuto una nuova richiesta di contatto dal sito web.</p>
        
        ${quoteId ? `<p><strong>Numero Preventivo:</strong> ${quoteId}</p>` : ""}
        
        <div style="background-color: #f9fafb; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Dettagli della richiesta:</h3>
          <p><strong>Nome:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Telefono:</strong> ${phone || "Non fornito"}</p>
          <p><strong>Tipo di progetto:</strong> ${projectTypeMap[projectType] || projectType}</p>
          <p><strong>Budget:</strong> ${budgetMap[budget] || budget}</p>
          <p><strong>Messaggio:</strong></p>
          <p style="background-color: white; padding: 10px; border-radius: 3px;">${message}</p>
        </div>
        
        ${
          pdfUrl
            ? `
        <div style="margin: 20px 0;">
          <p><strong>PDF Preventivo:</strong> <a href="${pdfUrl}" target="_blank">Scarica PDF</a></p>
        </div>
        `
            : ""
        }
        
        <p style="font-size: 12px; color: #666; margin-top: 30px;">
          Questa è un'email automatica inviata dal modulo di contatto del sito Strelka.
        </p>
      </div>
    `;

    // Invia l'email
    const { data, error } = await resend.emails.send({
      from: "Strelka Form <noreply@strelka.it>",
      to: "contact@strelka.it", // Assicurati che questo sia l'indirizzo email corretto
      subject: `Nuova richiesta da ${name} ${quoteId ? `- Preventivo #${quoteId}` : ""}`,
      html: emailHtml,
    });

    if (error) {
      console.error("Error sending email notification:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in sendContactNotification:", error);
    return false;
  }
}
