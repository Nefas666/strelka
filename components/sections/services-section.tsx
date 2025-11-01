"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { useReveal } from "@/hooks/use-reveal"
import { useMaxViewportHeight } from "@/hooks/use-viewport-height"

export function ServicesSection() {
  const { ref, isVisible } = useReveal(0.3)
  const maxHeight = useMaxViewportHeight()
  const [expandedService, setExpandedService] = useState<number | null>(null)

  return (
    <section
      ref={ref}
      className="flex w-screen shrink-0 snap-start items-center px-4 pt-16 md:px-6 md:pt-20 lg:px-16"
      style={{ height: maxHeight, maxHeight: maxHeight }}
    >
      <div className="mx-auto w-full max-w-7xl">
        <div
          className={`mb-12 transition-all duration-700 mb-2 md:mb-16 ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-12 opacity-0"
            }`}
        >
          <h2 className="mb-2 font-sans text-5xl font-light tracking-tight text-foreground md:text-6xl lg:text-7xl">
            Servizi
          </h2>
          <p className="font-mono text-sm text-foreground/60 md:text-base">/ Quello che posso fare</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 md:gap-x-16 md:gap-y-12 lg:gap-x-24">
          {[
            {
              title: "Creative Development & Technology",
              description: "Siti web personalizzati che si distinguono per design, velocità e usabilità, costruiti con le tecnologie più recenti per soluzioni performanti e scalabili",
              direction: "top",
            },
            {
              title: "Visual Design & Restyling",
              description: "Nuova vita ai siti web esistenti attraverso un design moderno, funzionalità migliorate e un'esperienza utente rinnovata",
              direction: "right",
            },
            {
              title: "Ecommerce & Conversion",
              description: "Piattaforme e-commerce complete e landing page ottimizzate per la conversione che catturano l'attenzione e generano risultati concreti",
              direction: "left",
            },
            {
              title: "Knowledge Systems & Technical Strategy",
              description: "Sistemi di gestione dei contenuti personalizzati, progettati per rispondere alle specifiche esigenze della tua azienda",
              direction: "bottom",
            },
          ].map((service, i) => (
            <ServiceCard
              key={i}
              service={service}
              index={i}
              isVisible={isVisible}
              isExpanded={expandedService === i}
              onToggle={() => setExpandedService(expandedService === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function ServiceCard({
  service,
  index,
  isVisible,
  isExpanded,
  onToggle,
}: {
  service: { title: string; description: string; direction: string }
  index: number
  isVisible: boolean
  isExpanded: boolean
  onToggle: () => void
}) {
  const getRevealClass = () => {
    if (!isVisible) {
      switch (service.direction) {
        case "left":
          return "-translate-x-16 opacity-0"
        case "right":
          return "translate-x-16 opacity-0"
        case "top":
          return "-translate-y-16 opacity-0"
        case "bottom":
          return "translate-y-16 opacity-0"
        default:
          return "translate-y-12 opacity-0"
      }
    }
    return "translate-x-0 translate-y-0 opacity-100"
  }

  return (
    <div
      className={`group transition-all duration-700 ${getRevealClass()}`}
      style={{
        transitionDelay: `${index * 150}ms`,
      }}
    >
      <div className="mb-3 flex items-center gap-3">
        <div className="h-px w-8 bg-foreground/30 transition-all duration-300 group-hover:w-12 group-hover:bg-foreground/50" />
        <span className="font-mono text-xs text-foreground/60">0{index + 1}</span>
      </div>
      <h3 className="mb-2 font-sans text-2xl font-light text-foreground md:text-3xl">{service.title}</h3>
      <p className="max-w-sm text-sm leading-relaxed text-foreground/80 md:text-base">{service.description}</p>
    </div>
  )
}
