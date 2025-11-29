const router = require("express").Router();
const { auth } = require("../middleware/auth");

/**
 * @swagger
 * tags:
 *   name: Messages
 *   description: HTTP fallback for messages (real-time via Socket.IO)
 */

/**
 * @swagger
 * /api/messages/case/{caseId}:
 *   get:
 *     summary: Get messages for case (fallback)
 *     tags: [Messages]
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
 *         description: Messages
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 messages:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Message'
 */

router.get("/case/:caseId", auth, async (req, res) => {
  const messages = await require("../models/Message")
    .find({ case: req.params.caseId })
    .sort({ timestamp: 1 });
  res.json({ success: true, messages });
});

module.exports = router;
