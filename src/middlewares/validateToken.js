import db from "../db.js";

export default async function validateToken(req, res, next) {
  try {
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).send("Envia um token ai patrão");
    }

    const session = await db.collection('tokens').findOne({ token });
    if (!session) {
      return res.status(401).send("token invalido")
    }

    const participant = await db.collection('users').findOne({ _id: session.userId });
    if (!participant) {
      return res.status(401).send("dono do token não encontrado");
    }

    delete participant.password;
    res.locals.user = participant;

    next();
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}