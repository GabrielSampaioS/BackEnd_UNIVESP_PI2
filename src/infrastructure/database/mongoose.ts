import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config()

export async function connectDatabase() {

  const uri = process.env.MONGO_URI || "mongodb://localhost:27017/db_test_mongo"

  try {

    await mongoose.connect(uri)

    console.log("MongoDB conectado com sucesso")

  } catch (error) {

    console.error("Erro ao conectar no MongoDB:", error)

    process.exit(1)

  }

}