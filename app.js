const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
// TODO: Move credentials to environment variable (process.env.MONGO_URL)
const MONGO_URL = "mongodb+srv://kushalmahawar2005:zDroTxu06shqudj1@cluster0.y8qqwaw.mongodb.net/wonderlust?retryWrites=true&w=majority&appName=Cluster0";
const path = require('path');
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require('./utils/wrapAsync.js');
const ExpressError = require('./utils/ExpressError.js');
const { listingSchema } = require("./schema.js")
async function main() {
    await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
const staticPath = path.join(__dirname, "public");
app.use(express.static(staticPath));
console.log("Serving static files from:", staticPath);

// Helpful global error logging
mongoose.connection.on('error', (err) => {
    console.error("Mongoose connection error:", err.message);
});
process.on('unhandledRejection', (reason) => {
    console.error("Unhandled Promise Rejection:", reason);
});


main().then(() => {
    console.log("Connected Successfully");
})
    .catch((err) => {
        console.log(err);
    });

app.listen(8080, () => {
    console.log(`Server started at port no 8080`);
});

app.get('/', (req, res) => {
    res.send("Hey , This is my First Major Project");
    console.log("connected with local Host");
})

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);

    if (error) {
        let errMsg = err.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

//Index Route
app.get("/listings", wrapAsync(async (req, res) => {
    let allListing = await Listing.find({})
    res.render("listings/index.ejs", { allListing });
}));
//New Route 
app.get('/listings/new', (req, res) => {
    res.render("listings/new.ejs")
})
//Show Route 
app.get("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
}));


// Create Route 
app.post("/listings", validateListing, wrapAsync(async (req, res, next) => {
    let result = listingSchema.validate(req.body);
    console.log(result);
    if (result.error) {
        throw new ExpressError(400, result.error);
    }
    const newListing = new Listing(req.body.listing); // form se data aa raha hai

    await newListing.save();
    res.redirect("/listings");
    // console.log(newListing, "Added in list"); // save hone ke baad index page pe redirect
}));

app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
}));


// Update Route 
app.put('/listings/:id',validateListing,  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect("/listings");
}));

app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));


// app.get("/test", async (req, res) => {
//     let sampleListing = new Listing({
//         title : "My New Villa",
//         description : "By the Beach",
//         price : 1200,
//         location : "Calangate, Goa",
//         country : "India"
//     });

//     await sampleListing.save()
//     .then(()=> console.log("Inserted Successfully")).
//     catch((err)=>(console.log(err)));

//     res.send("Successfull testing")
// });

// 404 handler (placed after all valid routes)
app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went Wrong" } = err;
    res.status(statusCode).render("error.ejs", { err });
})