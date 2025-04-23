import { Router } from "express";
import { body,param } from "express-validator";
import { AuthController } from "../controllers/AuthController";
import { handleInputsErrors } from "../middleware/validation";
import { limiter } from "../config/limiter";
import { authenticate, validateExistToken, validateExistUser, validateToken } from "../middleware/auth";

const router = Router()

/**
 * @swagger
 * /api/auth/create-account:
 *   post:
 *     summary: Create a new user account
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Israel
 *               email:
 *                 type: string
 *                 example: israel@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: User account created successfully
 *       400:
 *         description: Validation failed. Missing or invalid input fields
 *       409:
 *         description: A user with this email already exists
 *       500:
 *         description: Internal server error
 */

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

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login with email and password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: israel@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful. Returns user info and token.
 *       400:
 *         description: Validation failed. Email or password is missing/invalid.
 *       403:
 *         description: Invalid credentials or user not confirmed.
 *       404:
 *         description: User is not registered.
 *       429:
 *         description: Too many login attempts. Try again later.
 *       500:
 *         description: Internal server error.
 */

router.post(
  "/login",
  limiter,
  body("email").isEmail().withMessage("Email is not valid"),
  body("password").notEmpty().withMessage("The password is required"),
  handleInputsErrors,
  validateExistUser,
  AuthController.login
);


/**
 * @swagger
 * /api/auth/confirm-account:
 *   post:
 *     summary: Confirm account
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: User successfully confirmedy.
 *       400:
 *         description: Validation failed. token missing/invalid.
 *       404:
 *         description: The token does not exist
 *       429:
 *         description: Too many login attempts. Try again later.
 *       500:
 *         description: Internal server error.
 */
router.post(
  "/confirm-account",
  limiter,
  validateToken,
  handleInputsErrors,validateExistToken,
  AuthController.confirmAccount);



/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Get token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: test@test.com
 *     responses:
 *       200:
 *         description: Check your email and follow instructions.
 *       400:
 *         description: Validation failed. email missing/invalid.
 *       404:
 *         description: User is not registered.
 *       429:
 *         description: Too many login attempts. Try again later.
 *       500:
 *         description: Internal server error.
 */
router.post(
  "/forgot-password",
  body("email").isEmail().withMessage("Email is not valid"),
  handleInputsErrors,
  validateExistUser,
  AuthController.forgotPassword
);

/**
 * @swagger
 * /api/auth/check-token:
 *   post:
 *     summary: Verify token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: correct token.
 *       400:
 *         description: Validation failed. token missing/invalid.
 *       404:
 *         description: The token does not exist.
 *       429:
 *         description: Too many login attempts. Try again later.
 *       500:
 *         description: Internal server error.
 */
router.post(
  "/check-token",
  limiter,
  validateToken,
  handleInputsErrors,
  validateExistToken,
  AuthController.checkToken
);

/**
 * @swagger
 * /api/auth/reset-password/{token}:
 *   post:
 *     summary: Reset password with token
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Token sent to the user's email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 example: myNewSecurePassword123
 *     responses:
 *       200:
 *         description: Password successfully updated.
 *       400:
 *         description: Validation error (token or password missing/invalid).
 *       404:
 *         description: Token not found or expired.
 *       500:
 *         description: Internal server error.
 */

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


/**
 * @swagger
 * /api/auth/user:
 *   get:
 *     summary: Get user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: John Doe
 *                 email:
 *                   type: string
 *                   example: johndoe@example.com
 *       401:
 *         description: Unauthorized - Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */
router.get('/user',authenticate,AuthController.getUSer)


/**
 * @swagger
 * /api/auth/update-password:
 *   post:
 *     summary: Update password
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - current_password
 *               - new_password
 *             properties:
 *               current_password:
 *                 type: string
 *                 example: myOldPassword123
 *               new_password:
 *                 type: string
 *                 example: myNewPassword456
 *     responses:
 *       200:
 *         description: Password successfully updated.
 *       400:
 *         description: Validation failed .
 *       401:
 *         description: Unauthorized. Token missing,  invalid or or current password is incorrect.
 *       500:
 *         description: Internal server error.
 */
router.post('/update-password',authenticate
  ,body("current_password")
  .notEmpty()
  .withMessage("The password is required"),
  body("new_password")
  .notEmpty()
  .withMessage("The password is required")
  .isLength({ min: 6 })
  .withMessage("The new password is very short, most has minium 8 characters"),handleInputsErrors,AuthController.updatePassword)


  /**
 * @swagger
 * /api/auth/check-password:
 *   post:
 *     summary: check password
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - current_password
 *             properties:
 *               current_password:
 *                 type: string
 *                 example: myOldPassword123
 *     responses:
 *       200:
 *         description: The password is correct.
 *       400:
 *         description: Validation failed.
 *       401:
 *         description: Current password is incorrect.
 *       500:
 *         description: Internal server error.
 */
  router.post('/check-password',authenticate
    ,body("current_password")
    .notEmpty()
    .withMessage("The password is required"),handleInputsErrors,AuthController.checkPassword)
export default router