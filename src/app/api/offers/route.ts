import cache from "@/lib/cache"
import { mongo } from "@/lib/db"
import { StatusCodes } from "http-status-codes"
import { NextRequest, NextResponse } from "next/server"
import zlib from "zlib"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)

  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const limit = parseInt(searchParams.get("limit") ?? "10", 10);

  if (!from || !to)
    return NextResponse.json({ error: "Missing parameters" }, { status: StatusCodes.BAD_REQUEST })

  const cacheKey = `offers:${from}:${to}`
  const cached = await cache.getBuffer(cacheKey)

  if (cached) {
    const json = zlib.gunzipSync(cached).toString()
    return NextResponse.json(JSON.parse(json))
  }

  try {
    const offers = await mongo
      .collection("offers")
      .find(
        { from, to },
        {
          projection: {
            id: 1,
            from: 1,
            to: 1,
            departDate: 1,
            returnDate: 1,
            price: 1,
            currency: 1
          }
        }
      )
      .sort({ price: 1 })
      .limit(limit)
      .toArray()

    const compressed = zlib.gzipSync(JSON.stringify(offers))
    await cache.set(cacheKey, compressed, "EX", 60)

    return NextResponse.json(offers)
  } catch (error) {
    console.error("Error fetching offers:", error);

    return NextResponse.json(
      { error: "An internal server error occurred." },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    )
  }
}
