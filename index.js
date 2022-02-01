import express from "express"
import cors from "cors"
import dayjs from 'dayjs';
import { MongoClient, ObjectId } from "mongodb"
import joi from "joi"
import { stripHtml } from "string-strip-html";
import dotenv from "dotenv";

const server = express()
server.use(express.json())
server.use(cors())
dotenv.config();

let db;

const mongoClient = new MongoClient(process.env.MONGO_URI)
mongoClient.connect().then(async () => {
  db = mongoClient.db("my-wallet")
})


server.listen(5000)