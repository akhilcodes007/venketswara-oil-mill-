import dotenv from 'dotenv';
dotenv.config();

let twilioClient = null;

/**
 * getTwilioClient — Lazily initialises the Twilio client.
 * Returns null if credentials are not configured (triggering simulator mode).
 *
 * Note: Dynamic import is used so the `twilio` package is only loaded
 * if credentials are actually present, avoiding startup errors.
 */
async function getTwilioClient() {
  if (twilioClient) return twilioClient;

  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;

  if (!sid || !token) return null;

  try {
    const { default: twilio } = await import('twilio');
    twilioClient = twilio(sid, token);
    return twilioClient;
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ */
/* sendSmsNotification                                                  */
/* ------------------------------------------------------------------ */

/**
 * Sends an SMS to an Indian mobile number via Twilio.
 * If Twilio is not configured, logs to console and returns simulated success.
 *
 * @param {string} phone   - 10-digit Indian phone number (no country code)
 * @param {string} message - SMS body text
 */
export async function sendSmsNotification(phone, message) {
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;

  if (!fromNumber) {
    console.log(`[SMS Dev] To +91${phone}: ${message}`);
    return { success: true, simulated: true };
  }

  try {
    const client = await getTwilioClient();
    if (!client) throw new Error('Twilio client could not be initialised');

    await client.messages.create({
      body: message,
      from: fromNumber,
      to: `+91${phone}`,
    });

    return { success: true };
  } catch (err) {
    console.error('[SMS] Error:', err.message);
    return { success: false, error: err.message };
  }
}

/* ------------------------------------------------------------------ */
/* sendWhatsAppNotification                                             */
/* ------------------------------------------------------------------ */

/**
 * Sends a WhatsApp message to an Indian mobile number via Twilio.
 * If Twilio is not configured, logs to console and returns simulated success.
 *
 * @param {string} phone   - 10-digit Indian phone number (no country code)
 * @param {string} message - WhatsApp message body
 */
export async function sendWhatsAppNotification(phone, message) {
  const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER;

  if (!fromNumber) {
    console.log(`[WhatsApp Dev] To +91${phone}: ${message}`);
    return { success: true, simulated: true };
  }

  try {
    const client = await getTwilioClient();
    if (!client) throw new Error('Twilio client could not be initialised');

    await client.messages.create({
      body: message,
      from: `whatsapp:${fromNumber}`,
      to: `whatsapp:+91${phone}`,
    });

    return { success: true };
  } catch (err) {
    console.error('[WhatsApp] Error:', err.message);
    return { success: false, error: err.message };
  }
}
