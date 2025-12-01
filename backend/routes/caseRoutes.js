const router = require("express").Router();
const caseController = require("../controllers/caseController");
const { auth, roleCheck } = require("../middleware/auth");

/**
 * @swagger
 * tags:
 *   name: Cases
 *   description: Support cases/tickets management
 */

/**
 * @swagger
 * /api/cases:
 *   post:
 *     summary: Create new case (Customer only)
 *     tags: [Cases]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [issue, department, location]
 *             properties:
 *               issue:
 *                 type: string
 *                 example: "Unable to fund wallet"
 *               department:
 *                 type: string
 *                 enum: ['Funding Wallet', 'Buying Airtime', 'Buying Internet Data', 'E-commerce Section', 'Fraud Related Problems', 'General Services']
 *               location:
 *                 type: string
 *                 example: "Lagos, Nigeria"
 *     responses:
 *       201:
 *         description: Case created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 case:
 *                   $ref: '#/components/schemas/Case'
 */

/**
 * @swagger
 * /api/cases:
 *   get:
 *     summary: Get my cases (Admin)
 *     tags: [Cases]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: ['pending', 'active', 'in-progress', 'resolved', 'rejected']
 *     responses:
 *       200:
 *         description: All cases
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
 * /api/cases/my:
 *   get:
 *     summary: Get my cases (Customer/Agent)
 *     tags: [Cases]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: ['pending', 'active', 'in-progress', 'resolved', 'rejected']
 *     responses:
 *       200:
 *         description: My cases
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
 * /api/cases/{caseId}/accept:
 *   patch:
 *     summary: Accept case (Agent only)
 *     tags: [Cases]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: caseId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Case accepted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 case:
 *                   $ref: '#/components/schemas/Case'
 */

/**
 * @swagger
 * /api/cases/{caseId}/status:
 *   patch:
 *     summary: Update case status (Agent only)
 *     tags: [Cases]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: caseId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: ['pending', 'active', 'in-progress', 'resolved', 'rejected']
 *     responses:
 *       200:
 *         description: Status updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 case:
 *                   $ref: '#/components/schemas/Case'
 */

/**
 * @swagger
 * /api/cases/assign:
 *   patch:
 *     summary: Assign case to agent (Admin only)
 *     tags: [Cases]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [caseId, agentId]
 *             properties:
 *               caseId:
 *                 type: string
 *               agentId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Case assigned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 case:
 *                   $ref: '#/components/schemas/Case'
 */

router.post("/", auth, roleCheck("customer"), caseController.createCase);
router.get("/", auth, roleCheck("admin"), caseController.getAllCases);
router.get("/my", auth, caseController.getMyCases);
router.patch(
  "/:caseId/accept",
  auth,
  roleCheck("agent"),
  caseController.acceptCase
);
router.patch(
  "/:caseId/status",
  auth,
  roleCheck("agent"),
  caseController.updateStatus
);
router.patch("/assign", auth, roleCheck("admin"), caseController.assignCase);

module.exports = router;
