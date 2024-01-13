const express = require("express");
const productController = require("./../controllers/productController");
// const authController = require("./../controllers/authController");
import {protect} from "../controllers/authController";
import {getImage,getOneProduct,searchProducts,createOneProduct,getAllProducts,uploadProductImages,resizeProductImages,updateAProduct,deleteAProduct,createCheckout} from "../controllers/productController"

const router = express.Router();

router.use("/image/:imageName", getImage);
router.use("/search", searchProducts);
router.use("/create-checkout-session", createCheckout);
// router.use(
//   "/webhook",
//   express.raw({ type: "application/json" }),
//   stripeWebHook
// );
router
  .route("/")
  .get(getAllProducts)
  .post(
    protect,
    uploadProductImages,
    resizeProductImages,
    createOneProduct
  );
router
  .route("/:id")
  .get(getOneProduct)
  .patch(
    protect,
    uploadProductImages,
    resizeProductImages,
    updateAProduct
  )
  .delete(protect, deleteAProduct);

export default router;