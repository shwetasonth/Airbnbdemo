const Joi=require('joi');

const textField = Joi.string()
  .pattern(/^[^0-9]*$/)
  .required()
  .messages({
    "string.pattern.base": "{{#label}} must not contain numbers",
  });

module.exports.listingSchema=Joi.object({
  listing:Joi.object({
    title:textField,
    description:textField,
    location:textField,
    country:textField,
    price:Joi.number().required().min(0),
    image:Joi.string().allow("",null),
  }).required()
});



module.exports.reviewSchema=Joi.object({
  review:Joi.object({
    rating:Joi.number().required().min(1).max(5),
    comment:Joi.string().required(),
  }).required()
});