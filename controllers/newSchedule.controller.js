const Joi = require('joi');
const Schedule = require('../models/newSchedule.model');

module.exports = {
  RequestNewSchedule: async (req, res) => {
    const schema = Joi.object({
      description: Joi.string().required(),
      date: Joi.date().raw().required(),      
    });

    const validation = schema.validate(req.body);
    if (validation.error) {
      res.status(400).send({ message: validation.error.message });
      return;
    }
    const data = validation.value;
    const result = await Schedule(data);
    if (result.success) {
      return res.status(200).json({
        success: true,
        message: 'Request sent successfully!',
        result: result.result,
      });
    } else {
      return res.status(400).send({ message: result.message });
    }
  },  
};
