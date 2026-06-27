import twilio from "twilio";

let twilioClient;

function getTwilioClient() {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;

  if (!sid || !token) {
    return null;
  }
  if (!twilioClient) {
    twilioClient = twilio(sid, token);
  }
  return twilioClient;
}

/**
 * Sends SMS notification to customer.
 */
export async function sendSmsNotification(phone, message) {
  const client = getTwilioClient();
  const fromNum = process.env.TWILIO_PHONE_NUMBER;

  if (!client || !fromNum) {
    console.log(`[SMS Service Simulator] Sent SMS to ${phone}: "${message}"`);
    return { simulated: true };
  }

  try {
    const res = await client.messages.create({
      body: message,
      from: fromNum,
      to: phone,
    });
    console.log(`[SMS Service] Sent message ${res.sid} to ${phone}`);
    return { success: true, sid: res.sid };
  } catch (error) {
    console.error(`[SMS Service] Error sending SMS to ${phone}:`, error);
    return { success: false, error };
  }
}

/**
 * Sends WhatsApp notification to customer.
 */
export async function sendWhatsAppNotification(phone, message) {
  const client = getTwilioClient();
  const fromNum = process.env.TWILIO_WHATSAPP_NUMBER; // Must be 'whatsapp:+1234...'

  if (!client || !fromNum) {
    console.log(`[WhatsApp Service Simulator] Sent WhatsApp message to ${phone}: "${message}"`);
    return { simulated: true };
  }

  try {
    // Format to ensure 'whatsapp:' prefix is present
    const formattedTo = phone.startsWith("whatsapp:") ? phone : `whatsapp:${phone}`;
    const formattedFrom = fromNum.startsWith("whatsapp:") ? fromNum : `whatsapp:${fromNum}`;

    const res = await client.messages.create({
      body: message,
      from: formattedFrom,
      to: formattedTo,
    });
    console.log(`[WhatsApp Service] Sent WhatsApp message ${res.sid} to ${phone}`);
    return { success: true, sid: res.sid };
  } catch (error) {
    console.error(`[WhatsApp Service] Error sending WhatsApp to ${phone}:`, error);
    return { success: false, error };
  }
}
