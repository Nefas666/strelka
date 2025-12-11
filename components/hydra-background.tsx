"use client"

import { useEffect, useRef } from "react"

export function HydraBackground({ className }: { className?: string }) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const hydraRef = useRef<any>(null)

    useEffect(() => {
        let hydra: any = null

        const initHydra = async () => {
            if (!canvasRef.current) return

            try {
                const Hydra = (await import("hydra-synth")).default

                hydra = new Hydra({
                    canvas: canvasRef.current,
                    detectAudio: false,
                    makeGlobal: false,
                }).synth

                // Random utility functions
                const rng = (min: number, max: number) => Math.random() * (max - min) + min
                const rngInt = (min: number, max: number) => Math.floor(rng(min, max))
                const rngPick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]

                const sketches = [
                    // Preset 1: Dynamic Kaleidoscopic Oscillator
                    (h: any) => {
                        const freq = rng(20, 60)
                        const sides = rngInt(2, 6)
                        const rotSpeed = rng(0.05, 0.2)

                        h.osc(freq, 0.01, 1)
                            .kaleid(sides)
                            .mult(h.osc(rng(5, 20), 0.1, 1))
                            .modulate(h.noise(rng(1, 4), 0.1))
                            .rotate(0, rotSpeed)
                            .color(rng(0.5, 1.5), rng(0.2, 0.8), rng(1, 3))
                            .out()
                    },
                    // Preset 2: Evolving Voronoi
                    (h: any) => {
                        const scale = rng(8, 15)
                        const speed = rng(0.5, 2)
                        const modAmt = rng(0.3, 0.8)

                        h.voronoi(scale, 1, speed)
                            .brightness(() => Math.random() * 0.15)
                            .modulate(h.noise(scale), modAmt)
                            .color(rng(0.2, 0.8), rng(0.5, 1), rng(0.8, 1.2))
                            .out()
                    },
                    // Preset 3: Fluid Noise
                    (h: any) => {
                        const noiseScale = rng(2, 5)
                        const colorContrast = rng(1, 1.5)

                        h.noise(noiseScale, 0.1)
                            .modulateScale(h.noise(noiseScale, 0.1), 0.5)
                            .color(0, rng(0.4, 0.6), rng(0.8, 1))
                            .contrast(colorContrast)
                            .brightness(rng(-0.1, 0.1))
                            .out()
                    },
                    // Preset 4: Glitchy Shapes
                    (h: any) => {
                        const shapeSides = rngInt(3, 6)
                        const repeatX = rngInt(3, 8)
                        const repeatY = rngInt(3, 8)
                        const modFreq = rng(5, 15)

                        h.shape(shapeSides, 0.5)
                            .scale(0.5, 0.5)
                            .repeat(repeatX, repeatY)
                            .modulateScale(h.osc(modFreq, 0.5), -0.5)
                            .modulate(h.noise(2), rng(0.1, 0.3))
                            .color(1, rng(0.1, 0.4), rng(0.4, 0.8))
                            .scrollX(0.01)
                            .out()
                    },
                    // Preset 5: Roto-feedback
                    (h: any) => {
                        const oscFreq = rng(2, 10)
                        h.osc(oscFreq, 0.1, 0.8)
                            .color(rng(0.5, 1.5), 0.3, 0.8)
                            .modulateRotate(h.osc(oscFreq, 0), rng(0.5, 2))
                            .rotate(0, rng(-0.2, 0.2))
                            .out()
                    }
                ]

                // Pick a random sketch
                const randomSketch = sketches[Math.floor(Math.random() * sketches.length)]
                randomSketch(hydra)

                hydraRef.current = hydra
            } catch (e) {
                console.error("Failed to initialize Hydra:", e)
            }
        }

        initHydra()

        const handleResize = () => {
            if (hydra && hydra.setResolution) {
                hydra.setResolution(canvasRef.current?.width || window.innerWidth, canvasRef.current?.height || window.innerHeight)
            }
        }

        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
            if (hydra) {
                // Hydra doesn't have a clear destroy method documented that fully cleans up without refreshing
                // But we can try to stop it if there are methods, or just let it be garbage collected
                // Some versions have .hush() or similar to stop audio/video
            }
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className={`absolute inset-0 w-full h-full -z-10 object-cover ${className}`}
            width={1920}
            height={1080}
        />
    )
}
