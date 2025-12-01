const router = require("express").Router();
const authController = require("../controllers/authController");
const { auth } = require("../middleware/auth");

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication and password management
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */

/**
 * @swagger
 * /api/auth/register/request-otp:
 *   post:
 *     summary: Request OTP for registration
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: OTP sent
 */

/**
 * @swagger
 * /api/auth/register/verify-otp:
 *   post:
 *     summary: Verify OTP for registration
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, otp]
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: OTP verified
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Complete customer registration (after OTP verification)
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [fullname, email, password]
 *             properties:
 *               fullname:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               phone:
 *                 type: string
 *               location:
 *                 type: string
 *               gender:
 *                 type: string
 *     responses:
 *       201:
 *         description: Registration successful
 */

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Request password reset OTP
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Reset OTP sent
 */

/**
 * @swagger
 * /api/auth/forgot-password/verify-otp:
 *   post:
 *     summary: Verify password reset OTP
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, otp]
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP verified
 */

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset password (after OTP verification)
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, newPassword]
 *             properties:
 *               email:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successful
 */

/**
 * @swagger
 * /api/auth/change-password/request-otp:
 *   post:
 *     summary: Request OTP for password change (authenticated)
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OTP sent
 */

/**
 * @swagger
 * /api/auth/change-password:
 *   post:
 *     summary: Change password with OTP (authenticated)
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [currentPassword, newPassword, otp]
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed successfully
 */

// Authentication routes
router.post("/login", authController.login);
router.post("/admin/create", authController.registerAdmin);

// Registration with OTP
router.post("/register/request-otp", authController.requestRegistrationOTP);
router.post("/register/verify-otp", authController.verifyRegistrationOTP);
router.post("/register", authController.registerCustomer);

// Forgot password flow
router.post("/forgot-password", authController.forgotPassword);
router.post("/forgot-password/verify-otp", authController.verifyResetOTP);
router.post("/reset-password", authController.resetPassword);

// Change password (requires authentication)
router.post("/change-password/request-otp", auth, authController.requestChangePasswordOTP);
router.post("/change-password", auth, authController.changePassword);

module.exports = router;