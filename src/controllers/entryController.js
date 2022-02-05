import db from '../db.js';

export async function newEntry(req, res) {
  try {
    const user = res.locals.user
    const newEntry = req.body

    await db.collection("users").findOneAndUpdate(
      { _id: user._id },
      { $set: { entrys: [...user?.entrys, newEntry] } }
    )

    res.status(201).send("deu bom")

  } catch (error) {
    res.status(500).send(error.message)
  }
}

export async function getEntries(req, res) {
  try {
    const user = res.locals.user

    const entries = await db.collection("users").findOne({ _id: user._id })
    res.status(200).send(entries.entrys)

  } catch (error) {
    res.status(500).send(error.message)
  }
}