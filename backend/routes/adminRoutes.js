const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { auth, roleCheck } = require("../middleware/auth");

router.use(auth, roleCheck("admin"));


/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin-only endpoints
 */

/**
 * @swagger
 * /api/admin/dashboard:
 *   get:
 *     summary: Get admin dashboard stats
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard stats
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 stats:
 *                   type: object
 *                   properties:
 *                     users:
 *                       type: object
 *                       properties:
 *                         customers:
 *                           type: number
 *                         agents:
 *                           type: number
 *                         admins:
 *                           type: number
 *                     cases:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: number
 *                         pendingCases:
 *                           type: number
 *                         activeCases:
 *                           type: number
 *                         resolvedCases:
 *                           type: number
 *                         rejectedCases:
 *                           type: number
 *                     today:
 *                       type: object
 *                       properties:
 *                         newCases:
 *                           type: number
 *                         newMessages:
 *                           type: number
 */

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: ['customer', 'agent', 'admin', 'supervisor']
 *     responses:
 *       200:
 *         description: Users list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 */

/**
 * @swagger
 * /api/admin/cases:
 *   get:
 *     summary: Get all cases (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: ['pending', 'active', 'resolved', 'rejected']
 *       - in: query
 *         name: department
 *         schema:
 *           type: string
 *           enum: ['Funding Wallet', 'Buying Airtime', 'Buying Internet Data', 'E-commerce Section', 'Fraud Related Problems', 'General Services']
 *     responses:
 *       200:
 *         description: Cases list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 cases:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Case'
 */

/**
 * @swagger
 * /api/admin/users/{userId}:
 *   delete:
 *     summary: Delete user (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   example: User deleted
 */


router.get("/dashboard", adminController.getDashboardStats);
router.get("/users", adminController.getAllUsers);
router.get("/cases", adminController.getAllCases);
router.get("/performance", adminController.getAgentPerformance);
router.delete("/users/:userId", adminController.deleteUser);

module.exports = router;
