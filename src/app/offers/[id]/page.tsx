"use client"

import OfferItem from "@/components/OfferItem"
import { useParams } from "next/navigation"

export default function OfferPage() {
  const { id } = useParams<{ id: string }>()

  if (!id) {
    return <span>Erreur: ID de l&apos;offre manquant</span>
  }

  return <OfferItem id={id} />
}
