"use client"

import AirportSelect from "@/components/AirportSelect"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { format } from "date-fns"
import { CalendarIcon, Loader2, Plus, Trash } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { createOffer } from "../../services/offers"

const legSchema = z.object({
  flightNum: z.string().min(2, "Le numéro de vol est requis"),
  dep: z.string().min(2, "L'aéroport de départ est requis"),
  arr: z.string().min(2, "L'aéroport d'arrivée est requis"),
  duration: z.coerce.number().min(1, "La durée est requise")
})

const hotelSchema = z.object({
  name: z.string().min(2, "Le nom de l'hôtel est requis"),
  nights: z.coerce.number().min(1, "Le nombre de nuits est requis"),
  price: z.coerce.number().min(1, "Le prix est requis")
})

const activitySchema = z.object({
  title: z.string().min(2, "Le titre de l'activité est requis"),
  price: z.coerce.number().min(1, "Le prix est requis")
})

const formSchema = z.object({
  from: z.string().min(2, "L'aéroport de départ est requis"),
  to: z.string().min(2, "L'aéroport d'arrivée est requis"),
  departDate: z.date({
    required_error: "La date de départ est requise"
  }),
  returnDate: z.date({
    required_error: "La date de retour est requise"
  }),
  provider: z.string().min(2, "Le fournisseur est requis"),
  price: z.coerce.number().min(1, "Le prix est requis"),
  currency: z.string().min(1, "La devise est requise"),
  legs: z.array(legSchema).min(1, "Au moins un vol est requis"),
  hotel: hotelSchema.optional(),
  activity: activitySchema.optional()
})

const PROVIDERS = [
  "American Airlines",
  "British Airways",
  "Delta Airlines",
  "JetBlue Airways",
  "Qantas Airways",
  "AirZen"
]

const CURRENCIES = [
  { code: "USD", label: "Dollar américain (USD)" },
  { code: "EUR", label: "Euro (EUR)" },
  { code: "GBP", label: "Livre sterling (GBP)" }
]

export default function CreateOfferPage() {
  const router = useRouter()
  const [includeHotel, setIncludeHotel] = useState(false)
  const [includeActivity, setIncludeActivity] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      from: "",
      to: "",
      provider: "",
      price: 0,
      currency: "USD",
      legs: [
        {
          flightNum: "",
          dep: "",
          arr: "",
          duration: 0
        }
      ],
      hotel: {
        name: "",
        nights: 0,
        price: 0
      },
      activity: {
        title: "",
        price: 0
      }
    }
  })

  const {
    fields: legFields,
    append: appendLeg,
    remove: removeLeg
  } = useFieldArray({
    control: form.control,
    name: "legs"
  })

  const { mutate, isPending } = useMutation({
    mutationFn: createOffer,
    onSuccess: async () => {
      toast.success("Offre créée avec succès")
      router.push("/offers")
    },
    onError: (error) => {
      toast.error(`Erreur lors de la création de l'offre: ${error.message}`)
    }
  })

  function onSubmit(data: z.infer<typeof formSchema>) {
    if (!includeHotel) {
      delete data.hotel
    }
    if (!includeActivity) {
      delete data.activity
    }

    mutate(data)
  }

  return (
    <div className="mx-10 py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Créer une nouvelle offre</h1>
        <Button variant="outline" onClick={() => router.back()} className="cursor-pointer">
          Retour
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Informations de base</CardTitle>
              <CardDescription>Entrez les informations principales de l&apos;offre</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <AirportSelect
                  form={form}
                  name="from"
                  label="Aéroport de départ"
                  placeholder="Sélectionnez l'aéroport de départ"
                />
                <AirportSelect
                  form={form}
                  name="to"
                  label="Aéroport d'arrivée"
                  placeholder="Sélectionnez l'aéroport d'arrivée"
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="departDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date de départ</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Sélectionnez une date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="returnDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date de retour</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Sélectionnez une date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="provider"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Compagnie aérienne</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez une compagnie" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {PROVIDERS.map((provider) => (
                            <SelectItem key={provider} value={provider}>
                              {provider}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prix</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Prix" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Devise</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez une devise" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {CURRENCIES.map((currency) => (
                            <SelectItem key={currency.code} value={currency.code}>
                              {currency.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Vols</CardTitle>
              <CardDescription>Ajoutez les détails des vols</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {legFields.map((field, index) => (
                <div key={field.id} className="space-y-4 rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Vol {index + 1}</h3>
                    {legFields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeLeg(index)}
                        className="text-destructive cursor-pointer"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid gap-4 md:grid-cols-4">
                    <FormField
                      control={form.control}
                      name={`legs.${index}.flightNum`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Numéro de vol</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: BA123" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`legs.${index}.dep`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Départ</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: LHR" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`legs.${index}.arr`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Arrivée</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: JFK" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`legs.${index}.duration`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Durée (minutes)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="Ex: 480" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => appendLeg({ flightNum: "", dep: "", arr: "", duration: 1 })}
                className="cursor-pointer"
              >
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un vol
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Hébergement (optionnel)</CardTitle>
                  <CardDescription>Ajoutez les détails de l&apos;hébergement</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="includeHotel"
                    checked={includeHotel}
                    onChange={(e) => setIncludeHotel(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <label htmlFor="includeHotel" className="text-sm font-medium">
                    Inclure un hébergement
                  </label>
                </div>
              </div>
            </CardHeader>
            {includeHotel && (
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="hotel.name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom de l&apos;hôtel</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Grand Hotel" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="hotel.nights"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre de nuits</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Ex: 7" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="hotel.price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prix</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Ex: 500" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            )}
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Activité (optionnel)</CardTitle>
                  <CardDescription>Ajoutez les détails d&apos;une activité</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="includeActivity"
                    checked={includeActivity}
                    onChange={(e) => setIncludeActivity(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <label htmlFor="includeActivity" className="text-sm font-medium">
                    Inclure une activité
                  </label>
                </div>
              </div>
            </CardHeader>
            {includeActivity && (
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="activity.title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Titre de l&apos;activité</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Visite guidée" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="activity.price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prix</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Ex: 100" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            )}
          </Card>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="cursor-pointer"
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isPending} className="cursor-pointer">
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Création en cours...
                </>
              ) : (
                "Créer l'offre"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
