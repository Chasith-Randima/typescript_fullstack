const mongoose = require("mongoose");
const slugify = require("slugify");
import {NextFunction} from "express"

// Product schema

export interface ReviewType {
    comment:string,
    ratings:string,
    user:object[],
    product:object[]

}

const reviewSchema = new mongoose.Schema(
  {
    comment: { type: String },
    ratings: {
      type: String,
    },
    user: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    product: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
      },
    ],
  },
  { timestamps: true }
  // { typeKey: "$type" }
);

reviewSchema.pre(/^find/, function (next:NextFunction) {
  this.populate({
    path: "user",
    select: "-__v -passwordChangedAt -password ",
  });
  next();
});

const Review = mongoose.model("Review", reviewSchema);

export default Review;