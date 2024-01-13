
import Product from "./../models/productModel";
import {getAll,getOne,createOne,deleteOne,updateOne} from "./handlerFactory"

import multer from "multer";
import sharp from "sharp";
import AppError from "./../utils/appError";
import catchAsync from "./../utils/catchAsync";
import path from "path";
import Stripe from "stripe";
import { createOneOrderCheckOut } from "./orderController";
import { Request,Response,NextFunction } from "express";

const stripe = new Stripe(process.env.STRIPE_SECRET,{
    apiVersion:"2023-10-16"
})


declare module 'express' {
    interface Request {
      files?:any
      user?:any
    }
  }
declare module 'express' {
    interface Send {
      SendFileOptions:any
    }
  }


const multerStorage = multer.memoryStorage();

const multerFilter = (req:any, file:any, cb:any) => {
  console.log(req.body);
  console.log(file);
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an Image,Please upload only an Image", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

export const uploadProductImages = upload.fields([{ name: "images", maxCount: 5 }]);

export const resizeProductImages = catchAsync(async (req:Request, res:Response, next:NextFunction) => {
  // console.log(req.files);
  if (!req.files?.images) return next();
  // console.log(path.join(__dirname, "../public/img/products"));

  req.body.images = [];

  await Promise.all(
    req.files.images.map(async (file:any, i:number) => {
      const filename = `product-${req.user._id}-${Date.now()}-${i + 1}.jpeg`;

      await sharp(file.buffer)
        .resize(2400, 1600)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`src/public/img/products/${filename}`);
        // .toFile(path.join(__dirname, "../public/img/products"));

      req.body.images.push(filename);
    })
  );

  console.log(req.body);
  next();
});

export const getImage = catchAsync(async (req:Request, res:Response) => {
  let fileName = req.params.imageName;
  // console.log(path.join(__dirname, "../public/img/phones"));

  const options: {
    root: string;
    dotfiles: 'deny' | 'allow' | 'ignore'; // Correct type for dotfiles property
    headers: {
      'x-timestamp': number;
      'x-sent': boolean;
    };
  } =  {
    root: path.join(__dirname, "../public/img/products"),
    dotfiles: "deny",
    headers: {
      "x-timestamp": Date.now(),
      "x-sent": true,
    },
  };

  res.sendFile(fileName, options, function (err) {
    if (err) {
      // next(err)
      // console.log(err);
      res.status(500).json({
        err,
      });
    } else {
      console.log("Sent:", fileName);
    }
  });
});

export const searchProducts = catchAsync(async (req:Request, res:Response) => {
  const { search } = req.query;
  console.log(search);

  if (search) {
    await Product.find(
      {
        $or: [
          { brandName: { $regex: search, $options: "i" } },
          { model: { $regex: search, $options: "i" } },
          { ram: { $regex: search, $options: "i" } },
          { processor: { $regex: search, $options: "i" } },
        ],
      }
      // (err, phones) => {
      //   if (err) {
      //     console.log(err);
      //     // res.status(500).json({
      //     //   status: "failed",
      //     //   message: "There was an error...",
      //     // });
      //   }

      //   res.status(200).json(phones);
      // }
    )
      // .select(
      //   "-images -description -discount -price -createdAt -user -productNumber -category -subCategory -brandname"
      // )
      .then((data:any) => {
        // console.log(data);
        res.status(200).json({
          status: "success",
          message: `${data.length} found...`,
          data,
        });
      })
      .catch((err:any) => {
        console.log(err);
        res.status(400).json({
        //   message: "failed",
          message: err,
        });
      });
  }
});

export const createCheckout = async (req:Request, res:Response) => {
  console.log(req.body);
  const { products, userId, subTotal } = req.body;

  const lineItems = products.map((item:any) => ({
    price_data: {
      currency: "lkr",
      product_data: {
        name: item.itemtitle,
        images: [item.itemimages],
      },
      unit_amount: item.itemprice * 100, // Stripe uses amount in cents
    },
    quantity: item.count,
  }));

  console.log(lineItems);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: `${process.env.FRONTEND_DOMAIN_DEVELOPMENT}/products/success`,
    cancel_url: `${process.env.FRONTEND_DOMAIN_DEVELOPMENT}/products/failed`,
  });

  createOneOrderCheckOut({ products, userId: userId, subTotal: subTotal });
  return res.json({ id: session.id });
};

// export const stripeWebHook = async (req:Request, res:Response) => {
//   const sig = req.headers["stripe-signature"];

//   let event;

//   try {
//     event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
//   } catch (err) {
//     response.status(400).send(`Webhook Error: ${err.message}`);
//     return;
//   }

//   // Handle the event
//   switch (event.type) {
//     case "payment_intent.succeeded":
//       const paymentIntentSucceeded = event.data.object;
//       // Then define and call a function to handle the event payment_intent.succeeded
//       break;
//     // ... handle other event types
//     default:
//       console.log(`Unhandled event type ${event.type}`);
//   }

//   // Return a 200 response to acknowledge receipt of the event
//   res.send();
// };
export const createOneProduct = createOne(Product);
export const getOneProduct = getOne(Product, "", "Product");
// export const getOneProduct = factory.getOne(Product, {
//   path: "user_virtual",
//   select: "-__v",
// });
export const getAllProducts = getAll(Product);
export const updateAProduct = updateOne(Product);
export const deleteAProduct = deleteOne(Product);