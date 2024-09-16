import { MongoClient } from "mongodb";

let client = null;

export async function connectToDatabase() {
  if (client) {
    console.log("Using existing connection");

    return client;
  }

  const uri = process.env.MONGODB_URI;
  client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("New connection established");

    return client;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}

export async function listCollections() {
  const client = await connectToDatabase();
  const db = client.db(); // assumes database name is in the connection string
  const collections = await db.listCollections().toArray();
  return collections.map((collection) => collection.name);
}

export async function closeConnection() {
  if (client) {
    await client.close();
    client = null;
    console.log("Connection closed");
  }
}
