import jsPDF from "jspdf";
import { getPublicMenuUrl } from "./qrBrand";

export function generateRestaurantPDF(data) {
  const doc = new jsPDF();
  const restaurant = data.restaurant;
  const admin = data.admin;
  const qr = data.qr;
  const publicLink = restaurant?.slug ? getPublicMenuUrl(restaurant.slug) : qr?.link || "";
  const now = new Date();
  const date = now.toLocaleDateString("pt-AO");
  const time = now.toLocaleTimeString("pt-AO");

  doc.setFontSize(22);
  doc.text("Menu Virtual QR", 20, 25);
  doc.setFontSize(12);
  doc.text("Comprovativo de criação de restaurante", 20, 35);
  doc.line(20, 40, 190, 40);

  doc.setFontSize(15);
  doc.text("Restaurante", 20, 55);
  doc.setFontSize(12);
  doc.text(restaurant.name, 20, 65);

  doc.setFontSize(15);
  doc.text("Dados do Gerente", 20, 85);
  doc.setFontSize(12);
  doc.text(`Email: ${admin.email}`, 20, 95);
  doc.text(`Password temporária: ${admin.password}`, 20, 105);

  doc.setFontSize(15);
  doc.text("URL Pública", 20, 125);
  doc.setFontSize(11);
  doc.text(publicLink, 20, 135);

  // Usa o QR atualmente visível, que já contém o MQ.
  const qrCanvas =
    document.getElementById("restaurant-success-qr") ||
    document.getElementById("restaurant-qr") ||
    document.getElementById("qr-code-canvas");

  if (qrCanvas) {
    doc.addImage(qrCanvas.toDataURL("image/png"), "PNG", 70, 145, 70, 70);
  }

  doc.setFontSize(11);
  doc.text(`Criado em: ${date} ${time}`, 20, 240);
  doc.line(20, 245, 190, 245);
  doc.setFontSize(10);
  doc.text("Documento gerado pelo Menu Virtual QR", 20, 255);
  doc.text("Feito com café, amor e ChatGPT", 20, 265);
  doc.save(`${restaurant.slug}-credenciais.pdf`);
}