import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI!;
const dbName = process.env.MONGODB_DB!;

if (!uri) throw new Error("Please define the MONGODB_URI environment variable");
if (!dbName) throw new Error("Please define the MONGODB_DB environment variable");

let cachedClient: MongoClient | null = null;
let cachedDb : Db | null = null;

export async function connectDatabase() : Promise<{ client: MongoClient; db: Db}> {
    if(cachedClient && cachedDb) {
        return { client: cachedClient, db: cachedDb };
    }

   try {
        const client = await MongoClient.connect(uri);
        const db = client.db(dbName);

        cachedClient = client;
        cachedDb = db;

        console.log('Connected to mongodb');

        return { client, db };

    } catch(err) {
        console.error('Failed to connect with database', err);
        throw new Error('Database connection failed')
    }
}