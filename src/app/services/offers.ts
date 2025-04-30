import routes from "@/routes"
import axiosClient from "@/utils/axiosInstance"

export const getOffers = async (from: string, to: string) => {
  const data = await axiosClient.get(routes.api.offers.getOffers(from, to), {})

  return data.data
}

export const getOfferById = async (id: string) => {
  const data = await axiosClient.get(routes.api.offers.getOfferById(id))

  return data.data
}
