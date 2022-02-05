import joi from 'joi';

const entrySchema = joi.object({
  value: joi.number().required(),
  description: joi.string().required(),
  type: joi.any().valid("in", "out").required(),
})

export default entrySchema