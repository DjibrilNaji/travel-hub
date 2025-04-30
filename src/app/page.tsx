import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Bell, MapPin, Plane, Search } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 py-12">
        <div className="mx-auto max-w-5xl">
          <section className="space-y-6 py-12 text-center">
            <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl">
              Votre plateforme de voyage personnalisée
            </h1>
            <p className="text-muted-foreground mx-auto max-w-3xl text-xl">
              Découvrez des itinéraires sur mesure, des offres exclusives et une expérience de
              voyage unique.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/login">
                <Button size="lg" className="cursor-pointer gap-2">
                  <Plane className="h-5 w-5" />
                  Commencer
                </Button>
              </Link>
            </div>
          </section>

          <section className="py-12">
            <h2 className="mb-12 text-center text-3xl font-bold">Fonctionnalités disponibles</h2>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <Card className="bg-background border">
                <CardHeader>
                  <Bell className="text-primary mb-2 h-10 w-10" />
                  <CardTitle>Notifications en temps réel</CardTitle>
                  <CardDescription>
                    Soyez alerté des nouvelles offres correspondant à vos critères.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Recevez des notifications personnalisées pour ne manquer aucune opportunité de
                    voyage.
                  </p>
                </CardContent>
                <CardFooter>
                  <Link href="/login" className="w-full">
                    <Button variant="outline" className="w-full cursor-pointer">
                      Découvrir
                    </Button>
                  </Link>
                </CardFooter>
              </Card>

              <Card className="bg-background border">
                <CardHeader>
                  <Search className="text-primary mb-2 h-10 w-10" />
                  <CardTitle>Recherche d'offres</CardTitle>
                  <CardDescription>
                    Trouvez rapidement les meilleures offres pour votre destination.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Filtrez par date, prix et compagnie pour trouver l'offre qui vous convient
                    parfaitement.
                  </p>
                </CardContent>
                <CardFooter>
                  <Link href="/login" className="w-full">
                    <Button variant="outline" className="w-full cursor-pointer">
                      Découvrir
                    </Button>
                  </Link>
                </CardFooter>
              </Card>

              <Card className="bg-background border">
                <CardHeader>
                  <MapPin className="text-primary mb-2 h-10 w-10" />
                  <CardTitle>Recommandations personnalisées</CardTitle>
                  <CardDescription>
                    Découvrez des destinations qui correspondent à vos préférences.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Notre système intelligent vous suggère des destinations en fonction de vos
                    recherches précédentes.
                  </p>
                </CardContent>
                <CardFooter>
                  <Link href="/login" className="w-full">
                    <Button variant="outline" className="w-full cursor-pointer">
                      Découvrir
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </section>

          <section className="py-12 text-center">
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="text-2xl">
                  Prêt à découvrir votre prochaine destination ?
                </CardTitle>
                <CardDescription>
                  Connectez-vous pour accéder à toutes les fonctionnalités de Travel Hub.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/login">
                  <Button size="lg" className="mt-2 cursor-pointer">
                    Se connecter
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    </div>
  )
}
