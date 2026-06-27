import { MessageSquare } from "lucide-react";

export function WhatsAppSupportButton() {
  return (
    <a
      href="https://wa.me/919840256318?text=Hello%20Sri%20Venkateshwara%20Oil%20Mill%20Support"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:shadow-xl"
      aria-label="Chat with support on WhatsApp"
    >
      <MessageSquare className="h-5 w-5" />
      WhatsApp
    </a>
  );
}
