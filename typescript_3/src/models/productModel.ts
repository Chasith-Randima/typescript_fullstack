const mongoose = require("mongoose");
const slugify = require("slugify");

// Product schema

export interface ProductType {
    _id: string;
    availableColours?: {
      type: string;
    };
    model?: {
      type: string;
    };
    processor?: {
      type: string;
    };
    ram?: {
      type: string;
    };
    storage?: {
      type: string;
    };
    display?: {
      type: string;
    };
    graphics?: {
      type: string;
    };
    weight?: {
      type: string;
    };
    battery?: {
      type: string;
    };
    keyboardBacklight?: {
      type: string;
    };
    yearsOfWarranty?: {
      type: string;
    };
    windows?: {
      type: string;
    };
    brandName?: {
      type: string;
      // required?: [true, "Product must have a brand name..."];
    };
    title?: {
      type: string;
      // required?: [true, "Product must have a title ..."];
    };
    slug?: {
      type: string;
    };
    category?: {
      type: string;
    };
    subCategory?: {
      type: string;
    };
    productNumber?: {
      type: string;
    };
    price?: {
      type: number;
    };
    discount?: {
      type: number;
    };
    quantity?: {
      type: number;
    };
    // createdAt?: {
    //   type: Date;
    //   default?: Date.now;
    // };
    images?: string[];
    description?: string;
    user?: object;
  }

const productSchema = new mongoose.Schema(
  {
    availableColours: {
      type: String,
    },
    model: {
      type: String,
    },
    processor: {
      type: String,
    },
    ram: {
      type: String,
    },
    storage: {
      type: String,
    },
    display: {
      type: String,
    },
    graphics: {
      type: String,
    },
    weight: {
      type: String,
    },
    battery: {
      type: String,
    },
    keyboardBacklight: {
      type: String,
    },
    yearsOfWarranty: {
      type: String,
    },
    windows: {
      type: String,
    },
    brandName: {
      type: String,
      // required: [true, "Product must have a brand name..."],
    },
    title: {
      type: String,
      // required: [true, "Product must have a title ..."],
    },
    slug: {
      type: String,
    },
    category: {
      type: String,
    },
    subCategory: {
      type: String,
    },
    productNumber: {
      type: String,
    },
    price: {
      type: Number,
    },
    discount: {
      type: Number,
    },
    quantity: {
      type: Number,
    },
    // createdAt: {
    //   type: Date,
    //   default: Date.now(),
    // },
    images: [String],
    description: String,
    user: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
  // { typeKey: "$type" }
);

const Product = mongoose.model("Product", productSchema);

export default Product;