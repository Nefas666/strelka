"use client"

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
      <div className="min-h-full flex flex-col justify-center mx-auto w-full max-w-9xl pb-8">
        <div
          className={`mb-12 transition-all duration-700 md:mb-6 ${isVisible ? "translate-x-0 opacity-100" : "-translate-x-12 opacity-0"
            }`}
        >
          <h2 className="mb-2 font-sans text-4xl font-light tracking-tight text-foreground md:text-6xl lg:text-7xl">
            Progetti
          </h2>
          <p className="font-mono text-sm text-foreground/60 md:text-base"><img src="/favicon-32x32.png" alt="favicon" className="inline-block w-4 h-4 mx-1" /> Lavori recenti (e non)</p>
        </div>

        <div className="w-full">
          <div className="grid grid-cols-5 gap-4 mb-4 font-mono uppercase text-[10px] text-foreground/30 md:text-sm">
            <div>Number</div>
            <div>Year</div>
            <div>Project URL</div>
            <div>Client</div>
            <div>Area</div>
          </div>
          <div className="space-y-2">
            {[
              {
                number: "01",
                title: "tAImi",
                category: "AI Tutor & e-learning platform",
                year: "2025",
                url: "https://taimi.vercel.app/",
                direction: "left",
              },
              {
                number: "02",
                title: "Thribe",
                category: "Talent Agency Website",
                year: "2025",
                url: "https://www.thribe.io/",
                direction: "left",
              },
              {
                number: "03",
                title: "Op Store",
                category: "Luthier's Ecommerce Website",
                year: "2025",
                url: "https://www.opstore.it/",
                direction: "left",
              },
              {
                number: "04",
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
  const getRevealClass = () => {
    if (!isVisible) {
      return project.direction === "left" ? "-translate-x-16 opacity-0" : "translate-x-16 opacity-0"
    }
    return "translate-x-0 opacity-100"
  }

  return (
    <div
      className={`grid grid-cols-5 gap-4 items-center border-b border-foreground/10 py-4 transition-all duration-700 hover:border-foreground/20 ${getRevealClass()}`}
      style={{
        transitionDelay: `${index * 150}ms`,
      }}
    >
      <div className="font-mono text-sm text-foreground/30 transition-colors group-hover:text-foreground/50 md:text-base">
        {project.number}
      </div>
      <div className="font-mono text-xs text-foreground/30 md:text-sm">
        {project.year}
      </div>
      <div className="font-sans text-sm font-light text-foreground transition-transform duration-300 group-hover:translate-x-1 md:text-base">
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-primary transition-colors duration-300 truncate"
        >
          {project.title}
        </a>
      </div>
      <div className="font-sans text-sm font-light text-foreground md:text-base">
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-primary transition-colors duration-300"
        >
          {project.title}
        </a>
      </div>
      <div className="font-mono text-[10px] uppercase text-foreground/50">
        {project.category}
      </div>
    </div>
  )
}
