import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const URI = process.env.MONGO_URL;
  if (!URI) {
    return NextResponse.json({ error: "MongoDB URI is not defined in environment variables" }, { status: 500 });
  }

  const client = new MongoClient(URI);

  try {
    await client.connect(); // Connect to the database
    const database = client.db("blackcofer");
    const checkers = database.collection("continent");

    const url = new URL(request.url);
    const query = Object.fromEntries(url.searchParams.entries());

    const filter: any = {};
    for (const [key, value] of Object.entries(query)) {
      if (value) {
        filter[key] = isNaN(Number(value)) ? value : Number(value);
      }
    }

    const country = await checkers.find(filter).toArray();

    return NextResponse.json({ country });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  } finally {
    await client.close();
  }
}
