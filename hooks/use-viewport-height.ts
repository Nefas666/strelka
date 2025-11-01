import * as React from "react";

export function useViewportHeight() {
  const [viewportHeight, setViewportHeight] = React.useState<string>("100vh");

  React.useEffect(() => {
    const updateHeight = () => {
      // Su mobile, usiamo l'altezza effettiva della viewport meno un piccolo margine
      // per evitare che il contenuto venga tagliato dalla barra degli indirizzi
      const isMobile = window.innerWidth < 768;

      if (isMobile) {
        // Calcoliamo l'altezza effettiva della viewport
        const height = window.innerHeight;
        // Applichiamo un fattore di sicurezza (95%) per garantire che il contenuto sia visibile
        const safeHeight = Math.floor(height * 0.95);
        setViewportHeight(`${safeHeight}px`);
      } else {
        // Su desktop usiamo 100vh normalmente
        setViewportHeight("100vh");
      }
    };

    updateHeight();

    // Aggiungiamo event listener per il resize e l'orientation change
    window.addEventListener("resize", updateHeight);
    window.addEventListener("orientationchange", updateHeight);

    // Aggiungiamo anche listener per visual viewport API se disponibile
    if ("visualViewport" in window) {
      window.visualViewport?.addEventListener("resize", updateHeight);
    }

    return () => {
      window.removeEventListener("resize", updateHeight);
      window.removeEventListener("orientationchange", updateHeight);
      if ("visualViewport" in window) {
        window.visualViewport?.removeEventListener("resize", updateHeight);
      }
    };
  }, []);

  return viewportHeight;
}

export function useMaxViewportHeight() {
  const [maxHeight, setMaxHeight] = React.useState<string>("100vh");

  React.useEffect(() => {
    const updateMaxHeight = () => {
      const isMobile = window.innerWidth < 768;

      if (isMobile) {
        // Calcoliamo l'altezza massima disponibile considerando la barra degli indirizzi
        const height = window.innerHeight;
        // Usiamo un fattore più conservativo (90%) per il max-height
        const safeHeight = Math.floor(height * 0.9);
        setMaxHeight(`${safeHeight}px`);
      } else {
        setMaxHeight("100vh");
      }
    };

    updateMaxHeight();

    window.addEventListener("resize", updateMaxHeight);
    window.addEventListener("orientationchange", updateMaxHeight);

    if ("visualViewport" in window) {
      window.visualViewport?.addEventListener("resize", updateMaxHeight);
    }

    return () => {
      window.removeEventListener("resize", updateMaxHeight);
      window.removeEventListener("orientationchange", updateMaxHeight);
      if ("visualViewport" in window) {
        window.visualViewport?.removeEventListener("resize", updateMaxHeight);
      }
    };
  }, []);

  return maxHeight;
}
