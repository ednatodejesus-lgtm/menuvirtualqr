import jsPDF from "jspdf";
import { MENUQR_HORIZONTAL_LOGO } from "../Brand";

function svgToPngDataUrl(svgDataUrl, width, height) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width * 2;
      canvas.height = height * 2;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/png"));
    };
    img.src = svgDataUrl;
  });
}

export async function generatePremiumPDF(data) {
  return new Promise(async (resolve) => {
    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    doc.setFillColor(40, 20, 10);
    doc.rect(0, 0, pageWidth, 50, "F");
    doc.setFillColor(60, 30, 10);
    doc.rect(0, 50, pageWidth, pageHeight - 50, "F");

    // --- LOGO HORIZONTAL ---
    const logoPng = await svgToPngDataUrl(MENUQR_HORIZONTAL_LOGO, 150, 40);
    const logoWidth = 55;
    const logoHeight = 14;
    doc.addImage(logoPng, "PNG", (pageWidth - logoWidth) / 2, 8, logoWidth, logoHeight);
    // ------------------------

    doc.setFontSize(24);
    doc.setTextColor(255, 215, 0);
    doc.setFont("helvetica", "bold");
    doc.text("MENU QR", pageWidth / 2, 32, { align: "center" });

    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "normal");
    doc.text(data.restaurantName || "Restaurante", pageWidth / 2, 42, { align: "center" });

    doc.setDrawColor(255, 215, 0);
    doc.setLineWidth(0.5);
    doc.line(40, 48, pageWidth - 40, 48);

    const canvas = document.getElementById("restaurant-qr");
    if (canvas) {
      const imgWidth = 90;
      const x = (pageWidth - imgWidth) / 2;
      const y = 65;

      doc.setFillColor(0, 0, 0);
      doc.roundedRect(x + 2, y + 2, imgWidth, imgWidth, 3, 3, "F");
      doc.addImage(canvas.toDataURL("image/png"), "PNG", x, y, imgWidth, imgWidth);
    }

    doc.setFontSize(16);
    doc.setTextColor(255, 215, 0);
    doc.setFont("helvetica", "bold");
    doc.text("Cardapio Digital", pageWidth / 2, 170, { align: "center" });

    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "normal");
    doc.text("Escanear e fazer o pedido", pageWidth / 2, 182, { align: "center" });

    doc.setDrawColor(255, 215, 0);
    doc.setLineWidth(0.3);
    doc.roundedRect(20, 175, pageWidth - 40, 20, 3, 3);

    doc.setFontSize(9);
    doc.setTextColor(200, 200, 200);
    doc.setFont("helvetica", "italic");
    doc.text(data.link || "", pageWidth / 2, 210, { align: "center" });

    doc.setFillColor(20, 10, 5);
    doc.rect(0, pageHeight - 12, pageWidth, 12, "F");
    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.setFont("helvetica", "normal");
    doc.text("© 2026 Menu Virtual QR ", pageWidth / 2, pageHeight - 15, { align: "center" });

    resolve(doc.output("blob"));
  });
}