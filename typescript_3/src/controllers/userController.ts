import User from "./../models/userModel"
import {getAll,getOne,createOne,deleteOne,updateOne} from "./handlerFactory"

import multer, { FileFilterCallback } from "multer"
import sharp from "sharp"
import AppError from "../utils/appError"
import catchAsync from "./../utils/catchAsync"
import path from "path"
import { NextFunction,Request,Response,Send } from "express"
import { any } from "zod"

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


  type optionsType = {
    root:string,
    dotfiles:string,
    headers:object
  }

const multerStorage = multer.memoryStorage();

const multerFilter = (req:any, file:any, cb:any) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an Image Please upload only an image..", 400), false);
  }
};


const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

export const uploadUserImages = upload.fields([{ name: "images", maxCount: 5 }]);

export const resizeUserImages = catchAsync(async (req:Request, res:Response, next:NextFunction) => {
//   console.log(!req.files.images);
  if (!req?.files?.images) return next();

  req.body.images = [];

  await Promise.all(
    req.files?.images.map(async (file:any, i:number) => {
      const filename = `user-${req.user._id}-${Date.now()}-${i + 1}.jpeg`;

      await sharp(file.buffer)
        .resize(2400, 1600)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`src/public/img/users/${filename}`);

      req.body?.images.push(filename);
    })
  );

  next();
});

export const getImage = catchAsync(async (req:Request, res:Response) => {
  let fileName = req.params.imageName;

//   let options = {
//     root: path.join(__dirname, "../public/img/users"),
//     dotfiles: "deny",
//     headers: {
//       "x-timestamp": Date.now(),
//       "x-sent": true,
//     },
//   };
  const options: {
    root: string;
    dotfiles: 'deny' | 'allow' | 'ignore'; // Correct type for dotfiles property
    headers: {
      'x-timestamp': number;
      'x-sent': boolean;
    };
  } =  {
    root: path.join(__dirname, "../public/img/users"),
    dotfiles: "deny",
    headers: {
      "x-timestamp": Date.now(),
      "x-sent": true,
    },
  };

  res.sendFile(fileName, options, function (err) {
    if (err) {
      res.status(500).json({
        err,
      });
    } else {
      console.log("Sent:", fileName);
    }
  });
});

export const searchUsers = catchAsync(async (req:Request, res:Response, next:NextFunction) => {
  const { search } = req.query;
  //   console.log(req.query);
  if (search.length != 0) {
    await User.find({
      $or: [{ username: { $regex: search, $options: "i" } }],
    })
      .then((data:any) => {
        res.status(200).json({
          status: "success",
          message: `${data.length} found...`,
          data,
        });
      })
      .catch((err:any) => {
        console.log(err);
        res.status(500).json({
          satus: "failed",
          message: err,
        });
      });
  }
});

export const getAllUsers = getAll(User);
export const getOneUser = getOne(User);
export const updateUser = updateOne(User);
export const deleteUser = deleteOne(User);
export const createUser = createOne(User);
// exports.getAllUsers = factory.getAll(User);
// exports.getOneUser = factory.getOne(User);
// exports.updateUser = factory.updateOne(User);
// exports.deleteUser = factory.deleteOne(User);
// exports.createUser = factory.createOne(User);