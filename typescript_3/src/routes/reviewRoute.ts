import express from "express";
import {getAllReviews,createOneReview,getOneReview,updateAReview,deleteAReview} from "./../controllers/reviewController";
import {protect} from "./../controllers/authController";
const router = express.Router();

router
  .route("/")
  .get(getAllReviews)
  .post(protect,createOneReview);
router
  .route("/:id")
  .get(getOneReview)
  .patch(protect,updateAReview)
  .delete(protect,deleteAReview);

export default router;