//展覽廠商
const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  // 部門名稱
  name: {
    type: String,
    unique: true,
    index: true,
    required: true,
  },
  position: {
    type: [
      {
        name: { type: String, unique: true },
        value: { type: String, unique: true },
      },
    ],
    default: [
      { name: '部門經理', value: 'manger' },
      { name: '其他', value: 'other' },
    ],
  },
  //員工數量
  memberCount: {
    type: Number,
    required: true,
  },
  // 部門員工
  member: {
    type: [mongoose.Schema.ObjectId],
    ref: 'Worker',
    validate: [
      function (arr) {
        return this.memberCount >= arr.length;
      },
      '已超過部門設定人數上限',
    ],
  },
});

const Department = mongoose.model(
  'Department',
  departmentSchema,
  'departments'
);

module.exports = Department;
