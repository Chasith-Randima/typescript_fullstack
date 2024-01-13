import Order from "./../models/orderModel";
import {createOne,getOne,getAll,updateOne,deleteOne} from "./handlerFactory";
import catchAsync from "../utils/catchAsync";
import { Request,Response } from "express";

export const createOneOrder = createOne(Order);
export const getOneOrder = getOne(Order);
// export const getOneOrder = getOne(Order, {
//   path: "user_virtual",
//   select: "-__v",
// });
export const getAllOrders = getAll(Order);
export const updateAOrder = updateOne(Order);
export const deleteAOrder = deleteOne(Order);

export const createOneOrderCheckOut = async (data:any) => {
  const doc = await Order.create(data);
};

export const searchOrders = catchAsync(async (req:Request, res:Response) => {
  const { search } = req.query;
  console.log(search);

  if (search) {
    await Order.find(
      {
        $in: [{ _id: { $regex: search } }],
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
        
          message: err,
        });
      });
  }
});