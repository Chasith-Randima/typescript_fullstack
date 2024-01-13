import express from "express";
const router = express.Router();
import {signup,login,logout,protect,updatePassword} from "../controllers/authController";
import {searchOrders,getAllOrders,createOneOrder,getOneOrder,updateAOrder,deleteAOrder} from "./../controllers/orderController";



router.use("/search",searchOrders);

router
  .route("/")
  .get(getAllOrders)
  .post(protect,createOneOrder);
router
  .route("/:id")
  .get(getOneOrder)
  .patch(protect,updateAOrder)
  .delete(protect,deleteAOrder);

export default router;