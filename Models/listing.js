const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

//here  1xn relation is estblished between linting and review i.e storing child reference in parent model

const listingSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  image: {
    url: String,
    filename: String,
  },
  price: { type: Number },
  location: { type: String },
  country: { type: String },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  category: {
    type: String,
    enum: ["mountains", "arctic", "farms", "desserts"],
  },
});

listingSchema.post("findOneAndDelete", async function (listing) {
  console.log(listing);
  if (listing) {
    await Review.deleteMany({
      _id: { $in: listing.reviews },
    });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;

//  image: {
//     type: String,
//     default:
//       "https://images.unsplash.com/photo-1786469777605-ed9b0437825d?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDExfGJvOGpRS1RhRTBZfHxlbnwwfHx8fHw%3Ddefault-link",
//     set: (v) =>
//       v === ""
//         ? "https://images.unsplash.com/photo-1786469777605-ed9b0437825d?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDExfGJvOGpRS1RhRTBZfHxlbnwwfHx8fHw%3Ddefault-link"
//         : v,
//   }
