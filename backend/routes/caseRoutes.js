const express = require("express");
const router = express.Router();
const caseController = require("../controllers/caseController");
const authMiddleware = require("../middleware/authMiddleware");

// Create a new case
router.post("/cases", authMiddleware, caseController.createCase);

// Get latest case for customer
router.get(
  "/cases/latest/:customerId",
  authMiddleware,
  caseController.getLatestCase
);

// Get all cases with filters
router.get("/cases", authMiddleware, caseController.getCases);

// Accept a case (agent action)
router.put("/cases/accept/:caseId", authMiddleware, caseController.acceptCase);

// Reject a case (agent action)
router.put("/cases/reject/:caseId", authMiddleware, caseController.rejectCase);

// Get cases by status
// router.get(
//   "/cases/status/:status",
//   authMiddleware,
//   caseController.getCasesByStatus
// );

// Assign case to agent
router.put("/cases/assign", authMiddleware, caseController.assignCase);

// Update case status
router.put(
  "/cases/status/:caseId",
  authMiddleware,
  caseController.updateCaseStatus
);

// Get cases by agent ID
router.get(
  "/cases/agent/:agentId",
  authMiddleware,
  caseController.getCasesByAgentId
);

module.exports = router;
