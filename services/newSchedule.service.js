// const { genSaltSync, hashSync, compareSync } = require('bcrypt');
// const { sign } = require('jsonwebtoken');
// const Schedule = require('../models/newSchedule.model');
// const crypto = require('crypto');

// module.exports = {
//   requestSchedule: async (data) => {
//     const date = data.date.slice(0, 10);
//     data.date = date;
//     const doctor = new Schedule(data);
//     const isExist = await Schedule.find({ date: data.date });
//     if (isExist) {
//       return { success: false, message: 'This schedule is already exist' };
//     }
//     const result = await doctor.save();

//     return { success: true, result: result };
//   },
// };
