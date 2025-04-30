import cache from "@/lib/cache";
import { mongo } from "@/lib/db";
import neo4j from "@/lib/neo4j";
import { StatusCodes } from "http-status-codes";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import zlib from "zlib";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<Params> }
) {
  const resolvedParams = await params;

  if (!resolvedParams.id || resolvedParams.id.length !== 24) {
    return NextResponse.json(
      { error: "Missing id parameter" },
      { status: StatusCodes.BAD_REQUEST }
    );
  }

  const cacheKey = `offer:${resolvedParams.id}`;

  const cached = await cache.getBuffer(cacheKey);

  if (cached) {
    const json = zlib.gunzipSync(cached).toString();

    return NextResponse.json(JSON.parse(json));
  }

  try {
    const offer = await mongo
      .collection("offers")
      .findOne({ _id: new ObjectId(resolvedParams.id) });

    if (!offer) {
      return NextResponse.json(
        { error: "Offer not found" },
        { status: StatusCodes.NOT_FOUND }
      );
    }

    const session = neo4j.session();

    const cypher = `
      MATCH (o:Offer {_id: "${resolvedParams.id}"})-[:FROM|TO]->(city:City)<-[:FROM|TO]-(related:Offer)
      WHERE related._id <> "${resolvedParams.id}"
      RETURN DISTINCT related._id LIMIT 3
    `;

    const result = await session.run(cypher, { id: resolvedParams.id });
    const relatedOffers = result.records.map((record) =>
      record.get("related._id")
    );

    session.close();

    const compressed = zlib.gzipSync(JSON.stringify({ offer, relatedOffers }));
    await cache.set(cacheKey, compressed, "EX", 300);

    return NextResponse.json(
      { offer, relatedOffers },
      { status: StatusCodes.OK }
    );
  } catch (error) {
    console.error("Error fetching offer:", error);

    return NextResponse.json(
      { error: `Internal error: ${error}` },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}

type Params = { id: string };
