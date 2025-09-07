const mongoose = require("mongoose");
const initData = require("./data.js");

const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb+srv://kushalmahawar2005:zDroTxu06shqudj1@cluster0.y8qqwaw.mongodb.net/wonderlust?retryWrites=true&w=majority&appName=Cluster0";
async function main() {
    await mongoose.connect(MONGO_URL);
}

main().then(() => {
    console.log("Connected Successfully")
})
    .catch((err) => {
        console.log(err);
    });

    const intiDB = async() => {
        await Listing.deleteMany({});
        await Listing.insertMany(initData.data);
        console.log("Data was initilalize")
    }

    intiDB();