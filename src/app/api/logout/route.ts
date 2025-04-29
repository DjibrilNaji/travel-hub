import cache from "@/lib/cache"
import { StatusCodes } from "http-status-codes"
import { NextRequest, NextResponse } from "next/server"

export async function DELETE(request: NextRequest) {
  const { userId, token } = await request.json()

  if (!userId) {
    return NextResponse.json(
      { message: "User id et username requis" },
      { status: StatusCodes.BAD_REQUEST }
    )
  }

  await cache.del(`session:${token}`)

  return NextResponse.json(
    {
      message: `Deconexion de l'utilisateur : ${userId} avec le token : ${token} reussi`
    },
    { status: StatusCodes.OK }
  )
}
