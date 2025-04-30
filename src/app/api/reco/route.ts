import neo4jDriver from "@/lib/neo4j";
import { StatusCodes } from "http-status-codes";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const city = searchParams.get("city");
  const k = parseInt(searchParams.get("k") ?? "3", 10);

  if (!city) {
    return NextResponse.json(
      { error: "Missing city parameter" },
      { status: StatusCodes.BAD_REQUEST }
    );
  }

  const session = neo4jDriver.session();

  const cypher = `
    MATCH (c:City {code: "${city}"})-[r:NEAR]->(n:City)
    RETURN n.code AS city, r.weight AS score
    ORDER BY r.weight DESC
    LIMIT ${k}
  `;

  const result = await session.run(cypher, { city, k });
  const recommendedCities = result.records.map((record) => ({
    city: record.get("city"),
    score: record.get("score"),
  }));

  session.close();

  return NextResponse.json(recommendedCities);
}