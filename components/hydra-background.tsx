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
                    },
                    // Preset 6: Eerie Ear (User Requested)
                    (h: any) => {
                        h.osc(18, 0.1, 0).color(2, 0.1, 2)
                            .mult(h.osc(20, 0.01, 0))
                            .repeat(2, 20)
                            .rotate(0.5)
                            .modulate(h.o1)
                            .scale(1, () => 2 + Math.sin(Date.now() / 2000) * 0.5)
                            .diff(h.o1)
                            .out(h.o0)

                        h.osc(20, 0.2, 0).color(2, 0.7, 0.1)
                            .mult(h.osc(40))
                            .modulateRotate(h.o0, 0.2)
                            .rotate(0.2)
                            .out(h.o1)
                    },
                    // Preset 7: Geometric Shapes & Scroll (User Requested)
                    (h: any) => {
                        const t = () => Date.now() / 1000

                        h.shape(([4, 5, 6] as any).fast(0.1).smooth(1), 0.000001, ([0.2, 0.7] as any).smooth(1))
                            .color(0.2, 0.4, 0.3)
                            .scrollX(() => Math.sin(t() * 0.27))
                            .add(
                                h.shape(([4, 5, 6] as any).fast(0.1).smooth(1), 0.000001, ([0.2, 0.7, 0.5, 0.3] as any).smooth(1))
                                    .color(0.6, 0.2, 0.5)
                                    .scrollY(0.35)
                                    .scrollX(() => Math.sin(t() * 0.33))
                            )
                            .add(
                                h.shape(([4, 5, 6] as any).fast(0.1).smooth(1), 0.000001, ([0.2, 0.7, 0.3] as any).smooth(1))
                                    .color(0.2, 0.4, 0.6)
                                    .scrollY(-0.35)
                                    .scrollX(() => Math.sin(t() * 0.41) * -1)
                            )
                            .add(
                                h.src(h.o0).shift(0.001, 0.01, 0.001)
                                    .scrollX(([0.05, -0.05] as any).fast(0.1).smooth(1))
                                    .scale(([1.05, 0.9] as any).fast(0.3).smooth(1), ([1.05, 0.9, 1] as any).fast(0.29).smooth(1))
                                , 0.85
                            )
                            .modulate(h.voronoi(10, 2, 2))
                            .out()
                    },
                    // Preset 8: Pixelated Colorama
                    (h: any) => {
                        const pixels = rngInt(20, 80)

                        h.osc(rng(15, 40), 0.05, rng(0.5, 1.2))
                            .pixelate(pixels, pixels)
                            .colorama(rng(0.02, 0.2))
                            .modulate(h.noise(rng(2, 6), 0.1), rng(0.05, 0.15))
                            .saturate(rng(0.8, 1.6))
                            .out()
                    },
                    // Preset 9: Gradient Waves
                    (h: any) => {
                        const baseColor = rngPick([[0.05, 0.1, 0.25], [0.15, 0.05, 0.2], [0.05, 0.15, 0.12]])

                        h.gradient(rng(0, 0.5))
                            .modulate(h.noise(rng(1, 4), 0.05), rng(0.2, 0.5))
                            .scrollY(0, rng(0.02, 0.08))
                            .color(baseColor[0], baseColor[1], baseColor[2])
                            .contrast(rng(1, 1.4))
                            .out()
                    },
                    // Preset 10: Voronoi Kaleidoscope
                    (h: any) => {
                        h.voronoi(rng(5, 12), rng(0.05, 0.5), rng(0.3, 1))
                            .kaleid(rngInt(3, 8))
                            .modulateRotate(h.osc(rng(4, 10), 0), rng(0.3, 1))
                            .color(rng(0.3, 0.9), rng(0.2, 0.6), rng(0.5, 1.1))
                            .brightness(rng(-0.15, 0))
                            .out()
                    },
                    // Preset 11: Feedback Dream
                    (h: any) => {
                        const drift = rng(0.001, 0.008)

                        h.noise(rng(4, 10), 0.1)
                            .color(rng(0.2, 0.5), rng(0.3, 0.7), rng(0.6, 1))
                            .modulate(h.noise(rng(2, 5), 0.1), rng(0.1, 0.3))
                            .add(
                                h.src(h.o0).scale(rng(1.005, 1.02)).shift(drift, 0, 0, drift),
                                0.92
                            )
                            .brightness(-0.02)
                            .out(h.o0)
                    },
                    // Preset 12: Posterize Glitch
                    (h: any) => {
                        h.osc(rng(10, 30), 0.1, rng(0.4, 1))
                            .modulatePixelate(h.noise(rng(3, 8), 0.1), rng(10, 60))
                            .posterize(rng(2, 4), rng(0.3, 0.7))
                            .color(rng(0.8, 1.5), rng(0.1, 0.4), rng(0.5, 1))
                            .out()
                    },
                    // Preset 13: Slow Radial Pulse
                    (h: any) => {
                        const t = () => Date.now() / 1000
                        const pulseSpeed = rng(0.2, 0.6)
                        const pulseAmt = rng(0.1, 0.3)
                        const baseColor = rngPick([[0.1, 0.2, 0.4], [0.3, 0.1, 0.3], [0.1, 0.3, 0.25]])

                        h.shape(rngInt(3, 6), rng(0.3, 0.7), rng(0.5, 1.5))
                            .scale(() => 1 + Math.sin(t() * pulseSpeed) * pulseAmt)
                            .modulate(h.noise(rng(1, 3), 0.1), rng(0.1, 0.25))
                            .color(baseColor[0], baseColor[1], baseColor[2])
                            .out()
                    }
                ]

                // Pick a random sketch (or force one with ?bg=N, 1-based)
                const forced = Number(new URLSearchParams(window.location.search).get("bg"))
                const sketchIndex = forced >= 1 && forced <= sketches.length
                    ? forced - 1
                    : Math.floor(Math.random() * sketches.length)
                sketches[sketchIndex](hydra)

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
