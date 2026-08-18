import jsPDF from "jspdf";

export async function generatePremiumPDF(data) {
  return new Promise((resolve) => {
    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    //  BACKGROUND GRADIENTE (SIMULADO)
    doc.setFillColor(40, 20, 10);
    doc.rect(0, 0, pageWidth, 50, "F");

    doc.setFillColor(60, 30, 10);
    doc.rect(0, 50, pageWidth, pageHeight - 50, "F");

    //  CABECALHO PREMIUM
    doc.setFontSize(24);
    doc.setTextColor(255, 215, 0);
    doc.setFont("helvetica", "bold");
    doc.text("MENU QR", pageWidth / 2, 25, { align: "center" });

    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "normal");
    doc.text(data.restaurantName || "Restaurante", pageWidth / 2, 38, { align: "center" });

    //  LINHA DOURADA
    doc.setDrawColor(255, 215, 0);
    doc.setLineWidth(0.5);
    doc.line(40, 48, pageWidth - 40, 48);

    //  QR CODE COM Sombra (simulada)
    const canvas = document.getElementById("restaurant-qr");
    if (canvas) {
      const imgData = canvas.toDataURL("image/png");
      const imgWidth = 90;
      const imgHeight = 90;
      const x = (pageWidth - imgWidth) / 2;
      const y = 65;

      // Sombra
      doc.setFillColor(0, 0, 0, 0.1);
      doc.roundedRect(x + 2, y + 2, imgWidth, imgHeight, 3, 3, "F");

      doc.addImage(imgData, "PNG", x, y, imgWidth, imgHeight);
    }

    //  TITULO "CARDAPIO DIGITAL"
    doc.setFontSize(16);
    doc.setTextColor(255, 215, 0);
    doc.setFont("helvetica", "bold");
    doc.text("Cardapio Digital", pageWidth / 2, 170, { align: "center" });

    //  DESCRICAO PREMIUM
    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "normal");
    doc.text("Escanear e fazer o pedido", pageWidth / 2, 182, { align: "center" });

    //  BORDA DECORATIVA DOURADA
    doc.setDrawColor(255, 215, 0);
    doc.setLineWidth(0.3);
    doc.roundedRect(20, 175, pageWidth - 40, 20, 3, 3);

    //  LINK
    doc.setFontSize(9);
    doc.setTextColor(200, 200, 200);
    doc.setFont("helvetica", "italic");
    doc.text(data.link || "", pageWidth / 2, 210, { align: "center" });

    //  RODAPE PREMIUM
    doc.setFillColor(20, 10, 5);
    doc.rect(0, pageHeight - 12, pageWidth, 12, "F");

    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.setFont("helvetica", "normal");
    doc.text("Menu Virtual QR - Todos os direitos reservados", pageWidth / 2, pageHeight - 4, { align: "center" });

    resolve(doc.output("blob"));
  });
}