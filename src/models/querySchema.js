import Joi from 'joi';

export const transactionQuerySchema = Joi.object({
  type: Joi.string()
    .valid('income', 'expense')
    .default(null),
  from: Joi.date()
    .iso()
    .default(null),
  to: Joi.date()
    .iso()
    .min(Joi.ref('from'))
    .default(null),
  category: Joi.string()
    .trim()
    .default(null)
}).with('to', 'from'); // If 'to' is present, 'from' must also be present 