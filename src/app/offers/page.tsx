"use client"

import AirportSelect from "@/components/AirportSelect"
import Spinner from "@/components/Spinner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import { OfferType } from "@/types/offers"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import Link from "next/link"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { getOffers } from "../services/offers"

const FormSchema = z.object({
  from: z.string().min(2, {
    message: "Selectionnez un aéroport de départ."
  }),
  to: z.string().min(2, {
    message: "Selectionnez un aéroport d'arrivée."
  })
})

export default function OffersPage() {
  const [offers, setOffers] = useState<OfferType[]>([])

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      from: "",
      to: ""
    }
  })

  const { isPending, mutate } = useMutation({
    mutationFn: async ({ from, to }: { from: string; to: string }) => await getOffers(from, to),
    onSuccess: (data) => {
      setOffers(data)
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    mutate({ from: data.from, to: data.to })
  }

  if (isPending) {
    return <Spinner />
  }

  return (
    <div className="flex flex-col gap-4 p-10">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Rechercher un vol</h1>

        <Link href="/offers/create">
          <Button variant="outline" size="sm" className="cursor-pointer gap-1">
            Create Offer
          </Button>
        </Link>
      </div>
      <Form {...form}>
        <Card className="mx-auto w-full">
          <CardHeader>
            <CardTitle>Rechercher un vol</CardTitle>
            <CardDescription>
              Sélectionnez les aéroports de départ et d&apos;arrivée
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
              <div className="flex flex-col gap-6 md:flex-row md:items-end">
                <AirportSelect
                  form={form}
                  name="from"
                  label="Départ"
                  placeholder="Sélectionnez le départ"
                />
                <AirportSelect
                  form={form}
                  name="to"
                  label="Arrivée"
                  placeholder="Sélectionnez l'arrivée"
                />
              </div>
              <Button type="submit" className="w-full cursor-pointer md:w-fit">
                Rechercher
              </Button>
            </form>
          </CardContent>
        </Card>
      </Form>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Nos offres</h1>
        </div>

        {offers && offers.length > 0 ? (
          offers.map((offer) => (
            <div
              key={offer._id}
              className="hover:bg-accent/50 flex items-center justify-between rounded-lg border p-3 transition-colors"
            >
              <div className="flex flex-col">
                <div className="font-medium">
                  {offer.from} → {offer.to}
                </div>
                <div className="text-muted-foreground text-sm">
                  {new Date(offer.departDate).toLocaleDateString("fr-FR")} •{" "}
                  {new Date(offer.departDate).toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold">
                  {offer.price} {offer.currency}
                </span>
                <Link href={`/offers/${offer._id}`}>
                  <Button variant="outline" size="sm" className="cursor-pointer">
                    Détails
                  </Button>
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div>
            <p className="text-muted-foreground">Aucune offre trouvée.</p>
            <p className="text-muted-foreground">
              Essayez de changer les aéroports de départ et d&apos;arrivée.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
