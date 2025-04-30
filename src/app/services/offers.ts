import routes from "@/routes"
import { OfferItem, OfferType } from "@/types/offers"
import axiosClient from "@/utils/axiosInstance"

export const getOffers = async (from: string, to: string): Promise<OfferType[]> => {
  const data = await axiosClient.get(routes.api.offers.getOffers(from, to), {})

  return data.data
}

export const getOfferById = async (id: string): Promise<OfferItem> => {
  const data = await axiosClient.get(routes.api.offers.getOfferById(id))

  return data.data
}

export const createOffer = async (offerData: OfferType) => {
  const data = await axiosClient.post(routes.api.offers.createOffer, offerData)
  return data.data
}
