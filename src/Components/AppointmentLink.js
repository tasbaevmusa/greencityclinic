import React from "react";

export const appointmentWhatsAppUrl = "https://wa.me/77075340824";

export default function AppointmentLink({ children, ...props }) {
  return <a {...props} href={appointmentWhatsAppUrl} target="_blank" rel="noopener noreferrer">{children}</a>;
}
