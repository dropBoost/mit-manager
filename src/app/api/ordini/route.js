import { NextResponse } from "next/server";
import { getOrdiniQuery } from "@/utils/dataDB/getOrdiniQuery";

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 10);

  const search = searchParams.get("search") || "";
  const sede = searchParams.get("sede") || "";
  const stato_ordine = searchParams.get("stato_ordine") || "CRT";
  const data = searchParams.get("data") || "";

  const result = await getOrdiniQuery({
    page,
    limit,
    search,
    sede,
    stato_ordine,
    data,
  });

  return NextResponse.json(result);
}