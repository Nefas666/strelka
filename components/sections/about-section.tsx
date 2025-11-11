"use client"

import { useState, useEffect, useRef } from "react"
import { MagneticButton } from "@/components/magnetic-button"
import { useReveal } from "@/hooks/use-reveal"
import { useMaxViewportHeight } from "@/hooks/use-viewport-height"

function DvDFavicon() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [velocity, setVelocity] = useState({ x: 3, y: 2 })
  const [isAnimating, setIsAnimating] = useState(false)
  const [colorIndex, setColorIndex] = useState(0)
  const sectionRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number>()
  const faviconSize = 32

  const colors = [
    'filter hue-rotate-0',
    'filter hue-rotate-90',
    'filter hue-rotate-180',
    'filter hue-rotate-270',
    'filter saturate-150',
    'filter brightness-125'
  ]

  useEffect(() => {
    if (!isAnimating || !sectionRef.current) return

    const animate = () => {
      if (!sectionRef.current) return

      const rect = sectionRef.current.getBoundingClientRect()
      const maxX = rect.width - faviconSize
      const maxY = rect.height - faviconSize

      setPosition((prevPos) => {
        let newX = prevPos.x + velocity.x
        let newY = prevPos.y + velocity.y
        let newVelX = velocity.x
        let newVelY = velocity.y
        let hitWall = false

        if (newX <= 0 || newX >= maxX) {
          newVelX = -velocity.x
          newX = newX <= 0 ? 0 : maxX
          hitWall = true
        }

        if (newY <= 0 || newY >= maxY) {
          newVelY = -velocity.y
          newY = newY <= 0 ? 0 : maxY
          hitWall = true
        }

        if (hitWall) {
          setVelocity({ x: newVelX, y: newVelY })
          setColorIndex((prev) => (prev + 1) % colors.length)
        }

        return { x: newX, y: newY }
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isAnimating, velocity.x, velocity.y, colors.length])

  const handleClick = () => {
    if (!isAnimating) {
      // Reset position to current click position and random velocity
      setPosition({ x: 0, y: 0 })
      setVelocity({
        x: 2 + Math.random() * 3,
        y: 2 + Math.random() * 3
      })
      setColorIndex(0)
    }
    setIsAnimating(!isAnimating)
  }

  return (
    <>
      {/* Clickable favicon in the header */}
      <div className="inline-flex items-center gap-2">
        <div className="relative">
          {/* Pixel art balloon */}
          {!isAnimating && (
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
              <div className="relative">
                {/* Speech bubble */}
                <div className="bg-foreground text-background text-xs px-2 py-1 rounded-sm font-mono tracking-wider">
                  <p className="break-keep whitespace-nowrap">hover me</p>
                </div>
                {/* Triangle pointer */}
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-foreground"></div>
              </div>
            </div>
          )}
          <div
            className="relative w-12 h-12 overflow-hidden border-none bg-transparent blur-md cursor-pointer transition-all hover:blur-none"
            onClick={handleClick}
          >
            <img
              src="/favicon-32x32.png"
              alt="Favicon DVD"
              className={`absolute w-8 h-8 m-2 transition-transform hover:scale-105 ${isAnimating ? colors[colorIndex] : ''}`}
            />
            {isAnimating && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Animated favicon that moves across the section */}
      {isAnimating && (
        <div
          ref={sectionRef}
          className="absolute inset-0 pointer-events-none z-50"
          style={{
            width: '100%',
            height: '100%'
          }}
        >
          <img
            src="/favicon-32x32.png"
            alt="Favicon DVD"
            className={`absolute w-8 h-8 ${colors[colorIndex]}`}
            style={{
              transform: `translate(${position.x}px, ${position.y}px)`,
              transition: 'none'
            }}
          />
        </div>
      )}
    </>
  )
}

export function AboutSection({ scrollToSection }: { scrollToSection?: (index: number) => void }) {
  const { ref, isVisible } = useReveal(0.3)
  const maxHeight = useMaxViewportHeight()

  return (
    <section
      ref={ref}
      className="flex w-screen shrink-0 snap-start items-center px-4 pt-12 md:px-6 md:pt-20 lg:px-16"
      style={{ height: maxHeight, maxHeight: maxHeight }}
    >
      <div className="mx-auto w-full max-w-7xl">
        <div className="grid gap-6 md:grid-cols-2 md:gap-16 lg:gap-24">
          {/* Right side - Profile Card */}
          <div>
            <div
              className={`mb-4 transition-all duration-700 md:mb-12 ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-12 opacity-0"
                }`}
            >
              <div className="flex flex-col mb-3 md:mb-4">
                <h2 className="font-sans text-3xl font-light leading-[1.1] tracking-tight text-foreground md:text-6xl lg:text-7xl">
                  aka/
                  <br />
                  <div className="flex items-center gap-3">
                    Selene
                    <span className="text-foreground/40">M.</span>
                    <DvDFavicon />
                  </div>
                </h2>
              </div>
            </div>

            <div
              className={`space-y-3 transition-all duration-700 md:space-y-4 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                }`}
              style={{ transitionDelay: "200ms" }}
            >
              <p className="max-w-md text-sm leading-relaxed text-foreground/90 md:text-lg">
                Sono una sviluppatrice web freelance con la passione per l'innovazione e la tecnologia.

              </p>
              <p className="max-w-md text-sm leading-relaxed text-foreground/90 md:text-lg">
                Mi sono specializzata nello sviluppo di soluzioni web moderne e performanti e nel design dei componenti funzionali, utilizzando le tecnologie più recenti per creare esperienze web su misura per le tue esigenze.

              </p>
            </div>
          </div>


          {/* Right side - Stats with creative layout */}
          <div className="flex flex-col justify-center space-y-6 md:space-y-12">
            {[
              { value: "6+", label: "Progetti", sublabel: "Progetti On Going", direction: "right" },
              { value: "5", label: "Anni", sublabel: "Di esperienza", direction: "left" },
              { value: "12+", label: "Clienti", sublabel: "Clienti & Collaborazioni", direction: "right" },
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
            Hai un progetto in mente? Parliamone
          </MagneticButton>
        </div>
      </div>
    </section>
  )
}
