import jsPDF from "jspdf";
import { MENUQR_HORIZONTAL_LOGO } from "../Brand";

// Função auxiliar para converter o SVG do Brand.js em PNG para o jsPDF
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

export async function generateSimplePDF(data) {
  return new Promise(async (resolve) => { // Adicionado async no Promise
    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, pageWidth, pageHeight, "F");

    // --- LOGO HORIZONTAL ---
    const logoPng = await svgToPngDataUrl(MENUQR_HORIZONTAL_LOGO, 300, 80); // Aumentei a resolução base
    const logoWidth = 85; // Aumentado de 60 para 85
    const logoHeight = 22.6; // Proporcional (85 / 3.75)
    doc.addImage(logoPng, "PNG", (pageWidth - logoWidth) / 2, 15, logoWidth, logoHeight);
    // ------------------------

    doc.setFontSize(22);
    doc.setTextColor(60, 30, 10);
    doc.setFont("helvetica", "bold");
    doc.text(data.restaurantName || "Restaurante", pageWidth / 2, 45, { align: "center" });

    doc.setDrawColor(139, 69, 19);
    doc.setLineWidth(0.5);
    doc.line(50, 55, pageWidth - 50, 55);

    doc.setFontSize(16);
    doc.setTextColor(100, 80, 60);
    doc.setFont("helvetica", "normal");
    doc.text("QR Code do Menu", pageWidth / 2, 75, { align: "center" });

    const canvas = document.getElementById("restaurant-qr");
    if (canvas) {
      const imgWidth = 80;
      const x = (pageWidth - imgWidth) / 2;
      doc.addImage(canvas.toDataURL("image/png"), "PNG", x, 95, imgWidth, imgWidth);
    }

    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.setFont("helvetica", "italic");
    doc.text("Escanear para ver o menu", pageWidth / 2, 195, { align: "center" });
    doc.text(data.link || "", pageWidth / 2, 205, { align: "center" });

    doc.setFontSize(8);
    doc.setTextColor(200, 200, 200);
    doc.setFont("helvetica", "normal");
    doc.text("© 2026 Menu Virtual QR ", pageWidth / 2, pageHeight - 15, { align: "center" });

    resolve(doc.output("blob"));
  });
}
