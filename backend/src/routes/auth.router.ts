import { Router } from "express";
import { body,param } from "express-validator";
import { AuthController } from "../controllers/AuthController";
import { handleInputsErrors } from "../middleware/validation";
import { limiter } from "../config/limiter";

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
  body("token")
    .notEmpty()
    .isLength({ min: 6 })
    .withMessage("Token is required"),
  handleInputsErrors,
  AuthController.confirmAccount
);
export default router