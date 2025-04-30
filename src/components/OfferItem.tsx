"use client"

import { getOfferById } from "@/app/services/offers"
import { useQuery } from "@tanstack/react-query"
import Spinner from "./Spinner"

import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Calendar, Clock, Hotel, MapPin, Plane } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"

interface OfferItemProps {
  id: string
}

export default function OfferItem({ id }: OfferItemProps) {
  const { isPending, isError, error, data } = useQuery({
    queryKey: ["offer", id],
    queryFn: async () => await getOfferById(id)
  })

  if (isPending) {
    return <Spinner />
  }

  if (isError) {
    return <span>Error: {error.message}</span>
  }

  return (
    <div className="mx-10 flex flex-col">
      <main className="flex-1 py-8">
        <div className="grid gap-6">
          <div className="flex items-center gap-4">
            <Link href="/offers">
              <Button variant="outline" size="sm" className="cursor-pointer gap-1">
                <ArrowLeft className="h-4 w-4" /> Retour
              </Button>
            </Link>
            <h1 className="text-2xl font-bold tracking-tight">
              {data.offer.from} → {data.offer.to}
            </h1>
          </div>

          <div className="grid gap-8">
            <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">
                      Vol de {data.offer.from} à {data.offer.to}
                    </CardTitle>
                    <CardDescription>
                      Proposé par {data.offer.provider} • ID: {id}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="flex items-center gap-3 rounded-lg border p-4">
                        <Calendar className="text-muted-foreground h-5 w-5" />
                        <div>
                          <p className="text-sm font-medium">Date de départ</p>
                          <p className="text-muted-foreground text-sm">
                            {new Date(data.offer.departDate).toLocaleDateString("fr-FR")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 rounded-lg border p-4">
                        <Calendar className="text-muted-foreground h-5 w-5" />
                        <div>
                          <p className="text-sm font-medium">Date de retour</p>
                          <p className="text-muted-foreground text-sm">
                            {new Date(data.offer.returnDate).toLocaleDateString("fr-FR")}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-semibold">Vols</h3>
                      <div className="space-y-3">
                        {data.offer.legs.map((leg, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-4 rounded-lg border p-4"
                          >
                            <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                              <Plane className="text-primary h-5 w-5" />
                            </div>
                            <div className="grid gap-1">
                              <p className="font-medium">Vol {leg.flightNum}</p>
                              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                                <span>{leg.dep}</span>
                                <ArrowRight className="h-3 w-3" />
                                <span>{leg.arr}</span>
                                <span className="ml-2 flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {leg.duration} min
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {data.offer.hotel && (
                      <div className="space-y-2">
                        <h3 className="font-semibold">Hébergement</h3>
                        <div className="flex items-center gap-4 rounded-lg border p-4">
                          <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                            <Hotel className="text-primary h-5 w-5" />
                          </div>
                          <div className="grid gap-1">
                            <p className="font-medium">{data.offer.hotel.name}</p>
                            <p className="text-muted-foreground text-sm">
                              {data.offer.hotel.nights} nuits • {data.offer.hotel.price}
                              {data.offer.currency}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {data.offer.activity && (
                      <div className="space-y-2">
                        <h3 className="font-semibold">Activité</h3>
                        <div className="flex items-center gap-4 rounded-lg border p-4">
                          <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                            <MapPin className="text-primary h-5 w-5" />
                          </div>
                          <div className="grid gap-1">
                            <p className="font-medium">{data.offer.activity.title}</p>
                            <p className="text-muted-foreground text-sm">
                              {data.offer.activity.price} {data.offer.currency}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Résumé du prix</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Vol</span>
                      <span>
                        {data.offer.price} {data.offer.currency}
                      </span>
                    </div>
                    {data.offer.hotel && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Hébergement</span>
                        <span>
                          {data.offer.hotel.price} {data.offer.currency}
                        </span>
                      </div>
                    )}
                    {data.offer.activity && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Activité</span>
                        <span>
                          {data.offer.activity.price} {data.offer.currency}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between border-t pt-4 font-bold">
                      <span>Total</span>
                      <span>
                        {(
                          data.offer.price +
                          (data.offer.hotel ? data.offer.hotel.price : 0) +
                          (data.offer.activity ? data.offer.activity.price : 0)
                        ).toFixed(2)}{" "}
                        {data.offer.currency}
                      </span>
                    </div>
                    <Button className="mt-4 w-full cursor-pointer">Réserver maintenant</Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
