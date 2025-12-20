import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    contact: { type: String, required: true },
    shopName: { type: String, default: "" },

    message: { type: String },
    productName: { type: String },
    productPrice: { type: Number },
    productLink: { type: String },

    userId: { type: String },

    seen: { type: Boolean, default: false },

    status: {
      type: String,
      enum: ["new", "prospect", "followup", "hot", "won", "lost"],
      default: "new",
      index: true,
    },

    followUpDate: { type: Date, default: null },
    note: { type: String, default: "" },

    history: [
      {
        status: String,
        note: String,
        date: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const Inquiry =
  mongoose.models.Inquiry || mongoose.model("Inquiry", inquirySchema);

export default Inquiry;
