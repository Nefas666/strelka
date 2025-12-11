"use client"

import React, { useState, useEffect, useRef } from "react"
import { Shader, ChromaFlow, Swirl } from "shaders/react"
import { CustomCursor } from "@/components/custom-cursor"
import { GrainOverlay } from "@/components/grain-overlay"
import { Check, Info, Lock, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import Link from "next/link"

// Background Component defined outside
const Background = ({ isLoaded, shaderContainerRef }: { isLoaded: boolean, shaderContainerRef: React.RefObject<HTMLDivElement | null> }) => (
    <div
        ref={shaderContainerRef}
        className={`fixed inset-0 z-0 transition-opacity duration-1000 ${isLoaded ? "opacity-100" : "opacity-0"}`}
        style={{ contain: "strict" }}
    >
        <Shader className="h-full w-full">
            <Swirl
                colorA="#1e3a5f"
                colorB="#d4628e"
                speed={0.5} // Slower speed for reading
                detail={0.8}
                blend={50}
            />
            <ChromaFlow
                baseColor="#2d3748"
                upColor="#1e3a5f"
                downColor="#4a5568"
                leftColor="#d4628e"
                rightColor="#d4628e"
                intensity={0.6}
                opacity={0.8}
            />
        </Shader>
        <div className="absolute inset-0 bg-background/40 backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
    </div>
)

export default function PriceListPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [clientType, setClientType] = useState("new")
    const [isLoaded, setIsLoaded] = useState(false)
    const shaderContainerRef = useRef<HTMLDivElement>(null)

    // Shader loading effect similar to home page
    useEffect(() => {
        const timer = setTimeout(() => setIsLoaded(true), 500)
        return () => clearTimeout(timer)
    }, [])

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const response = await fetch('/api/verify-listino', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password }),
            })

            const data = await response.json()

            if (data.success) {
                setIsAuthenticated(true)
                toast.success("Accesso effettuato")
            } else {
                toast.error(data.message || "Password non corretta")
            }
        } catch (error) {
            toast.error("Errore durante la verifica")
        } finally {
            setIsLoading(false)
        }
    }

    // Data from original file
    const packages = [
        {
            name: 'Essential',
            period: 'Trimestrale',
            hours: '8 ore',
            price: '€240',
            pricePerHour: '€25/ora',
            description: 'Per siti vetrina stabili',
            features: [
                'Aggiornamenti core & plugin',
                'Backup trimestrali',
                'Controllo sicurezza base',
                'Report trimestrale'
            ],
            best: false,
            recommended: true
        },
        {
            name: 'Growth',
            period: 'Mensile',
            hours: '6 ore/mese',
            price: '€270',
            pricePerHour: '€45/ora',
            description: 'Per siti attivi ed e-commerce',
            features: [
                'Tutto di Essential (mensile)',
                'Monitoring performance',
                'Interventi prioritari',
                'Supporto email 48h',
                'Report mensili dettagliati'
            ],
            best: true,
            recommended: false
        },
        {
            name: 'Partner',
            period: 'Mensile',
            hours: '12 ore/mese',
            price: '€480',
            pricePerHour: '€40/ora',
            description: 'Per clienti strategici',
            features: [
                'Tutto di Growth',
                'Consulenza strategica inclusa',
                'SLA risposta 24h',
                'Priorità assoluta',
                'Call mensile revisione',
                'Ottimizzazioni proattive'
            ],
            best: false,
            recommended: false
        }
    ];

    const hourlyRates = {
        existing: {
            standard: '€32',
            extra: '€35',
            note: 'Tariffa attuale mantenuta per 6 mesi, poi €40/ora'
        },
        new: {
            standard: '€50',
            extra: '€65',
            note: 'Per progetti e interventi spot'
        }
    } as const; // Add type assertion to fix indexing


    return (
        <main className="relative min-h-screen w-full bg-background overflow-x-hidden">
            <CustomCursor />
            <GrainOverlay />
            <Background isLoaded={isLoaded} shaderContainerRef={shaderContainerRef} />

            {!isAuthenticated ? (
                <div className="relative z-10 w-full h-screen flex items-center justify-center px-4">
                    <div className="w-full max-w-md">
                        <div className="mb-8 text-center">
                            <Link href="/" className="inline-block hover:scale-105 transition-transform duration-300">
                                <img src="/images/logo-white.png" alt="Strelka" className="h-16 mx-auto mb-4" />
                            </Link>
                        </div>

                        <Card className="border-white/10 bg-black/40 backdrop-blur-md shadow-2xl">
                            <CardHeader className="text-center">
                                <div className="mx-auto w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4 border border-primary/20">
                                    <Lock className="w-6 h-6 text-primary" />
                                </div>
                                <CardTitle className="text-2xl font-light">Area Riservata</CardTitle>
                                <CardDescription>Inserisci la password per visualizzare il listino</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleLogin} className="space-y-4">
                                    <Input
                                        type="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="bg-white/5 border-white/10 text-center text-lg tracking-widest focus-visible:ring-primary"
                                        autoFocus
                                    />
                                    <Button
                                        type="submit"
                                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? "Verifica..." : "Accedi"}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            ) : (
                <div className="relative z-10 container mx-auto px-4 py-12 md:py-24">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
                        <div className="text-center md:text-left">
                            <Link href="/" className="inline-block mb-4 md:hidden">
                                <img src="/images/logo-white.png" alt="Strelka" className="h-12" />
                            </Link>
                            <h1 className="text-4xl md:text-6xl font-light tracking-tight mb-4">
                                Listino <span className="text-primary font-normal">2025</span>
                            </h1>
                            <p className="text-lg text-muted-foreground max-w-xl">
                                Soluzioni trasparenti e scalabili per la tua presenza digitale.
                            </p>
                        </div>

                        <div className="hidden md:block">
                            <Link href="/">
                                <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                                    Torna alla Home <ArrowRight className="ml-2 w-4 h-4" />
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Client Type Toggle */}
                    <div className="flex justify-center mb-16">
                        <div className="bg-white/5 p-1 rounded-full backdrop-blur-sm border border-white/10">
                            <Tabs value={clientType} onValueChange={setClientType} className="w-[300px]">
                                <TabsList className="grid w-full grid-cols-2 bg-transparent">
                                    <TabsTrigger
                                        value="new"
                                        className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full transition-all duration-300"
                                    >
                                        Nuovo Cliente
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="existing"
                                        className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full transition-all duration-300"
                                    >
                                        Già Cliente
                                    </TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>
                    </div>

                    {/* Hourly Rates Cards */}
                    <div className="grid md:grid-cols-2 gap-6 mb-24 max-w-4xl mx-auto">
                        <Card className="bg-white/5 border-white/10 backdrop-blur-sm rounded-none transition-colors duration-300">
                            <CardHeader>
                                <CardTitle className="text-muted-foreground text-sm uppercase tracking-wider">Tariffa Standard</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-bold text-foreground">
                                        {hourlyRates[clientType as keyof typeof hourlyRates].standard}
                                    </span>
                                    <span className="text-muted-foreground">/ora</span>
                                </div>
                                <p className="text-sm text-muted-foreground mt-2">Per interventi programmati</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/5 border-orange-500/20 backdrop-blur-sm rounded-none transition-colors duration-300 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-3 opacity-10">
                                <Info className="w-24 h-24" />
                            </div>
                            <CardHeader>
                                <CardTitle className="text-orange-500/80 text-sm uppercase tracking-wider">Extra / Urgenze</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-bold text-orange-500">
                                        {hourlyRates[clientType as keyof typeof hourlyRates].extra}
                                    </span>
                                    <span className="text-muted-foreground">/ora</span>
                                </div>
                                <p className="text-sm text-muted-foreground mt-2">Per interventi non pianificati</p>
                            </CardContent>
                        </Card>

                        <div className="md:col-span-2 mt-2">
                            <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/20 text-sm text-blue-200">
                                <Info className="w-5 h-5 shrink-0 mt-0.5" />
                                <p>{hourlyRates[clientType as keyof typeof hourlyRates].note}</p>
                            </div>
                        </div>
                    </div>

                    {/* Packages Grid */}
                    <div className="mb-12 text-center">
                        <h2 className="text-3xl font-light mb-4">Pacchetti Maintenance</h2>
                        <p className="text-muted-foreground">Sicurezza e aggiornamenti costanti per il tuo business</p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8 mb-24">
                        {packages.map((pkg) => (
                            <Card
                                key={pkg.name}
                                className={`relative border-white/10 bg-white/5 backdrop-blur-md flex flex-col rounded-none transition-colors duration-300 ${pkg.best ? 'border-primary/50 ring-1 ring-primary/50 shadow-lg shadow-primary/10' :
                                    pkg.recommended ? 'border-orange-500/50 ring-1 ring-orange-500/50 shadow-lg shadow-orange-500/10' : ''
                                    }`}
                            >
                                {pkg.best && (
                                    <div className="absolute -top-4 left-0 right-0 flex justify-center">
                                        <Badge className="bg-primary hover:bg-primary text-primary-foreground px-4 py-1 text-sm font-medium rounded-full shadow-lg">
                                            Più Richiesto
                                        </Badge>
                                    </div>
                                )}
                                {pkg.recommended && (
                                    <div className="absolute -top-4 left-0 right-0 flex justify-center">
                                        <Badge className="bg-orange-500 hover:bg-orange-500 text-white px-4 py-1 text-sm font-medium rounded-full shadow-lg">
                                            Consigliato
                                        </Badge>
                                    </div>
                                )}

                                <CardHeader className="text-center pb-2">
                                    <CardTitle className="text-2xl font-bold mb-2">{pkg.name}</CardTitle>
                                    <CardDescription className="text-sm min-h-10">{pkg.description}</CardDescription>
                                </CardHeader>

                                <CardContent className="flex-1 flex flex-col items-center pb-8">
                                    <div className="mb-6 text-center">
                                        <div className="flex items-baseline justify-center gap-1">
                                            <span className="text-4xl font-bold">{pkg.price}</span>
                                            <span className="text-muted-foreground text-sm">/{pkg.period.toLowerCase()}</span>
                                        </div>
                                        <div className="flex flex-col gap-1 mt-2">
                                            <span className="text-sm font-medium text-foreground/80">{pkg.hours}</span>
                                            <span className="text-xs text-primary">{pkg.pricePerHour}</span>
                                        </div>
                                    </div>

                                    <div className="w-full h-px bg-white/10 mb-6" />

                                    <ul className="space-y-4 w-full text-left">
                                        {pkg.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-start gap-3 text-sm text-muted-foreground">
                                                <div className="mt-1 rounded-full bg-green-500/20 p-1">
                                                    <Check className="w-3 h-3 text-green-500" />
                                                </div>
                                                <span className="flex-1">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Footer Notes */}
                    <div className="max-w-3xl mx-auto border border-white/10 bg-black/20 backdrop-blur-sm p-8">
                        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                            <Info className="w-5 h-5 text-primary" />
                            Condizioni del servizio
                        </h3>
                        <ul className="grid gap-4 text-sm text-muted-foreground">
                            <li className="flex gap-3">
                                <span className="block w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                                <span>Le ore non utilizzate nei pacchetti mensili non sono cumulabili nel mese successivo.</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="block w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                                <span>Le ore del pacchetto Essential (trimestrale) possono essere utilizzate liberamente nell'arco dei 3 mesi.</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="block w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                                <span>Pagamento anticipato all'inizio del periodo di riferimento.</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="block w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                                <span>Possibilità di upgrade del pacchetto in qualsiasi momento con conguaglio.</span>
                            </li>
                        </ul>

                        <div className="mt-8 pt-6 border-t border-white/10 text-center text-xs text-muted-foreground/60">
                            <p>Listino aggiornato al {new Date().getFullYear()} • Prezzi IVA esclusa</p>
                        </div>
                    </div>

                </div>
            )}
        </main>
    )
}
