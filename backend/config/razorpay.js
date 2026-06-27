import Razorpay from "razorpay";

let razorpay;

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

if (keyId && keySecret) {
  razorpay = new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
  console.log("[Razorpay] SDK initialized successfully");
} else {
  console.log("[Razorpay Warning] Missing API keys. Initialized Razorpay in Simulator Mode.");
  
  // Return simulated orders module
  razorpay = {
    orders: {
      create: async (options) => {
        return {
          id: `order_mock_${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          entity: "order",
          amount: options.amount,
          amount_paid: 0,
          amount_due: options.amount,
          currency: options.currency || "INR",
          receipt: options.receipt,
          status: "created",
          attempts: 0,
          notes: options.notes,
          created_at: Math.floor(Date.now() / 1000),
        };
      },
    },
  };
}

export default razorpay;
export const isSimulator = !keyId || !keySecret;
