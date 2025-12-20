import express from "express";
import {
  createInquiry,
  listInquiries,
  updateInquiry,
  getStats,
  todayFollowUps,
  pendingFollowUps,
} from "../controllers/inquiryController.js";

const router = express.Router();

/* CREATE */
router.post("/create", createInquiry);

/* LIST (ALL STAGES + FILTERS) */
router.get("/list", listInquiries);

/* UPDATE STATUS / FOLLOWUP */
router.put("/update/:id", updateInquiry);

/* DASHBOARD */
router.get("/stats", getStats);

/* REMINDERS */
router.get("/followup/today", todayFollowUps);
router.get("/followup/pending", pendingFollowUps);

export default router;
