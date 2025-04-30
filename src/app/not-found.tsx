"use client"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-5">
      <div className="flex flex-col items-center gap-3">
        <h1 className="text-4xl font-bold">404</h1>
        <h2 className="text-2xl font-semibold">Page Not Found</h2>
        <p className="text-lg text-gray-600">The page you are looking for does not exist.</p>
      </div>

      <Button className="cursor-pointer" onClick={() => router.push("/")}>
        Go to Home
      </Button>
    </div>
  )
}
