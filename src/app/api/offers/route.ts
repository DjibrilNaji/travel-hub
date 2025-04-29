import { mongo } from "@/lib/db";
import { StatusCodes } from "http-status-codes";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const from = searchParams.get("from");
  const to = searchParams.get("from");
  const limit = parseInt(searchParams.get("limit") || "10", 10);

  if (!from || !to)
    return NextResponse.json(
      { error: "Missing parameters" },
      { status: StatusCodes.BAD_REQUEST }
    );

  const cacheKey = `offers:${from}:${to}`;

  const offers = await mongo.collection("offers").find().toArray();

  return NextResponse.json({}, { status: StatusCodes.OK });
}
