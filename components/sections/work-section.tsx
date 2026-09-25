"use client"

import { useState } from "react"
import { useReveal } from "@/hooks/use-reveal"
import { useMaxViewportHeight } from "@/hooks/use-viewport-height"

export function WorkSection() {
  const { ref, isVisible } = useReveal(0.3)
  const maxHeight = useMaxViewportHeight()

  return (
    <section
      ref={ref}
      className="w-screen shrink-0 snap-start overflow-y-auto px-4 pt-16 md:px-6 md:pt-20 lg:px-16"
      style={{ height: maxHeight, maxHeight: maxHeight }}
    >
      <div className="min-h-full flex flex-col justify-center max-[500px]:justify-start mx-auto w-full max-w-9xl pb-8">
        <div
          className={`mb-12 transition-all duration-700 md:mb-6 ${isVisible ? "translate-x-0 opacity-100" : "-translate-x-12 opacity-0"
            }`}
        >
          <h2 className="mb-2 font-sans text-4xl font-light tracking-tight text-foreground md:text-6xl lg:text-7xl">
            Progetti
          </h2>
          <p className="font-mono text-sm text-foreground/60 md:text-base"><img src="/favicon/favicon-32x32.png" alt="favicon" className="inline-block w-4 h-4 mx-1" /> Lavori recenti (e non)</p>
        </div>

        <div className="w-full">
          <div className="grid grid-cols-5 gap-4 mb-4 font-mono uppercase text-[10px] text-foreground/30 md:text-sm max-[500px]:hidden">
            <div>Number</div>
            <div>Year</div>
            <div>Project URL</div>
            <div>Client</div>
            <div>Area</div>
          </div>
          <div className="max-[500px]:grid max-[500px]:grid-cols-2 max-[500px]:gap-3 max-[500px]:space-y-0 space-y-2">
            {[
              {
                number: "01",
                title: "Cascina Fraschina",
                category: "Shopify e-commerce with dedicated custom tools and theme",
                year: "2026",
                url: "https://www.cascinafraschinabio.it/",
                direction: "left",
              },
              {
                number: "02",
                title: "Spazi Ibridi",
                category: "Website with interactive map connected to a custom plugin",
                year: "2026",
                url: "https://rete-spazi-ibridi.mi.it/",
                direction: "left",
              },
              {
                number: "03",
                title: "Frakas",
                category: "Website for a Creative Agency",
                year: "2026",
                url: "https://frakas.design/",
                direction: "left",
              },
              {
                number: "04",
                title: "Soilsense",
                category: "Web-based tool for interpreting environmental data (Claude + Copernicus Sentinel Data + ECMWF Data) ",
                year: "2026",
                url: "https://soilsense-community.vercel.app/",
                direction: "left",
              },
              {
                number: "05",
                title: "Ipazia",
                category: "Landing page for LLM's Research Startup",
                year: "2025",
                url: "https://ipazia.com/",
                direction: "left",
              },
              {
                number: "06",
                title: "Thribe",
                category: "Talent Agency Website",
                year: "2025",
                url: "https://www.thribe.io/",
                direction: "left",
              },
              // {
              //   number: "05",
              //   title: "Op Store",
              //   category: "Luthier's Ecommerce Website",
              //   year: "2025",
              //   url: "https://www.opstore.it/",
              //   direction: "left",
              // },
              {
                number: "07",
                title: "Inactual",
                category: "Webzine & Indipendent Collective",
                year: "2021",
                url: "https://inactual.it/",
                direction: "left",
              },
            ].map((project, i) => (
              <ProjectCard key={i} project={project} index={i} isVisible={isVisible} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function ProjectCard({
  project,
  index,
  isVisible,
}: {
  project: { number: string; title: string; category: string; year: string; url: string; direction: string }
  index: number
  isVisible: boolean
}) {
  const linkColors = [
    "text-blue-600",
    "text-red-600",
    "text-emerald-600",
    "text-violet-600",
    "text-orange-600",
    "text-pink-600",
    "text-cyan-700",
    "text-indigo-600",
  ]
  const randomColor = () => linkColors[Math.floor(Math.random() * linkColors.length)]

  const [expanded, setExpanded] = useState(false)
  const [linkColor, setLinkColor] = useState(linkColors[0])

  const getRevealClass = () => {
    if (!isVisible) {
      return project.direction === "left"
        ? "-translate-x-16 opacity-0 max-[500px]:translate-y-8"
        : "translate-x-16 opacity-0 max-[500px]:translate-y-8"
    }
    return "translate-x-0 opacity-100 max-[500px]:translate-y-0"
  }

  return (
    <div
      className={`group transition-all duration-700 border-foreground/10
        max-[500px]:relative max-[500px]:flex max-[500px]:min-h-40 max-[500px]:cursor-pointer max-[500px]:flex-col max-[500px]:justify-end max-[500px]:border max-[500px]:p-3 max-[500px]:transition-colors max-[500px]:duration-300
        ${expanded ? "max-[500px]:bg-white max-[500px]:border-black/20" : ""}
        grid grid-cols-5 items-center gap-4 border-b py-4 hover:border-foreground/20
        ${getRevealClass()}`}
      style={{
        transitionDelay: `${index * 150}ms`,
      }}
      onClick={() => {
        if (typeof window !== "undefined" && window.innerWidth <= 500) {
          setLinkColor(randomColor())
          setExpanded((v) => !v)
        }
      }}
      role="button"
      tabIndex={0}
      aria-expanded={expanded}
    >
      {/* Desktop table row */}
      <div className="font-mono text-sm text-foreground/30 transition-colors group-hover:text-foreground/50 md:text-base max-[500px]:hidden">
        {project.number}
      </div>
      <div className="font-mono text-xs text-foreground/30 md:text-sm max-[500px]:hidden">
        {project.year}
      </div>
      <div className="font-sans text-sm font-light text-foreground transition-transform duration-300 group-hover:translate-x-1 md:text-base max-[500px]:hidden">
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-primary transition-colors duration-300 truncate"
          onClick={(e) => e.stopPropagation()}
        >
          {project.title}
        </a>
      </div>
      <div className="font-sans text-sm font-light text-foreground md:text-base max-[500px]:hidden">
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-primary transition-colors duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {project.title}
        </a>
      </div>
      <div className="font-mono text-[10px] uppercase text-foreground/50 max-[500px]:hidden">
        {project.category}
      </div>

      {/* Mobile card */}
      <div className="hidden h-full w-full max-[500px]:flex max-[500px]:flex-col max-[500px]:justify-end">
        <span
          className={`absolute left-3 top-3 font-mono text-xs transition-colors duration-300 ${expanded ? "text-black/40" : "text-foreground/40"
            }`}
        >
          {project.number}
        </span>
        <div
          className={`overflow-hidden transition-all duration-300 ${expanded ? "mb-2 max-h-40 opacity-100" : "max-h-0 opacity-0"
            }`}
        >
          <p
            className={`font-mono text-[10px] uppercase leading-snug transition-colors duration-300 ${expanded ? "text-black/80" : "text-foreground/80"
              }`}
          >
            {project.category}
          </p>
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`mt-2 inline-block text-sm font-light transition-opacity hover:opacity-80 ${linkColor}`}
            onClick={(e) => e.stopPropagation()}
          >
            Visita il sito
          </a>
        </div>
        <div className="flex flex-col items-start">
          <span
            className={`font-mono text-xs transition-colors duration-300 ${expanded ? "text-black/50" : "text-foreground/50"
              }`}
          >
            {project.year}
          </span>
          <span
            className={`font-sans text-lg font-light leading-tight transition-colors duration-300 ${expanded ? "text-black" : "text-foreground"
              }`}
          >
            {project.title}
          </span>
        </div>
      </div>
    </div>
  )
}
