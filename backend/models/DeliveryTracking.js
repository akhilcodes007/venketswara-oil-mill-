import mongoose from "mongoose";

const historyItemSchema = new mongoose.Schema({
  status: { type: String, required: true },
  location: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const deliveryTrackingSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      unique: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["confirmed", "packed", "shipped", "out_for_delivery", "delivered"],
      default: "confirmed",
    },
    estimatedDeliveryDate: {
      type: Date,
    },
    deliveryPartner: {
      type: String,
      default: "SVOM Logistics",
    },
    currentLocation: {
      type: String,
      default: "Mill Warehouse",
    },
    coordinates: {
      type: [Number], // [longitude, latitude] for Google Maps
      default: [77.5946, 12.9716], // Default Bengaluru coord
    },
    history: [historyItemSchema],
  },
  { timestamps: true }
);

const DeliveryTracking = mongoose.model("DeliveryTracking", deliveryTrackingSchema);
export default DeliveryTracking;
