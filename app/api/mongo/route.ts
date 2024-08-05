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
    // Retrieve unique countries and sort them alphabetically
    const country = await checkers.distinct("country");
    const end_year = await checkers.distinct("end_year"); 
    const topic = await checkers.distinct("topic"); 
    const source = await checkers.distinct("source");
    const region = await checkers.distinct("region");
    const sector = await checkers.distinct("sector");
    const pestle = await checkers.distinct("pestle")

    

// Check the output in the console

    return NextResponse.json({ country, end_year, topic, source, region , sector, pestle }); // Return the data as a response
  } 
  


  
  finally {
    // Close the connection after the data is retrieved
    await client.close();
  }
}