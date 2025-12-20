import Inquiry from "../models/inquiryModel.js";

/* ================= CREATE (WEBSITE + MANUAL) ================= */
export const createInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.create({
      ...req.body,
      status: "new",
      seen: false,
    });

    res.json({ success: true, inquiry });
  } catch (error) {
    console.error("Create Inquiry Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= LIST WITH FILTERS ================= */
export const listInquiries = async (req, res) => {
  try {
    const {
      status,
      name,
      contact,
      shopName,
      followUp,
      sort = "latest",
    } = req.query;

    const query = {};

    if (status) query.status = status;
    if (name) query.name = new RegExp(name, "i");
    if (contact) query.contact = new RegExp(contact, "i");
    if (shopName) query.shopName = new RegExp(shopName, "i");

    if (followUp === "today") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      query.followUpDate = { $gte: today, $lt: tomorrow };
    }

    let sortQuery = { createdAt: -1 };
    if (sort === "oldest") sortQuery = { createdAt: 1 };
    if (sort === "next") sortQuery = { followUpDate: 1 };

    const inquiries = await Inquiry.find(query).sort(sortQuery);

    res.json({ success: true, inquiries });
  } catch (error) {
    console.error("List Inquiry Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= UPDATE STATUS / FOLLOWUP ================= */
export const updateInquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, followUpDate, note } = req.body;

    const inquiry = await Inquiry.findById(id);
    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: "Inquiry not found",
      });
    }

    if (status) inquiry.status = status;
    if (followUpDate !== undefined)
      inquiry.followUpDate = followUpDate || null;
    if (note) inquiry.note = note;

    inquiry.seen = true;

    inquiry.history.push({
      status: inquiry.status,
      note,
    });

    await inquiry.save();

    res.json({ success: true, inquiry });
  } catch (error) {
    console.error("Update Inquiry Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= DASHBOARD STATS ================= */
export const getStats = async (req, res) => {
  try {
    const data = await Inquiry.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const stats = {
      total: 0,
      new: 0,
      prospect: 0,
      followup: 0,
      hot: 0,
      won: 0,
      lost: 0,
    };

    data.forEach((item) => {
      stats[item._id] = item.count;
      stats.total += item.count;
    });

    res.json({ success: true, stats });
  } catch (error) {
    console.error("Stats Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= TODAY FOLLOW-UPS ================= */
export const todayFollowUps = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const inquiries = await Inquiry.find({
      followUpDate: { $gte: today, $lt: tomorrow },
      status: { $in: ["followup", "hot"] },
    }).sort({ followUpDate: 1 });

    res.json({ success: true, inquiries });
  } catch (error) {
    console.error("Today Followup Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= PENDING FOLLOW-UPS ================= */
export const pendingFollowUps = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const inquiries = await Inquiry.find({
      followUpDate: { $lt: today },
      status: { $in: ["followup", "hot"] },
    }).sort({ followUpDate: 1 });

    res.json({ success: true, inquiries });
  } catch (error) {
    console.error("Pending Followup Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
