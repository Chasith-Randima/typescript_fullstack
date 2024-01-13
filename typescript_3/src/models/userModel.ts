import { NextFunction } from "express";

const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

export interface UserType{
    _id: string;
    username:string,
    email:string,
    country:string,
    streetAddress:string,
    city:string,
    region:string,
    postalCode:string,
    description:string,
    password:string,
    passwordConfirm:string,
    role:string,
    images:string[],
    passwordChangedAt:Date,
    createdAt:Date,
    updatedAt:Date,
  
  }
  

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "please tell us your name"],
    },
    email: {
      type: String,
      required: [true, "Please tell us your email"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please enter a valid email address.."],
    },

    country: {
      type: String,
    },
    streetAddress: {
      type: String,
    },
    city: {
      type: String,
    },
    region: {
      type: String,
    },
    postalCode: {
      type: String,
    },
    description: {
      type: String,
    },
    password: {
      type: String,
      required: [true, "Please provide a valid password.."],
      minlength: 8,
    },
    passwordConfirm: {
      type: String,
      required: [true, "Please confirm your password.."],
      validate: {
        validator: function (el:any) {
          return el === this.password;
        },
        message: "Passwords are not the same",
      },
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    images: [String],
    passwordChangedAt: Date,
  },
  { timestamps: true }
);
userSchema.pre("save", async function (next:NextFunction) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
  next();
});

userSchema.pre("save", function (next:NextFunction) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 2000;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword:string,
  userPassword:string
):Promise<boolean> {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp:string) {
  if (this.passwordChangedAt) {
    const changedTimeStamp:number = Math.floor(
      this.passwordChangedAt.getTime() / 1000.1
    );
    // const changedTimeStamp:number = parseInt(
    //   this.passwordChangedAt.getTime() / 1000.1
    // );
    return Number(JWTTimestamp) < changedTimeStamp;
  }
};

const User = mongoose.model("User", userSchema);
export default User;