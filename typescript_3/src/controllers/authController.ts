import User from "../models/userModel";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";
import { promisify } from "util";
import jwt,{JwtPayload} from "jsonwebtoken";
import { NextFunction,Request,Response } from "express";
import { UserType } from "models/userModel";
import { object } from "zod";


declare module 'express' {
    interface Request {
      user?: any
    }
  }
declare module 'jsonwebtoken' {
    interface JwtPayload{
        id:any
    }
  }

const signToken = (id:string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user:UserType, statusCode:number, req:Request, res:Response) => {
  const token = signToken(user._id);

  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() + Number(process.env.JWT_COOKIE_EXPIRES_IN)  * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
  });

  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    message: "successfull...",
    token,
    data: {
      user,
    },
  });
};

export const signup = catchAsync(async (req:Request, res:Response, next:NextFunction) => {
  console.log(req.body,"---------------")
  
    const user = await User.create({
    username: req.body?.username,
    email: req.body?.email,
    password: req.body?.password,
    passwordConfirm: req.body?.passwordConfirm,
  });

  if (!user) {
    return next(
      new AppError("There was a error signing up... please try again..", 500)
    );
  }

  createSendToken(user, 201, req, res);
});

export const login = catchAsync(async (req:Request, res:Response, next:NextFunction) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please enter a valid password or email...", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password...", 401));
  }

  createSendToken(user, 200, req, res);
});

export const logout = (req:Request, res:Response) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    status: "success",
    message: "successfull..",
  });
};

export const protect = catchAsync(async (req:Request, res:Response, next:NextFunction) => {
    
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError(
        "You are not logged in..Please log in to access this route..",
        401
      )
    );
  }

//   const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const decoded:JwtPayload | string = await jwt.verify(token, process.env.JWT_SECRET);
  

  let currentUser;
  if (typeof decoded!== 'string') {
    currentUser = await User.findById(decoded?.id);
  }

//   let currentUser = await User.findById(decoded?.id);

  if (!currentUser) {
    return next(
      new AppError(
        "The user belong to this token does no longer exisits...",
        401
      )
    );
  }

  if (typeof decoded!== 'string' && currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("Password was recently changed... login again...", 401)
    );
  }

  req.user = currentUser;

  next();
});

export const restrictTo = (...roles:string[]) => {
  return (req:Request, res:Response, next:NextFunction) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    next();
  };
};

// update password function
export const updatePassword = catchAsync(async (req:Request, res:Response, next:NextFunction) => {
  const user = await User.findById(req.user.id).select("+password");

  if (!user) {
    return next(
      new AppError("There is no user with this id...please login again", 401)
    );
  }

  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError("Your current password is wrong", 401));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  createSendToken(user, 200, req, res);
});