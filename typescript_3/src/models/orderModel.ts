const mongoose = require("mongoose");
const slugify = require("slugify");

// Product schema


export interface OrderType {
  userId: string;
  subTotal: string;
  status: {
    type: string;
    enum: ["processing", "dispatched", "received"];
    default: "processing";
  };
  products: {
    itemId: string;
    itemprice: number;
    itemtitle: string;
    itemimages: string;
    count: number;
  }[];
}


const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
    },
    subTotal: {
      type: String,
    },
    status: {
      type: String,
      enum: ["processing", "dispatched", "received"],
      default: "processing",
    },
    products: [
      {
        itemId: { type: String },
        itemprice: { type: Number },
        itemtitle: { type: String },
        itemimages: { type: String },
        count: { type: Number },
      },
    ],
  },
  { timestamps: true }
  // { typeKey: "$type" }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;