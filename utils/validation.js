const Joi = require("joi");

const productRowSchema = Joi.object({
  sku: Joi.string().trim().required(),
  name: Joi.string().trim().required(),
  brand: Joi.string().trim().required(),
  color: Joi.string().trim().allow("", null),
  size: Joi.string().trim().allow("", null),
  mrp: Joi.number().positive().required(),
  price: Joi.number().positive().required(),
  quantity: Joi.number().integer().min(0).required(),
});

function validateProductRow(row) {
  const { error, value } = productRowSchema.validate(row, { convert: true, stripUnknown: true });
  if (error) {
    return { valid: false, errors: error.details };
  }
  
  if (value.price > value.mrp) {
    return {
      valid: false,
      errors: [
        {
          message: "price must be ≤ mrp",
          path: ["price"],
        },
      ],
    };
  }
  return { valid: true, value };
}

module.exports = {
  validateProductRow,
};
