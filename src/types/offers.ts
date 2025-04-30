export type OfferType = {
  _id?: string
  from: string
  to: string
  departDate: Date
  returnDate: Date
  provider?: string
  price: number
  currency: string
  legs: FlightLeg[]
  hotel?: Hotel
  activity?: Activity
}

export type FlightLeg = {
  flightNum: string
  dep: string
  arr: string
  duration: number
}

export type Hotel = {
  name: string
  nights: number
  price: number
}

export type Activity = {
  title: string
  price: number
}

export type OfferItem = {
  offer: OfferType
  relatedOffers?: string[]
}
