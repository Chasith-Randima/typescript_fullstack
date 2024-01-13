import Review from "./../models/reviewModel";
import {createOne,getOne,getAll,updateOne,deleteOne} from "./handlerFactory";

export const createOneReview = createOne(Review);
export const getOneReview = getOne(Review);
// export const getOneReview = getOne(Review, {
//   path: "user_virtual",
//   select: "-__v",
// });
export const getAllReviews = getAll(Review);
export const updateAReview = updateOne(Review);
export const deleteAReview = deleteOne(Review);