"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useApp } from "@/context/useAppContext"
import { LoginType } from "@/types/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { login } from "../services/auth"

const FormSchema = z.object({
  userId: z.string().min(2, {
    message: "L'identifiant doit comporter au moins 2 caractères"
  })
})

export default function LoginPage() {
  const router = useRouter()
  const { setIsAuthenticated, setTokenValue } = useApp()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      userId: ""
    }
  })

  const { isPending, mutate } = useMutation({
    mutationFn: async (userId: string) => await login(userId),
    onSuccess: (data) => {
      document.cookie = `token=${data.token}; path=/; max-age=${data.expires_in}`
      document.cookie = `userId=${form.getValues().userId}; path=/; max-age=${data.expires_in}`
      setIsAuthenticated(true)
      setTokenValue(data.token)
      toast.success("Vous vous êtes connecté avec succès.")
      router.push("/offers")
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  const handleSubmit = (values: LoginType) => {
    mutate(values.userId)
  }

  return (
    <Form key="login" {...form}>
      <div className="flex h-full items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Connexion</CardTitle>

            <CardDescription>Entrez votre identifiant pour accéder à votre compte</CardDescription>
          </CardHeader>

          <CardContent className="grid gap-4">
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="userId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Entrez votre email" {...field} maxLength={50} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button className="mt-4 w-full" type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connexion en cours...
                  </>
                ) : (
                  "Se connecter"
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter>
            <p className="text-muted-foreground text-sm">
              Utilisez n&apos;importe quel identifiant (ex: u42).
            </p>
          </CardFooter>
        </Card>
      </div>
    </Form>
  )
}
