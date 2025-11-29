const router = require("express").Router();
const { auth } = require("../middleware/auth");
const notificationController = require("../controllers/notificationController");

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: User-specific notifications and status updates
 */

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Get a list of the user's notifications
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         default: 20
 *         description: Maximum number of notifications to return
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *         default: 0
 *         description: Number of notifications to skip (for pagination)
 *       - in: query
 *         name: unreadOnly
 *         schema:
 *           type: boolean
 *         default: false
 *         description: Filter to return only unread notifications
 *     responses:
 *       200:
 *         description: A paginated list of notifications and the total unread count
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 notifications:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Notification'
 *                 unreadCount:
 *                   type: integer
 *                 total:
 *                   type: integer
 */

/**
 * @swagger
 * /api/notifications/unread-count:
 *   get:
 *     summary: Get the total count of unread notifications for the user
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Unread count retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 */

/**
 * @swagger
 * /api/notifications/{id}/read:
 *   patch:
 *     summary: Mark a specific notification as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the notification to mark as read
 *     responses:
 *       200:
 *         description: Notification marked as read and returned
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notification'
 *       404:
 *         description: Notification not found
 */

/**
 * @swagger
 * /api/notifications/mark-all-read:
 *   patch:
 *     summary: Mark all unread notifications for the current user as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All notifications successfully marked as read
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: All notifications marked as read
 */

/**
 * @swagger
 * /api/notifications/{id}:
 *   delete:
 *     summary: Delete a specific notification by ID
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the notification to delete
 *     responses:
 *       200:
 *         description: Notification deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Notification deleted
 *       404:
 *         description: Notification not found
 */

/**
 * @swagger
 * /api/notifications/clear-read:
 *   delete:
 *     summary: Delete all notifications that have been read by the current user
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Read notifications cleared successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Read notifications cleared
 */

router.get("/", auth, notificationController.getNotifications);
router.get("/unread-count", auth, notificationController.getUnreadCount);
router.patch("/:id/read", auth, notificationController.markAsRead);
router.patch("/mark-all-read", auth, notificationController.markAllAsRead);
router.delete("/:id", auth, notificationController.deleteNotification);
router.delete("/clear-read", auth, notificationController.clearReadNotifications);

module.exports = router;