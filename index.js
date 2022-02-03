import express from "express"
import cors from "cors"
import dayjs from 'dayjs';
import { MongoClient, ObjectId } from "mongodb"
import joi from "joi"
import { stripHtml } from "string-strip-html";
import dotenv from "dotenv";
import bcrypt from "bcrypt"
import { v4 as tokenGenerator } from "uuid"

const app = express()
app.use(express.json())
app.use(cors())
dotenv.config();

let db;
let usersCollection;
let tokensCollection;

const mongoClient = new MongoClient(process.env.MONGO_URI)
mongoClient.connect().then(() => {
  db = mongoClient.db("my-wallet")
  usersCollection = db.collection("users")
  tokensCollection = db.collection("tokens")
})

app.post('/sign-up', async (req, res) => {

  const userSchema = joi.object({
    name: joi.string().required(),
    email: joi.string().email({ tlds: { allow: false } }).required(),
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

app.post('/login', async (req, res) => {

  const userSchema = joi.object({
    email: joi.string().email({ tlds: { allow: false } }).required(),
    password: joi.string().required()
  })

  const validation = userSchema.validate(req.body, { abortEarly: false })

  if (validation.error) {
    const erros = validation.error.details.map(detail => detail.message)

    return res.status(422).send(erros)
  }

  try {
    const { email, password } = req.body;
    const user = await usersCollection.findOne({ email })

    if (!user || !bcrypt.compareSync(password, user.password)) return res.status(401).send("Usuário ou senha inválidos")

    const token = tokenGenerator()

    await tokensCollection.insertOne({
      userId: user._id,
      token,
      time: Date.now()
    })

    res.status(200).send({ token, name: user.name })

  } catch (error) {
    res.status(500).send(error.message.details)
  }

})


app.listen(5000)