import express from "express"
import cors from "cors"
import dayjs from 'dayjs';
import { MongoClient, ObjectId } from "mongodb"
import joi from "joi"
import { stripHtml } from "string-strip-html";
import dotenv from "dotenv";
import bcrypt from "bcrypt"

const app = express()
app.use(express.json())
app.use(cors())
dotenv.config();

let db;
let usersCollection;

const mongoClient = new MongoClient(process.env.MONGO_URI)
mongoClient.connect().then(() => {
  db = mongoClient.db("my-wallet")
  usersCollection = db.collection("users")
})

app.post('/sign-up', async (req, res) => {

  const userSchema = joi.object({
    name: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().required()
  })

  const validation = userSchema.validate(req.body, { abortEarly: false })

  if (validation.error) {
    const erros = validation.error.details.map(detail => detail.message)

    return res.status(422).send(erros)
  }

  try {
    const user = req.body;

    const passwordHash = bcrypt.hashSync(user.password, 10)

    await usersCollection.insertOne({ ...user, password: passwordHash })

    res.sendStatus(201)

  } catch (error) {
    res.status(500).send(error.message.details)
  }

})


app.listen(5000)