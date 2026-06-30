import Razorpay from 'razorpay';
import dotenv from 'dotenv';
dotenv.config();

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

/**
 * isSimulator — true when Razorpay keys are not configured.
 * In simulator mode, order creation returns a fake order object
 * so the rest of the order flow can still be tested end-to-end.
 */
export const isSimulator = !keyId || !keySecret;

const razorpay = isSimulator
  ? {
      orders: {
        create: async (opts) => ({
          id: `sim_${Date.now()}`,
          amount: opts.amount,
          currency: opts.currency,
          receipt: opts.receipt,
        }),
      },
    }
  : new Razorpay({ key_id: keyId, key_secret: keySecret });

if (isSimulator) {
  console.warn(
    '[Razorpay] Running in SIMULATOR mode. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET for live payments.'
  );
}

export default razorpay;
