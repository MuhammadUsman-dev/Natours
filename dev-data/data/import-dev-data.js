const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../../modals/tourModel');
const User = require('../../modals/userModel');
const Review = require('../../modals/reviewModel');

dotenv.config({ path: '../../config.env' });

mongoose.connect(process.env.DATABASE).then(() => {
  console.log('db connected successfully');
});

// read data from local file
const tours = JSON.parse(fs.readFileSync('./tours.json'));
const users = JSON.parse(fs.readFileSync('./users.json'));
const reviews = JSON.parse(fs.readFileSync('./reviews.json'));

// importing data
const importData = async () => {
  try {
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
  } catch (err) {
    console.log(err);
  }
};

// deleting existing data from db

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === '--import') {
  importData();
  console.log('data imported');
} else if (process.argv[2] === '--delete') {
  deleteData();
  console.log('data deleted');
}
