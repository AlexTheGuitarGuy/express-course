import * as fs from "fs";
import dotenv from "dotenv";
import colors from "colors";

import Bootcamp from "./models/Bootcamp.js";
import Course from "./models/Course.js";
import connectDb from "./config/db.js";
import User from "./models/User.js";

dotenv.config({
  path: "./config/config.env",
});

await connectDb();

const importData = async () => {
  try {
    const bootcamps = JSON.parse(
      fs.readFileSync("./_data/bootcamps.json", "utf-8")
    );

    const courses = JSON.parse(
      fs.readFileSync("./_data/courses.json", "utf-8")
    );

    const users = JSON.parse(fs.readFileSync("./_data/users.json", "utf-8"));

    await Bootcamp.create(bootcamps);
    await Course.create(courses);
    await User.create(users);

    console.log("Data imported!".green.inverse);
  } catch (error) {
    console.error(error);
  }
};

const destroyData = async () => {
  try {
    await Bootcamp.deleteMany();
    await Course.deleteMany();
    await User.deleteMany();

    console.log("Data destroyed!".red.inverse);
  } catch (error) {
    console.error(error);
  }
};

switch (process.argv[2]) {
  case "-i": {
    await importData();
    break;
  }
  case "-d": {
    await destroyData();
    break;
  }
  case "-r": {
    await destroyData();
    await importData();
    break;
  }
  default: {
    console.log("No valid flag was chosen!".red);
  }
}

process.exit();
