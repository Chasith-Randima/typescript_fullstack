import { NextFunction } from "express";

export default (fn:any):any => {
    return (req:Request, res:Response, next:NextFunction) => {
      fn(req, res, next).catch(next);
    };
  };