import { jsPDF } from "jspdf"
import "jspdf-autotable"
import type { ContactFormData } from "@/app/actions/contact-form"
import { getStrelkaLogo, getCosmicEyeLogo, STRELKA_LOGO_BASE64, COSMIC_EYE_LOGO_BASE64 } from "./pdf-images"

// Mappa i valori del form in etichette leggibili
const projectTypeMap: Record<string, string> = {
  website: "Sito Web",
  ecommerce: "E-commerce",
  webapp: "Web App",
  mobileapp: "App Mobile",
  other: "Altro",
}

const budgetMap: Record<string, string> = {
  low: "Meno di €1.000",
  medium: "€1.000 - €3.000",
  high: "€3.000 - €5.000",
  enterprise: "Più di €5.000",
}

// Configurazioni specifiche per ogni tipo di progetto (senza emoji)
const projectConfigs = {
  website: {
    color: [109, 40, 217], // Viola
    accentColor: [167, 139, 250],
    symbol: "WEB", // Sostituisce l'emoji
    features: [
      "Design responsive per tutti i dispositivi",
      "Ottimizzazione SEO di base",
      "Integrazione Google Analytics",
      "Modulo di contatto funzionante",
      "Hosting e dominio per 1 anno",
      "SSL Certificate incluso",
    ],
    technologies: ["HTML5", "CSS3", "JavaScript", "React", "Next.js"],
    timeline: "2-4 settimane",
    deliverables: [
      "Sito web completo e funzionante",
      "Pannello di amministrazione",
      "Documentazione tecnica",
      "Training per la gestione contenuti",
    ],
  },
  ecommerce: {
    color: [34, 197, 94], // Verde
    accentColor: [134, 239, 172],
    symbol: "SHOP",
    features: [
      "Catalogo prodotti completo",
      "Sistema di pagamento sicuro",
      "Gestione ordini e inventario",
      "Dashboard amministrativa",
      "Integrazione corrieri",
      "Sistema di recensioni",
    ],
    technologies: ["Shopify", "WooCommerce", "Stripe", "PayPal", "React"],
    timeline: "4-8 settimane",
    deliverables: [
      "Negozio online completo",
      "Sistema di gestione ordini",
      "Integrazione pagamenti",
      "Training per la gestione prodotti",
    ],
  },
  webapp: {
    color: [59, 130, 246], // Blu
    accentColor: [147, 197, 253],
    symbol: "APP",
    features: [
      "Interfaccia utente intuitiva",
      "Database personalizzato",
      "Sistema di autenticazione",
      "API REST integrate",
      "Dashboard analytics",
      "Backup automatici",
    ],
    technologies: ["React", "Node.js", "PostgreSQL", "MongoDB", "AWS"],
    timeline: "6-12 settimane",
    deliverables: [
      "Applicazione web completa",
      "Database configurato",
      "Documentazione API",
      "Sistema di monitoraggio",
    ],
  },
  mobileapp: {
    color: [168, 85, 247], // Viola chiaro
    accentColor: [196, 181, 253],
    symbol: "MOBILE",
    features: [
      "App nativa iOS e Android",
      "Design Material/Human Interface",
      "Notifiche push",
      "Sincronizzazione cloud",
      "Modalità offline",
      "Analytics integrate",
    ],
    technologies: ["React Native", "Flutter", "Firebase", "Redux", "TypeScript"],
    timeline: "8-16 settimane",
    deliverables: [
      "App mobile per iOS e Android",
      "Backend API",
      "Pubblicazione su App Store",
      "Documentazione utente",
    ],
  },
  other: {
    color: [245, 158, 11], // Arancione
    accentColor: [251, 191, 36],
    symbol: "CUSTOM",
    features: [
      "Soluzione personalizzata",
      "Analisi dei requisiti",
      "Architettura su misura",
      "Integrazione sistemi esistenti",
      "Supporto tecnico dedicato",
      "Scalabilita garantita",
    ],
    technologies: ["Tecnologie da definire", "Architettura personalizzata"],
    timeline: "Da definire",
    deliverables: ["Soluzione personalizzata", "Documentazione completa", "Training specifico", "Supporto post-lancio"],
  },
}

export async function generateQuotePDF(formData: ContactFormData, quoteId: string): Promise<Blob> {
  // Carica le immagini da Supabase con fallback ottimizzati
  let strelkaLogo = ""
  let cosmicEyeLogo = ""

  try {
    console.log("Loading optimized Strelka logo from Supabase...")
    strelkaLogo = await getStrelkaLogo()
    if (!strelkaLogo) {
      console.log("Using lightweight fallback Strelka logo")
      strelkaLogo = STRELKA_LOGO_BASE64
    }
  } catch (error) {
    console.error("Error loading Strelka logo:", error)
    strelkaLogo = STRELKA_LOGO_BASE64
  }

  try {
    console.log("Loading optimized Cosmic Eye logo from Supabase...")
    cosmicEyeLogo = await getCosmicEyeLogo()
    if (!cosmicEyeLogo) {
      console.log("Using lightweight fallback Cosmic Eye logo")
      cosmicEyeLogo = COSMIC_EYE_LOGO_BASE64
    }
  } catch (error) {
    console.error("Error loading Cosmic Eye logo:", error)
    cosmicEyeLogo = COSMIC_EYE_LOGO_BASE64
  }

  // Ottieni la configurazione specifica per il tipo di progetto
  const config = projectConfigs[formData.projectType as keyof typeof projectConfigs] || projectConfigs.other

  // Crea un nuovo documento PDF con compressione ottimizzata
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true, // Abilita la compressione
  })

  // Colori personalizzati in base al tipo di progetto
  const primaryColor = config.color
  const accentColor = config.accentColor
  const darkBgColor = [10, 10, 26]

  // Aggiungi sfondo personalizzato (ridotto)
  doc.setFillColor(darkBgColor[0], darkBgColor[1], darkBgColor[2])
  doc.rect(0, 0, 210, 297, "F")

  // Header personalizzato con colore del progetto (elementi decorativi ridotti)
  const createOptimizedHeader = () => {
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2])
    doc.rect(0, 0, 210, 40, "F")

    // Ridotti gli elementi decorativi da 20 a 5
    for (let i = 0; i < 5; i++) {
      const x = Math.random() * 210
      const y = Math.random() * 40
      const size = Math.random() * 0.5 + 0.1 // Dimensioni ridotte
      doc.setFillColor(255, 255, 255, Math.random() * 0.3 + 0.1) // Opacità ridotta
      doc.circle(x, y, size, "F")
    }
  }

  createOptimizedHeader()

  // Logo Strelka ottimizzato
  if (strelkaLogo && strelkaLogo !== STRELKA_LOGO_BASE64) {
    try {
      console.log("Adding optimized Strelka logo to PDF")
      // Dimensioni ridotte per il logo
      doc.addImage(strelkaLogo, "JPEG", 20, 15, 30, 9, undefined, "FAST") // Compressione veloce
    } catch (error) {
      console.error("Error adding Strelka logo to PDF:", error)
      // Fallback al testo
      doc.setFontSize(20) // Dimensione ridotta
      doc.setTextColor(255, 255, 255)
      doc.text("STRELKA", 20, 25)
    }
  } else {
    // Fallback al testo
    doc.setFontSize(20)
    doc.setTextColor(255, 255, 255)
    doc.text("STRELKA", 20, 25)
  }

  // Simbolo e tipo di progetto (senza emoji)
  doc.setFontSize(16) // Dimensione ridotta
  doc.setTextColor(255, 255, 255)
  doc.text(`[${config.symbol}] ${projectTypeMap[formData.projectType]}`, 105, 25, { align: "center" })

  // Linea decorativa
  doc.setDrawColor(accentColor[0], accentColor[1], accentColor[2])
  doc.setLineWidth(0.3) // Linea più sottile
  doc.line(20, 45, 190, 45)

  // Box informazioni preventivo
  doc.setFillColor(30, 30, 60)
  doc.roundedRect(15, 55, 180, 30, 3, 3, "F")

  doc.setFontSize(11) // Dimensioni ridotte
  doc.setTextColor(accentColor[0], accentColor[1], accentColor[2])
  doc.text("RIFERIMENTO", 20, 65)
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(12)
  doc.text(`Preventivo #: ${quoteId}`, 20, 75)

  doc.setFontSize(11)
  doc.setTextColor(accentColor[0], accentColor[1], accentColor[2])
  doc.text("DATA", 120, 65)
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(12)
  doc.text(`${new Date().toLocaleDateString("it-IT")}`, 120, 75)

  // Informazioni cliente
  doc.setFillColor(30, 30, 60)
  doc.roundedRect(15, 95, 180, 40, 3, 3, "F")

  doc.setFontSize(14) // Dimensione ridotta
  doc.setTextColor(accentColor[0], accentColor[1], accentColor[2])
  doc.text("INFORMAZIONI CLIENTE", 20, 105)

  doc.setFontSize(10) // Dimensioni ridotte
  doc.setTextColor(200, 200, 200)
  doc.text("Nome:", 20, 115)
  doc.text("Email:", 20, 125)
  doc.text("Telefono:", 120, 115)
  doc.text("Budget:", 120, 125)

  doc.setTextColor(255, 255, 255)
  doc.text(formData.name, 50, 115)
  doc.text(formData.email, 50, 125)
  doc.text(formData.phone || "Non fornito", 150, 115)
  doc.text(budgetMap[formData.budget] || formData.budget, 150, 125)

  // Descrizione progetto
  doc.setFillColor(30, 30, 60)
  doc.roundedRect(15, 145, 180, 50, 3, 3, "F")

  doc.setFontSize(14)
  doc.setTextColor(accentColor[0], accentColor[1], accentColor[2])
  doc.text("DESCRIZIONE PROGETTO", 20, 155)

  doc.setFontSize(10) // Dimensione ridotta
  doc.setTextColor(255, 255, 255)
  const splitMessage = doc.splitTextToSize(formData.message, 170)
  doc.text(splitMessage, 20, 165)

  // Sezione Features specifiche per il tipo di progetto
  let currentY = 205
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2], 0.15) // Opacità ridotta
  doc.roundedRect(15, currentY, 180, 60, 3, 3, "F")

  doc.setFontSize(14)
  doc.setTextColor(accentColor[0], accentColor[1], accentColor[2])
  doc.text("CARATTERISTICHE INCLUSE", 20, currentY + 10)

  doc.setFontSize(9) // Dimensione ridotta
  doc.setTextColor(255, 255, 255)

  // Dividi le features in due colonne
  const featuresPerColumn = Math.ceil(config.features.length / 2)
  config.features.forEach((feature, index) => {
    const isLeftColumn = index < featuresPerColumn
    const x = isLeftColumn ? 20 : 110
    const y = currentY + 20 + (index % featuresPerColumn) * 6

    doc.text("•", x, y)
    doc.text(feature, x + 5, y)
  })

  // Timeline e Tecnologie
  currentY += 70
  doc.setFillColor(30, 30, 60)
  doc.roundedRect(15, currentY, 85, 35, 3, 3, "F")
  doc.roundedRect(110, currentY, 85, 35, 3, 3, "F")

  // Timeline
  doc.setFontSize(12)
  doc.setTextColor(accentColor[0], accentColor[1], accentColor[2])
  doc.text("TEMPISTICHE", 20, currentY + 10)
  doc.setFontSize(10)
  doc.setTextColor(255, 255, 255)
  doc.text(config.timeline, 20, currentY + 20)

  // Tecnologie
  doc.setFontSize(12)
  doc.setTextColor(accentColor[0], accentColor[1], accentColor[2])
  doc.text("TECNOLOGIE", 115, currentY + 10)
  doc.setFontSize(8) // Dimensione ridotta
  doc.setTextColor(255, 255, 255)

  config.technologies.forEach((tech, index) => {
    if (index < 3) {
      doc.text(`• ${tech}`, 115, currentY + 18 + index * 4)
    }
  })

  // Deliverables
  currentY += 45
  doc.setFillColor(30, 30, 60)
  doc.roundedRect(15, currentY, 180, 40, 3, 3, "F")

  doc.setFontSize(14)
  doc.setTextColor(accentColor[0], accentColor[1], accentColor[2])
  doc.text("DELIVERABLES", 20, currentY + 10)

  doc.setFontSize(9)
  doc.setTextColor(255, 255, 255)
  config.deliverables.forEach((deliverable, index) => {
    const x = index < 2 ? 20 : 110
    const y = currentY + 20 + (index % 2) * 6
    doc.text(`• ${deliverable}`, x, y)
  })

  // Note finali
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2], 0.1) // Opacità ridotta
  doc.roundedRect(15, 255, 180, 20, 3, 3, "F")

  doc.setFontSize(9)
  doc.setTextColor(200, 200, 200)
  doc.text("Nota: Questo preventivo e valido per 30 giorni dalla data di emissione.", 20, 265)
  doc.text("I prezzi finali potrebbero variare in base ai dettagli specifici del progetto.", 20, 270)

  // Footer ottimizzato
  doc.setFillColor(30, 30, 60)
  doc.rect(0, 277, 210, 20, "F")

  // Elementi decorativi ridotti nel footer
  for (let i = 0; i < 5; i++) {
    // Ridotti da 15 a 5
    const x = Math.random() * 210
    const y = 277 + Math.random() * 20
    const size = Math.random() * 0.3 + 0.1 // Dimensioni ridotte
    doc.setFillColor(255, 255, 255, Math.random() * 0.2 + 0.1) // Opacità ridotta
    doc.circle(x, y, size, "F")
  }

  // Informazioni di contatto
  doc.setFontSize(8) // Dimensione ridotta
  doc.setTextColor(180, 180, 180)
  doc.text("Strelka - P.IVA: 14088410965", 105, 285, { align: "center" })
  doc.text("Email: contact@strelka.it | Web: www.strelka.it", 105, 290, { align: "center" })

  // Cosmic Eye Logo ottimizzato
  if (cosmicEyeLogo && cosmicEyeLogo !== COSMIC_EYE_LOGO_BASE64) {
    try {
      console.log("Adding optimized Cosmic Eye logo to PDF")
      // Dimensioni ridotte e compressione
      doc.addImage(cosmicEyeLogo, "JPEG", 150, 50, 35, 35, undefined, "FAST")
    } catch (error) {
      console.error("Error adding Cosmic Eye logo to PDF:", error)
      // Fallback al cerchio decorativo semplificato
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2], 0.1)
      doc.circle(167, 67, 15, "F") // Dimensioni ridotte
    }
  } else {
    // Fallback al cerchio decorativo semplificato
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2], 0.1)
    doc.circle(167, 67, 15, "F")
  }

  // Numero di pagina
  const pageCount = doc.internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8) // Dimensione ridotta
    doc.setTextColor(150, 150, 150)
    doc.text(`Pagina ${i} di ${pageCount}`, 180, 290)
  }

  return doc.output("blob")
}
