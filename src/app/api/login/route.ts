import cacheHandler from "@/lib/cache"
import { StatusCodes } from "http-status-codes"
import { NextRequest, NextResponse } from "next/server"
import { v4 as uuid } from "uuid"

const CACHE_EXPIRATION = 900

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { message: "L'id de l'utilisateur est requis" },
        { status: StatusCodes.BAD_REQUEST }
      )
    }

    const token = uuid()
    await cacheHandler.set(`session:${token}`, userId, "EX", CACHE_EXPIRATION)

    return NextResponse.json({ token, expires_in: CACHE_EXPIRATION }, { status: StatusCodes.OK })
  } catch (error) {
    console.error("Erreur lors de la création du token :", error)

    return NextResponse.json(
      { message: "Erreur lors de la création du token" },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    )
  }
}
