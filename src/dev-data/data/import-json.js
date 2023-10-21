const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../../model/userModel');
const Order = require('../../model/orderModel');
const Exhibition = require('../../model/exhibitionModel');

dotenv.config({ path: './config.env' });

//
const DB = {
  server: process.env.DATABASE.replace('<password>', process.env.DB_PASSWORD),
  local: process.env.DATABASE_LOCAL,
};

mongoose
  .connect(DB.server, {
    useNewUrlParser: true,
  })
  .then(() => console.log('使用自動寫入本地JSON腳本'));

//file in dev-data/data
function readJsonFile(fileName) {
  return JSON.parse(
    fs.readFileSync(`${__dirname}/${fileName}.json`, 'utf-8', (err) =>
      console.log(`讀取本地${fileName}.json檔案失敗\n${err}`)
    )
  );
}

const importData = async () => {
  const exhibitionData = readJsonFile(
    'exhibition-app-1ab50-default-rtdb-export'
  );
  try {
    await Exhibition.create(exhibitionData);
    // await User.create(users, { validateBeforeSave: false });
    console.log('[成功]MongoDB 已載入本地JSON檔案資料');
  } catch (err) {
    console.log(`[失敗]MongoDB 未載入本地JSON檔案資料\n${err}`);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Exhibition.deleteMany({});
    // await User.deleteMany({});
    console.log('[成功]MongoDB 已刪除本地JSON檔案資料');
  } catch (err) {
    console.log(`[失敗]MongoDB 未刪除本地JSON檔案資料\n${err}`);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

if (process.env?.NODE_ENV === 'development') console.log(process.argv);
