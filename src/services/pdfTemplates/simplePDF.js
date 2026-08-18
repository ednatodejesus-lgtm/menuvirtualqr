import jsPDF from "jspdf";

export async function generateSimplePDF(data) {
  return new Promise((resolve) => {
    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    //  BACKGROUND BRANCO
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, pageWidth, pageHeight, "F");

    //  NOME DO RESTAURANTE
    doc.setFontSize(22);
    doc.setTextColor(60, 30, 10);
    doc.setFont("helvetica", "bold");
    doc.text(data.restaurantName || "Restaurante", pageWidth / 2, 40, { align: "center" });

    //  LINHA DECORATIVA
    doc.setDrawColor(139, 69, 19);
    doc.setLineWidth(0.5);
    doc.line(50, 50, pageWidth - 50, 50);

    //  TITULO "QR CODE"
    doc.setFontSize(16);
    doc.setTextColor(100, 80, 60);
    doc.setFont("helvetica", "normal");
    doc.text("QR Code do Menu", pageWidth / 2, 70, { align: "center" });

    //  IMAGEM DO QR CODE (usando canvas)
    const canvas = document.getElementById("restaurant-qr");
    if (canvas) {
      const imgData = canvas.toDataURL("image/png");
      const imgWidth = 80;
      const imgHeight = 80;
      const x = (pageWidth - imgWidth) / 2;
      const y = 90;
      doc.addImage(imgData, "PNG", x, y, imgWidth, imgHeight);
    }

    //  INFORMACOES ADICIONAIS
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.setFont("helvetica", "italic");
    doc.text("Escanear para ver o menu", pageWidth / 2, 190, { align: "center" });
    doc.text(data.link || "", pageWidth / 2, 200, { align: "center" });

    //  RODAPE
    doc.setFontSize(8);
    doc.setTextColor(200, 200, 200);
    doc.setFont("helvetica", "normal");
    doc.text("Menu Virtual QR - Todos os direitos reservados", pageWidth / 2, pageHeight - 15, { align: "center" });

    resolve(doc.output("blob"));
  });
}