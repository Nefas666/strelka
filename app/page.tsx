"use client"

import { HydraBackground } from "@/components/hydra-background"
import { CustomCursor } from "@/components/custom-cursor"
import { GrainOverlay } from "@/components/grain-overlay"
import { WorkSection } from "@/components/sections/work-section"
import { ServicesSection } from "@/components/sections/services-section"
import { AboutSection } from "@/components/sections/about-section"
import { ContactSection } from "@/components/sections/contact-section"
import { MagneticButton } from "@/components/magnetic-button"
import { useRef, useEffect, useState } from "react"
import { useViewportHeight } from "@/hooks/use-viewport-height"

export default function Home() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [currentSection, setCurrentSection] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const touchStartY = useRef(0)
  const touchStartX = useRef(0)
  const scrollThrottleRef = useRef<number | undefined>(undefined)
  const viewportHeight = useViewportHeight()

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const scrollToSection = (index: number) => {
    if (scrollContainerRef.current) {
      const sectionWidth = scrollContainerRef.current.offsetWidth
      scrollContainerRef.current.scrollTo({
        left: sectionWidth * index,
        behavior: "smooth",
      })
      setCurrentSection(index)
    }
  }

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY
      touchStartX.current = e.touches[0].clientX
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (Math.abs(e.touches[0].clientY - touchStartY.current) > 10) {
        e.preventDefault()
      }
    }

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndY = e.changedTouches[0].clientY
      const touchEndX = e.changedTouches[0].clientX
      const deltaY = touchStartY.current - touchEndY
      const deltaX = touchStartX.current - touchEndX

      if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 50) {
        if (deltaY > 0 && currentSection < 4) {
          scrollToSection(currentSection + 1)
        } else if (deltaY < 0 && currentSection > 0) {
          scrollToSection(currentSection - 1)
        }
      }
    }

    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener("touchstart", handleTouchStart, { passive: true })
      container.addEventListener("touchmove", handleTouchMove, { passive: false })
      container.addEventListener("touchend", handleTouchEnd, { passive: true })
    }

    return () => {
      if (container) {
        container.removeEventListener("touchstart", handleTouchStart)
        container.removeEventListener("touchmove", handleTouchMove)
        container.removeEventListener("touchend", handleTouchEnd)
      }
    }
  }, [currentSection])

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault()

        if (!scrollContainerRef.current) return

        scrollContainerRef.current.scrollBy({
          left: e.deltaY,
          behavior: "instant",
        })

        const sectionWidth = scrollContainerRef.current.offsetWidth
        const newSection = Math.round(scrollContainerRef.current.scrollLeft / sectionWidth)
        if (newSection !== currentSection) {
          setCurrentSection(newSection)
        }
      }
    }

    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false })
    }

    return () => {
      if (container) {
        container.removeEventListener("wheel", handleWheel)
      }
    }
  }, [currentSection])

  useEffect(() => {
    const handleScroll = () => {
      if (scrollThrottleRef.current) return

      scrollThrottleRef.current = requestAnimationFrame(() => {
        if (!scrollContainerRef.current) {
          scrollThrottleRef.current = undefined
          return
        }

        const sectionWidth = scrollContainerRef.current.offsetWidth
        const scrollLeft = scrollContainerRef.current.scrollLeft
        const newSection = Math.round(scrollLeft / sectionWidth)

        if (newSection !== currentSection && newSection >= 0 && newSection <= 4) {
          setCurrentSection(newSection)
        }

        scrollThrottleRef.current = undefined
      })
    }

    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener("scroll", handleScroll, { passive: true })
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll)
      }
      if (scrollThrottleRef.current) {
        cancelAnimationFrame(scrollThrottleRef.current)
      }
    }
  }, [currentSection])

  return (
    <main className="relative h-screen w-full overflow-hidden bg-background">
      <CustomCursor />
      <GrainOverlay />

      <div
        className={`fixed inset-0 z-0 transition-opacity duration-700 ${isLoaded ? "opacity-100" : "opacity-0"}`}
        style={{ contain: "strict" }}
      >
        <HydraBackground />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Logo fisso in alto a sinistra */}
      <div className={`pointer-events-none fixed left-4 top-4 z-50 md:left-6 md:top-2 transition-opacity duration-700 ${isLoaded ? "opacity-100" : "opacity-0"}`}>
        <button
          onClick={() => scrollToSection(0)}
          className="pointer-events-auto flex items-center gap-3 transition-transform hover:scale-105"
        >
          <img
            src="/images/logo-white.png"
            alt="Strelka"
            className="h-10 w-auto md:h-24"
          />
        </button>
      </div>

      {/* Navigazione in bottom, vicina al bordo sinistro, con voci di menu grandi */}
      <nav
        className={`fixed top-2 right-0 z-50 flex w-full items-center justify-end px-4 py-3 md:px-6 md:py-4 transition-opacity duration-700 ${isLoaded ? "opacity-100" : "opacity-0"}`}
      >
        <div className="flex items-center gap-4 md:gap-8">
          {["Home", "Progetti", "Servizi", "About", "Contatti"].map((item, index) => {
            const isActive = currentSection === index

            return (
              <button
                key={item}
                onClick={() => scrollToSection(index)}
                className={`relative font-sans invert-75 text-lg md:text-4xl font-light transition-colors duration-300 ${isActive ? "text-foreground" : "text-foreground/0 hidden"}`}
              >
                {item}
                {/* <span
                  className={`absolute -top-1 left-0 h-px bg-foreground transition-all duration-300 ${isActive ? "w-full" : "w-0"}`}
                /> */}
              </button>
            )
          })}
        </div>
      </nav>

      <div
        ref={scrollContainerRef}
        data-scroll-container
        className={`relative z-10 flex h-screen overflow-x-auto overflow-y-hidden transition-opacity duration-700 ${isLoaded ? "opacity-100" : "opacity-0"
          }`}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {/* Hero Section */}
        <section className="flex w-screen shrink-0 flex-col justify-end px-4 pb-16 pt-16 md:px-6 md:pb-24 md:pt-24" style={{ height: viewportHeight }}>
          <div className="max-w-3xl">

            <h1 className="mb-4 animate-in fade-in slide-in-from-bottom-8 font-sans text-4xl font-light leading-[1.1] tracking-tight text-foreground duration-1000 md:text-6xl lg:text-8xl">
              <span className="text-balance">
                Esperienze digitali
                <br />
                in evoluzione
              </span>
            </h1>
            <p className="mb-6 max-w-xl animate-in fade-in slide-in-from-bottom-4 text-base leading-relaxed text-foreground/90 duration-1000 delay-200 md:text-lg lg:text-xl">
              <span className="text-pretty">
                Trasformare la tua attività con soluzioni web moderne, design personalizzato e tecnologie innovative che ti distinguono dalla concorrenza.
              </span>
            </p>
            <div className="flex animate-in fade-in slide-in-from-bottom-4 flex-col gap-3 duration-1000 delay-300 sm:flex-row sm:items-center">
              <MagneticButton
                size="lg"
                variant="primary"
                onClick={() => scrollToSection(4)}
              >
                Richiedi un Preventivo
              </MagneticButton>
              <MagneticButton size="lg" variant="secondary" onClick={() => scrollToSection(2)}>
                Scopri i Servizi
              </MagneticButton>
            </div>
          </div>

          {/* <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-in fade-in duration-1000 delay-500">
            <div className="flex items-center gap-2">
              <p className="font-mono text-xs text-foreground/80">Scroll to explore</p>
              <div className="flex h-6 w-12 items-center justify-center rounded-full border border-foreground/20 bg-foreground/15 backdrop-blur-md">
                <div className="h-2 w-2 animate-pulse rounded-full bg-foreground/80" />
              </div>
            </div>
          </div> */}
        </section>

        <WorkSection />
        <ServicesSection />
        <AboutSection scrollToSection={scrollToSection} />
        <ContactSection />
      </div>

      <style jsx global>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </main>
  )
}
