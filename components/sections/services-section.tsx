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
      className="w-screen shrink-0 snap-start overflow-y-auto px-4 pt-16 md:px-6 md:pt-20 lg:px-16"
      style={{ height: maxHeight, maxHeight: maxHeight }}
    >
      <div className="min-h-full flex flex-col justify-center mx-auto w-full max-w-7xl pb-8">
        <div
          className={`mb-12 transition-all duration-700 mb-2 md:mb-16 ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-12 opacity-0"
            }`}
        >
          <h2 className="mb-2 font-sans text-4xl font-light tracking-tight text-foreground md:text-6xl lg:text-7xl">
            Servizi
          </h2>
          <p className="font-mono text-sm text-foreground/60 md:text-base"><img src="/favicon-32x32.png" alt="favicon" className="inline-block w-4 h-4 mx-1" /> Quello che posso fare</p>
        </div>

        <div className="space-y-3 md:grid md:grid-cols-2 md:gap-x-16 md:gap-y-12 md:space-y-0 lg:gap-x-24">
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
      {/* Mobile Accordion */}
      <div className="md:hidden">
        <button
          onClick={onToggle}
          className="w-full text-left"
        >
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="h-px w-8 bg-foreground/30 transition-all duration-300 group-hover:w-12 group-hover:bg-foreground/50" />
              <span className="font-mono text-xs text-foreground/60">0{index + 1}</span>
            </div>
            <ChevronDown
              className={`h-4 w-4 text-foreground/60 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''
                }`}
            />
          </div>
          <h3 className="mb-2 font-sans text-xl font-light text-foreground">{service.title}</h3>
        </button>
        <div
          className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
            }`}
        >
          <p className="text-sm leading-relaxed text-foreground/80">{service.description}</p>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:block">
        <div className="mb-3 flex items-center gap-3">
          <div className="h-px w-8 bg-foreground/30 transition-all duration-300 group-hover:w-12 group-hover:bg-foreground/50" />
          <span className="font-mono text-xs text-foreground/60">0{index + 1}</span>
        </div>
        <h3 className="mb-2 font-sans text-2xl font-light text-foreground md:text-3xl">{service.title}</h3>
        <p className="max-w-sm text-sm leading-relaxed text-foreground/80 md:text-base">{service.description}</p>
      </div>
    </div>
  )
}
