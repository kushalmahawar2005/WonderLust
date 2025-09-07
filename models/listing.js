const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    image: {
        type: String,
        default : "https://images.unsplash.com/photo-1753301638968-39f496e7a4da?q=80&w=415&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        // agar koi value empty string hogi to default image use karo
        set: v => v === "" 
            ? "https://images.unsplash.com/photo-1753301638968-39f496e7a4da?q=80&w=415&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
            : v
    },
    price: {
        type: Number,
    },
    location: {
        type: String,
    },
    country: {
        type: String,
    }
});

const Listing = mongoose.model("Listing", listSchema);
module.exports = Listing;
