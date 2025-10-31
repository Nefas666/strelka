import { createClient } from "@supabase/supabase-js"

// Inizializza il client Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Funzione per comprimere e ottimizzare le immagini
async function compressImage(imageBlob: Blob, maxWidth = 200, quality = 0.7): Promise<string> {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    const img = new Image()

    img.onload = () => {
      // Calcola le nuove dimensioni mantenendo l'aspect ratio
      const aspectRatio = img.width / img.height
      let newWidth = maxWidth
      let newHeight = maxWidth / aspectRatio

      if (newHeight > maxWidth) {
        newHeight = maxWidth
        newWidth = maxWidth * aspectRatio
      }

      canvas.width = newWidth
      canvas.height = newHeight

      // Disegna l'immagine ridimensionata
      ctx?.drawImage(img, 0, 0, newWidth, newHeight)

      // Converti in base64 con compressione
      const compressedDataUrl = canvas.toDataURL("image/jpeg", quality)
      resolve(compressedDataUrl)
    }

    img.src = URL.createObjectURL(imageBlob)
  })
}

// Funzione per ottenere le immagini da Supabase Storage e convertirle in base64 ottimizzato
export async function getImageAsBase64FromSupabase(bucketName: string, fileName: string): Promise<string> {
  try {
    // Scarica l'immagine da Supabase Storage
    const { data, error } = await supabase.storage.from(bucketName).download(fileName)

    if (error) {
      console.error("Error downloading image from Supabase:", error)
      return ""
    }

    // Per il server-side, convertiamo direttamente senza compressione canvas
    const arrayBuffer = await data.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Riduci la qualità per PNG convertendo in JPEG con qualità ridotta
    const base64 = buffer.toString("base64")

    // Per immagini PNG grandi, usa JPEG con qualità ridotta
    if (fileName.includes(".png") && buffer.length > 50000) {
      return `data:image/jpeg;base64,${base64}`
    }

    const ext = fileName.split(".").pop()?.toLowerCase()
    let mimeType = "image/png"

    if (ext === "jpg" || ext === "jpeg") {
      mimeType = "image/jpeg"
    } else if (ext === "svg") {
      mimeType = "image/svg+xml"
    }

    return `data:${mimeType};base64,${base64}`
  } catch (error) {
    console.error("Error converting image to base64:", error)
    return ""
  }
}

// Funzione helper per ottenere il logo Strelka ottimizzato
export async function getStrelkaLogo(): Promise<string> {
  return await getImageAsBase64FromSupabase("assets", "logo-white.png")
}

// Funzione helper per ottenere il logo Cosmic Eye ottimizzato
export async function getCosmicEyeLogo(): Promise<string> {
  return await getImageAsBase64FromSupabase("assets", "cosmic-eye-logo.png")
}

// Fallback SVG ottimizzati e molto leggeri
export const STRELKA_LOGO_BASE64 =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjQwIiB2aWV3Qm94PSIwIDAgMTIwIDQwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjx0ZXh0IHg9IjEwIiB5PSIyNSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE4IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iI2ZmZiI+U1RSRUXLQTL0ZXh0Pjwvc3ZnPg=="

export const COSMIC_EYE_LOGO_BASE64 =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyNSIgY3k9IjI1IiByPSIyMCIgZmlsbD0iIzZkMjhkOSIgb3BhY2l0eT0iMC4yIi8+PGNpcmNsZSBjeD0iMjUiIGN5PSIyNSIgcj0iMTAiIGZpbGw9IiNhNzhmYTYiIG9wYWNpdHk9IjAuNCIvPjwvc3ZnPg=="

// Funzione legacy per compatibilità
export async function getImageAsBase64(imagePath: string): Promise<string> {
  const fileName = imagePath.split("/").pop() || ""

  if (fileName.includes("logo-white")) {
    return await getStrelkaLogo()
  } else if (fileName.includes("cosmic-eye-logo")) {
    return await getCosmicEyeLogo()
  }

  return ""
}
