const router = require("express").Router();
const userController = require("../controllers/userController");
const { auth, roleCheck } = require("../middleware/auth");

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Profile management & agent creation (Admin/Supervisor only)
 */

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get current user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 user:
 *                   $ref: '#/components/schemas/User'
 */

/**
 * @swagger
 * /api/users/profile:
 *   patch:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullname:
 *                 type: string
 *               phone:
 *                 type: string
 *               location:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated
 */

/**
 * @swagger
 * /api/users/agents:
 *   post:
 *     summary: Create new agent (Admin/Supervisor only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [fullname, email, department]
 *             properties:
 *               fullname:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: agent@example.com
 *               department:
 *                 type: string
 *                 enum: ['Funding Wallet', 'Buying Airtime', 'Buying Internet Data', 'E-commerce Section', 'Fraud Related Problems', 'General Services']
 *     responses:
 *       201:
 *         description: Agent created & email sent
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 agent:
 *                   $ref: '#/components/schemas/User'
 */


/**
 * @swagger
 * /api/users/agents:
 *   get:
 *     summary: Get all agents (Admin/Supervisor only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of agents
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 agents:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 */


router.get("/profile", auth, userController.getProfile);
router.patch("/profile/:id?", auth, userController.updateProfile);;
router.post(
  "/agents",
  auth,
  roleCheck("admin", "supervisor"),
  userController.createAgent
);
router.get(
  "/agents",
  auth,
  roleCheck("admin", "supervisor"),
  userController.getAgents
);

router.get(
  "/agents/live",
  auth,
  roleCheck("admin", "supervisor", "agent"), 
  userController.getAgentsWithLocation
);

router.get(
  "/customers/live",
  auth,
  roleCheck("admin", "supervisor", "agent"),
  userController.getCustomersWithLocation
);

router.post("/users/live-location", authMiddleware, userController.updateLiveLocation);

module.exports = router;
