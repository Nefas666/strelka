"use client"

import { Mail, MapPin } from "lucide-react"
import { useReveal } from "@/hooks/use-reveal"
import { useMaxViewportHeight } from "@/hooks/use-viewport-height"

export function ContactSection() {
  const { ref, isVisible } = useReveal(0.3)
  const maxHeight = useMaxViewportHeight()

  return (
    <section
      ref={ref}
      className="w-screen shrink-0 snap-start overflow-y-auto px-4 pt-12 md:px-6 md:pt-20 lg:px-8"
      style={{ height: maxHeight, maxHeight: maxHeight }}
    >
      <div className="min-h-full flex flex-col justify-center mx-auto w-full max-w-7xl pb-8">
        <div
          className={`mb-6 transition-all duration-700 md:mb-10 ${isVisible ? "translate-x-0 opacity-100" : "-translate-x-3 opacity-0"
            }`}
        >
          <h2 className="mb-2 font-sans text-3xl font-light leading-[1.05] tracking-tight text-foreground md:mb-3 md:text-7xl lg:text-8xl">
            Contattami
          </h2>
          <p className="hidden md:block font-mono text-xs text-foreground/60 md:text-base"><img src="/favicon/favicon-32x32.png" alt="favicon" className="inline-block w-4 h-4 mx-1" /> Parliamone</p>
        </div>

        <div className="space-y-2 md:space-y-8">
          <a
            href="mailto:contact@strelka.it"
            className={`group block transition-all duration-700 ${isVisible ? "translate-x-0 opacity-100" : "-translate-x-16 opacity-0"
              }`}
            style={{ transitionDelay: "200ms" }}
          >
            <div className="mb-1 flex items-center gap-2">
              <Mail className="h-3 w-3 text-foreground/60" />
              <span className="font-mono text-xs text-foreground/60">Email</span>
            </div>
            <p className="text-sm md:text-2xl lg:text-3xl text-foreground transition-colors group-hover:text-foreground/70">
              contact@strelka.it
            </p>
          </a>

          <div
            className={`transition-all duration-700 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
              }`}
            style={{ transitionDelay: "350ms" }}
          >
            <div className="mb-1 flex items-center gap-2">
              <MapPin className="h-3 w-3 text-foreground/60" />
              <span className="font-mono text-xs text-foreground/60">Location</span>
            </div>
            <p className="text-sm md:text-base text-foreground md:text-2xl">Italia, EU</p>
          </div>

          <div
            className={`flex gap-2 pt-1 md:pt-4 transition-all duration-700 ${isVisible ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-0"
              }`}
            style={{ transitionDelay: "500ms" }}
          >
            <a
              href="https://github.com/Nefas666"
              target="_blank"
              rel="noopener noreferrer"
              className="border-b border-transparent font-mono text-xs text-foreground/60 transition-all hover:border-foreground/60 hover:text-foreground/90"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/selene-manno1992/"
              target="_blank"
              rel="noopener noreferrer"
              className="border-b border-transparent font-mono text-xs text-foreground/60 transition-all hover:border-foreground/60 hover:text-foreground/90"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
