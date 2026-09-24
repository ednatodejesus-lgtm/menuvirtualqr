import jsPDF from "jspdf";
import { getPublicMenuUrl } from "./qrBrand";
import { MENUQR_HORIZONTAL_LOGO } from "./Brand";

/**
 * Converte um SVG (data URI) para PNG (data URI).
 * Necessário porque o jsPDF tem suporte limitado para SVG.
 */
function svgToPngDataUrl(svgDataUrl, width, height) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      // Multiplicamos por 2 para garantir alta resolução no PDF
      canvas.width = width * 2;
      canvas.height = height * 2;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/png"));
    };
    img.src = svgDataUrl;
  });
}

export async function generateRestaurantPDF(data) {
  const doc = new jsPDF();
  // ✅ Nome do restaurante com fallback em cascata
  const restaurantName = 
    data?.restaurant?.name || 
    data?.restaurant?.restaurant_name || 
    data?.restaurantName || 
    "Dados da Empresa";
  const admin = data.admin;
  const qr = data.qr;
  const publicLink = data?.restaurant?.slug ? getPublicMenuUrl(data.restaurant.slug) : qr?.link || "";
  const now = new Date();
  const date = now.toLocaleDateString("pt-AO");
  const time = now.toLocaleTimeString("pt-AO");

  // --- CABEÇALHO ---

  // 1. Converte o logo SVG para PNG e adiciona no canto superior direito
  const logoPng = await svgToPngDataUrl(MENUQR_HORIZONTAL_LOGO, 300, 60);
  // X=120, Y=10, Largura=70, Altura=14 (mantém a proporção 300x60)
  doc.addImage(logoPng, "PNG", 120, 10, 70, 14);

  // 2. Texto do cabeçalho
  doc.setFontSize(22);
  doc.text("Menu Virtual QR", 20, 25);
  doc.setFontSize(12);
  doc.text("Comprovativo de criação da empresa", 20, 35);

  // Linha divisória
  doc.line(20, 40, 190, 40);

  // --- RESTO DO DOCUMENTO ---

  doc.setFontSize(15);
  doc.text("Empresa:", 20, 55);
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