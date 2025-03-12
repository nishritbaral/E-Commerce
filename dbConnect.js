import mongoose from "mongoose";

const dbName = "mini-amazon";
const dbUserName = "nishrit";
const dbPassword = encodeURIComponent("Nishrit5");
const dbHosts = "school.t7rsx.mongodb.net";
const dbOptions = "retryWrites=true&w=majority&appName=School";

const connectDB = async () => {
  try {
    const url = `mongodb+srv://${dbUserName}:${dbPassword}@${dbHosts}/${dbName}?${dbOptions}`;

    await mongoose.connect(url);

    console.log("DB connection Successful");
  } catch (error) {
    console.log("DB connection Failed");
    console.log(error.message);
    process.exit(1);
  }
};

export default connectDB;
