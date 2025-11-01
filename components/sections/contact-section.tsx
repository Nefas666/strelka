"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { toast } from "@/components/ui/use-toast"
import { submitContactForm, type ContactFormData } from "@/app/actions/contact-form"
import { Mail, MapPin, Check, X } from "lucide-react"
import { useReveal } from "@/hooks/use-reveal"
import { MagneticButton } from "@/components/magnetic-button"
import { useMaxViewportHeight } from "@/hooks/use-viewport-height"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Il nome deve contenere almeno 2 caratteri.",
  }),
  email: z.string().email({
    message: "Inserisci un indirizzo email valido.",
  }),
  phone: z.string().optional(),
  projectType: z.string({
    required_error: "Seleziona il tipo di progetto.",
  }),
  budget: z.string({
    required_error: "Seleziona il budget.",
  }),
  message: z.string().min(10, {
    message: "Il messaggio deve contenere almeno 10 caratteri.",
  }),
})

export function ContactSection() {
  const { ref, isVisible } = useReveal(0.3)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const maxHeight = useMaxViewportHeight()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    try {
      const result = await submitContactForm(values as ContactFormData)

      if (result.success) {
        // Mostra la modale di successo invece del toast
        setShowSuccessModal(true)
        // Reset del form
        form.reset()
      } else {
        toast({
          title: "Errore",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'invio del modulo. Riprova più tardi.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section
      ref={ref}
      className="flex w-screen shrink-0 snap-start items-center px-4 pt-16 md:px-6 md:pt-20 lg:px-16"
      style={{ height: maxHeight, maxHeight: maxHeight }}
    >
      <div className="mx-auto w-full max-w-7xl">
        <div className="grid gap-8 md:grid-cols-[1.2fr_1fr] md:gap-16 lg:gap-24">
          <div className="flex flex-col justify-center">
            <div
              className={`mb-6 transition-all duration-700 md:mb-12 ${isVisible ? "translate-x-0 opacity-100" : "-translate-x-12 opacity-0"
                }`}
            >
              <h2 className="mb-2 font-sans text-4xl font-light leading-[1.05] tracking-tight text-foreground md:mb-3 md:text-7xl lg:text-8xl">
                Contattami
              </h2>
              <p className="font-mono text-xs text-foreground/60 md:text-base">/ Richiedi un preventivo</p>
            </div>

            <div className="space-y-4 md:space-y-8">
              <a
                href="mailto:info@strelka.it"
                className={`group block transition-all duration-700 ${isVisible ? "translate-x-0 opacity-100" : "-translate-x-16 opacity-0"
                  }`}
                style={{ transitionDelay: "200ms" }}
              >
                <div className="mb-1 flex items-center gap-2">
                  <Mail className="h-3 w-3 text-foreground/60" />
                  <span className="font-mono text-xs text-foreground/60">Email</span>
                </div>
                <p className="text-base text-foreground transition-colors group-hover:text-foreground/70 md:text-2xl">
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
                <p className="text-base text-foreground md:text-2xl">Italia, EU</p>
              </div>

              <div
                className={`flex gap-2 pt-2 transition-all duration-700 md:pt-4 ${isVisible ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-0"
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

          {/* Right side - Minimal form */}
          <div className="flex flex-col justify-center">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
                <div
                  className={`transition-all duration-700 ${isVisible ? "translate-x-0 opacity-100" : "translate-x-16 opacity-0"
                    }`}
                  style={{ transitionDelay: "200ms" }}
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-mono text-xs text-foreground/60">Nome e Cognome</FormLabel>
                        <FormControl>
                          <input
                            type="text"
                            {...field}
                            className="w-full border-b border-foreground/30 bg-transparent py-1.5 text-sm text-foreground placeholder:text-foreground/40 focus:border-foreground/50 focus:outline-none md:py-2 md:text-base"
                            placeholder="Mario Rossi"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div
                  className={`transition-all duration-700 ${isVisible ? "translate-x-0 opacity-100" : "translate-x-16 opacity-0"
                    }`}
                  style={{ transitionDelay: "350ms" }}
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-mono text-xs text-foreground/60">Email</FormLabel>
                        <FormControl>
                          <input
                            type="email"
                            {...field}
                            className="w-full border-b border-foreground/30 bg-transparent py-1.5 text-sm text-foreground placeholder:text-foreground/40 focus:border-foreground/50 focus:outline-none md:py-2 md:text-base"
                            placeholder="mario.rossi@esempio.it"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div
                  className={`transition-all duration-700 ${isVisible ? "translate-x-0 opacity-100" : "translate-x-16 opacity-0"
                    }`}
                  style={{ transitionDelay: "425ms" }}
                >
                  <FormField
                    control={form.control}
                    name="projectType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-mono text-xs text-foreground/60">Tipo di Progetto</FormLabel>
                        <FormControl>
                          <select
                            {...field}
                            className="w-full border-b border-foreground/30 bg-transparent py-1.5 text-sm text-foreground focus:border-foreground/50 focus:outline-none md:py-2 md:text-base"
                          >
                            <option value="" className="bg-background">Seleziona...</option>
                            <option value="website" className="bg-background">Sito Web</option>
                            <option value="ecommerce" className="bg-background">E-commerce</option>
                            <option value="app" className="bg-background">Applicazione</option>
                            <option value="branding" className="bg-background">Branding</option>
                            <option value="other" className="bg-background">Altro</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div
                  className={`transition-all duration-700 ${isVisible ? "translate-x-0 opacity-100" : "translate-x-16 opacity-0"
                    }`}
                  style={{ transitionDelay: "475ms" }}
                >
                  <FormField
                    control={form.control}
                    name="budget"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-mono text-xs text-foreground/60">Budget</FormLabel>
                        <FormControl>
                          <select
                            {...field}
                            className="w-full border-b border-foreground/30 bg-transparent py-1.5 text-sm text-foreground focus:border-foreground/50 focus:outline-none md:py-2 md:text-base"
                          >
                            <option value="" className="bg-background">Seleziona...</option>
                            <option value="<1000" className="bg-background">Meno di 1000€</option>
                            <option value="1000-3000" className="bg-background">1000€ - 3000€</option>
                            <option value="3000-5000" className="bg-background">3000€ - 5000€</option>
                            <option value="5000-10000" className="bg-background">5000€ - 10000€</option>
                            <option value=">10000" className="bg-background">Più di 10000€</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div
                  className={`transition-all duration-700 ${isVisible ? "translate-x-0 opacity-100" : "translate-x-16 opacity-0"
                    }`}
                  style={{ transitionDelay: "500ms" }}
                >
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-mono text-xs text-foreground/60">Descrizione Progetto</FormLabel>
                        <FormControl>
                          <textarea
                            rows={3}
                            {...field}
                            className="w-full border-b border-foreground/30 bg-transparent py-1.5 text-sm text-foreground placeholder:text-foreground/40 focus:border-foreground/50 focus:outline-none md:py-2 md:text-base"
                            placeholder="Descrivi il tuo progetto..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div
                  className={`transition-all duration-700 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
                    }`}
                  style={{ transitionDelay: "700ms" }}
                >
                  <MagneticButton
                    variant="primary"
                    size="lg"
                    className="w-full disabled:opacity-50"
                    onClick={isSubmitting ? undefined : undefined}
                  >
                    {isSubmitting ? "Invio in corso..." : "Invia Richiesta"}
                  </MagneticButton>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </section>
  )
}
