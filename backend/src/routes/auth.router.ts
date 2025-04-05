import { Router } from "express";
import { body,param } from "express-validator";
import { AuthController } from "../controllers/AuthController";
import { handleInputsErrors } from "../middleware/validation";
import { limiter } from "../config/limiter";
import { validateExistToken, validateExistUser, validateToken } from "../middleware/auth";

const router = Router()

router.post(
  "/create-account",
  body("name").notEmpty().withMessage("The name is required"),
  body("password")
    .notEmpty()
    .withMessage("The password is required")
    .isLength({ min: 6 })
    .withMessage("The password is very short, most has minium 8 characters"),
  body("email")
    .notEmpty()
    .withMessage("The email is required")
    .isEmail()
    .withMessage("E-mail is not valid"),

  handleInputsErrors,
  AuthController.createAccount
);

router.post(
  "/confirm-account",
  limiter,
  validateToken,
  handleInputsErrors,validateExistToken,
  AuthController.confirmAccount);

router.post(
  "/login",
  limiter,
  body("email").isEmail().withMessage("Email is not valid"),
  body("password").notEmpty().withMessage("The password is required"),
  handleInputsErrors,
  validateExistUser,
  AuthController.login
);

router.post(
  "/forgot-password",
  body("email").isEmail().withMessage("Email is not valid"),
  handleInputsErrors,
  validateExistUser,
  AuthController.forgotPassword
);

router.post(
  "/check-token",
  limiter,
  validateToken,
  handleInputsErrors,
  validateExistToken,
  
  AuthController.checkToken
);

router.post('/reset-password/:token',param("token")
.notEmpty()
.isLength({ min: 6 })
.withMessage("Token is required"),
body("password")
.notEmpty()
.withMessage("The password is required")
.isLength({ min: 6 })
.withMessage("The password is very short, most has minium 8 characters"),
handleInputsErrors,AuthController.resetPasswordWithPassword)
export default router