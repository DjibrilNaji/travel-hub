import cache from "@/lib/cache"
import { mongo } from "@/lib/db"
import { StatusCodes } from "http-status-codes"
import { ObjectId } from "mongodb"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.from || !body.to || !body.price || !body.provider) {
      return NextResponse.json(
        { message: "Missing parameters" },
        { status: StatusCodes.BAD_REQUEST }
      )
    }

    const offer = {
      _id: new ObjectId(),
      from: body.from,
      to: body.to,
      price: body.price,
      provider: body.provider,
      departDate: new Date(body.departDate),
      returnDate: new Date(body.returnDate)
    }

    await mongo.collection("offers").insertOne(offer)
    await cache.publish(
      "offers:new",
      JSON.stringify({
        offerId: offer._id.toHexString(),
        from: offer.from,
        to: offer.to
      })
    )

    return NextResponse.json({ offer }, { status: StatusCodes.CREATED })
  } catch (error) {
    return NextResponse.json(
      { message: "Erreur lors de la création du token" },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    )
  }
}
