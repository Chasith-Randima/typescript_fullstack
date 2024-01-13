import express from "express";
const router = express.Router();
import {signup,login,logout,protect,updatePassword} from "../controllers/authController";
import {searchUsers,getAllUsers,uploadUserImages,resizeUserImages,createUser,getOneUser,getImage,updateUser,deleteUser} from "../controllers/userController"

router.post("/signup",signup);
router.post("/login",login);
router.get("/logout",logout);

router.use("/search", searchUsers);

router.use(protect);

router.patch("/updateMyPassword/:id", updatePassword);

router
  .route("/")
  .get(getAllUsers)
  .post(
    uploadUserImages,
    resizeUserImages,
    createUser
  );

router
  .route("/:id")
  .get(getOneUser)
  // .get(restrictTo("admin"), getOneUser)
  .patch(
    uploadUserImages,
    resizeUserImages,
    updateUser
  )
  .delete(deleteUser);

export default router;