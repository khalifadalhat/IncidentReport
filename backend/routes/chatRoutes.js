const router = require("express").Router();
const chatController = require("../controllers/chatController");
const { auth } = require("../middleware/auth");

/**
 * @swagger
 * tags:
 *   name: Chat
 *   description: Chat history & unread counts
 */

/**
 * @swagger
 * /api/chat/history:
 *   get:
 *     summary: Get chat history (Customer/Agent)
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Chat history
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 history:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       case:
 *                         $ref: '#/components/schemas/Case'
 *                       lastMessage:
 *                         $ref: '#/components/schemas/Message'
 */

/**
 * @swagger
 * /api/chat/case/{caseId}:
 *   get:
 *     summary: Get case chat (Customer/Agent)
 *     tags: [Chat]
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
 *         description: Case chat
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 case:
 *                   $ref: '#/components/schemas/Case'
 *                 messages:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Message'
 */

router.get("/history", auth, chatController.getChatHistory);
router.get("/case/:caseId", auth, chatController.getCaseChat);

module.exports = router;
