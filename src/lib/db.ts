import { MongoClient } from "mongodb";

const uri =
  "mongodb+srv://adammehdaouijorge:mdp@travelhub.mhpqsp6.mongodb.net/?retryWrites=true&w=majority&appName=TravelHub";

const client = new MongoClient(uri!);

export const mongo = client.db("sample_mflix");
