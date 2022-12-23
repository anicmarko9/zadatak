import { Router } from "express";
import * as userController from "./../controllers/user.controller";
import * as authController from "./../controllers/auth.controller";
const router: Router = Router();

router.post("/signup", authController.signupUser);
router.post("/login", authController.loginUser);
router.get("/logout", authController.logoutUser);

router.post("/forgotPassword", authController.forgotPasswordLink);
router.patch("/resetPassword/:token", authController.resetPasswordLink);

router.use(authController.protectUser);

router.patch("/updateMyPassword", authController.updateMyPassword);
router.get("/me", userController.getMe, userController.getUser);
router.patch(
  "/updateMe",
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);
router.delete("/deleteMe", userController.deleteMe);

router.use(authController.restrictToUser);

router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

export default router;
