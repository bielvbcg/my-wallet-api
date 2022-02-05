import entrySchema from "../schemas/entrySchema.js";

export default function validateEntrySchemaMiddleware(req, res, next) {
  //const entry = {...req.body , value: parseFloat(req.body.value)}

  const validation = entrySchema.validate(req.body, { abortEarly: false })

  if (validation.error) {
    const erros = validation.error.details.map(detail => detail.message)

    return res.status(422).send(erros)
  }

  next()
}