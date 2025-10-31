"use client"

import { MagneticButton } from "@/components/magnetic-button"
import { useReveal } from "@/hooks/use-reveal"

export function AboutSection({ scrollToSection }: { scrollToSection?: (index: number) => void }) {
  const { ref, isVisible } = useReveal(0.3)

  return (
    <section
      ref={ref}
      className="flex h-screen w-screen shrink-0 snap-start items-center px-4 pt-20 md:px-12 md:pt-0 lg:px-16"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div className="grid gap-8 md:grid-cols-2 md:gap-16 lg:gap-24">
          {/* Right side - Profile Card */}
          <div className="flex flex-col justify-center">
            <div
              className={`border border-foreground/10 rounded-lg p-6 transition-all duration-700 ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-12 opacity-0"
                }`}
              style={{ transitionDelay: "300ms" }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-primary text-2xl font-light">SM</span>
                </div>
                <div>
                  <h3 className="text-xl font-light text-primary">Strelka</h3>
                  <p className="text-foreground font-medium">Selene Manno</p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <p className="text-foreground font-light">Web Designer & Developer</p>
                <div className="space-y-1">
                  <a
                    href="mailto:contact@strelka.it"
                    className="text-foreground/80 font-light hover:text-primary transition-colors text-sm"
                  >
                    contact@strelka.it
                  </a>
                  <p className="text-foreground/80 font-light text-sm">www.strelka.it</p>
                </div>
              </div>

              <div className="pt-4 border-t border-foreground/10">
                <p className="text-primary font-medium text-sm">Proietta la tua attività nel web</p>
              </div>
            </div>
          </div>

          {/* Right side - Stats with creative layout */}
          <div className="flex flex-col justify-center space-y-6 md:space-y-12">
            {[
              { value: "150+", label: "Projects", sublabel: "Delivered worldwide", direction: "right" },
              { value: "8", label: "Years", sublabel: "Of innovation", direction: "left" },
              { value: "12", label: "Awards", sublabel: "Industry recognition", direction: "right" },
            ].map((stat, i) => {
              const getRevealClass = () => {
                if (!isVisible) {
                  return stat.direction === "left" ? "-translate-x-16 opacity-0" : "translate-x-16 opacity-0"
                }
                return "translate-x-0 opacity-100"
              }

              return (
                <div
                  key={i}
                  className={`flex items-baseline gap-4 border-l border-foreground/30 pl-4 transition-all duration-700 md:gap-8 md:pl-8 ${getRevealClass()}`}
                  style={{
                    transitionDelay: `${300 + i * 150}ms`,
                    marginLeft: i % 2 === 0 ? "0" : "auto",
                    maxWidth: i % 2 === 0 ? "100%" : "85%",
                  }}
                >
                  <div className="text-3xl font-light text-foreground md:text-6xl lg:text-7xl">{stat.value}</div>
                  <div>
                    <div className="font-sans text-base font-light text-foreground md:text-xl">{stat.label}</div>
                    <div className="font-mono text-xs text-foreground/60">{stat.sublabel}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div
          className={`mt-8 flex flex-wrap gap-3 transition-all duration-700 md:mt-16 md:gap-4 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
            }`}
          style={{ transitionDelay: "750ms" }}
        >
          <MagneticButton size="lg" variant="primary" onClick={() => scrollToSection?.(4)}>
            Start a Project
          </MagneticButton>
          <MagneticButton size="lg" variant="secondary" onClick={() => scrollToSection?.(1)}>
            View Our Work
          </MagneticButton>
        </div>
      </div>
    </section>
  )
}
