"use client"

import { logout } from "@/app/services/auth"
import { Button } from "@/components/ui/button"
import { useApp } from "@/context/useAppContext"
import { useMutation } from "@tanstack/react-query"
import { LogOut, Plane } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function Navbar() {
  const router = useRouter()

  const { isAuthenticated, userId, tokenValue, setIsAuthenticated } = useApp()

  const { isPending, mutate } = useMutation({
    mutationFn: async () => await logout(userId, tokenValue),
    onSuccess: () => {
      document.cookie = "token=; path=/; max-age=0"
      document.cookie = "userId=; path=/; max-age=0"

      setIsAuthenticated(false)
      router.push("/login")
      toast.success("Vous vous êtes déconnecté avec succès.")
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  return (
    <header className="sticky top-0 z-50 border-b bg-white">
      <div className="flex h-16 items-center justify-between px-8">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold">
          <Plane className="h-5 w-5" />
          Travel Hub
        </Link>

        <nav className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link href="/offers">
                <Button className="cursor-pointer">Offres</Button>
              </Link>

              <Button onClick={() => mutate()} className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                {isPending ? "Déconnexion..." : "Déconnexion"}
              </Button>
            </>
          ) : (
            <Link href="/login">
              <Button className="cursor-pointer">Se connecter</Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
