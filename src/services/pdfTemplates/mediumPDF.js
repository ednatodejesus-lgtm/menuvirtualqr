import jsPDF from "jspdf";

export async function generateMediumPDF(data) {
  return new Promise((resolve) => {
    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    //  BACKGROUND (BRANCO)
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, pageWidth, pageHeight, "F");

    //  CABECALHO COM LOGO E NOME
    doc.setFillColor(60, 30, 10);
    doc.rect(0, 0, pageWidth, 25, "F");

    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text(data.restaurantName || "Restaurante", 20, 17);

    //  TITULO "CARDAPIO DIGITAL"
    doc.setFontSize(14);
    doc.setTextColor(255, 215, 0);
    doc.setFont("helvetica", "normal");
    doc.text("Menu Digital - QR Code", pageWidth / 2, 40, { align: "center" });

    //  LINHA DECORATIVA
    doc.setDrawColor(139, 69, 19);
    doc.setLineWidth(0.5);
    doc.line(30, 50, pageWidth - 30, 50);

    //  QR CODE
    const canvas = document.getElementById("restaurant-qr");
    if (canvas) {
      const imgData = canvas.toDataURL("image/png");
      const imgWidth = 70;
      const imgHeight = 70;
      const x = (pageWidth - imgWidth) / 2;
      const y = 60;
      doc.addImage(imgData, "PNG", x, y, imgWidth, imgHeight);
    }

    //  INSTRUCOES
    const instructions = [
      "Como usar o QR Code:",
      "1. Conecte-se a rede Wi-Fi do estabelecimento.",
      "2. Utilize a camera do seu celular para ler o codigo.",
      "3. Pronto! Agora e so fazer seu pedido."
    ];

    doc.setFontSize(11);
    doc.setTextColor(60, 30, 10);
    doc.setFont("helvetica", "bold");
    doc.text(instructions[0], 20, 155);

    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.setFont("helvetica", "normal");
    for (let i = 1; i < instructions.length; i++) {
      doc.text(instructions[i], 20, 165 + (i - 1) * 8);
    }

    //  BORDA DECORATIVA
    doc.setDrawColor(200, 180, 160);
    doc.setLineWidth(0.3);
    doc.roundedRect(10, 145, pageWidth - 20, 40, 3, 3);

    //  LINK
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.setFont("helvetica", "italic");
    doc.text(data.link || "", pageWidth / 2, 210, { align: "center" });

    //  RODAPE
    doc.setFillColor(60, 30, 10);
    doc.rect(0, pageHeight - 15, pageWidth, 15, "F");

    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "normal");
    doc.text("© 2026 Menu Virtual QR ", pageWidth / 2, pageHeight - 15, { align: "center" });
  

    resolve(doc.output("blob"));
  });
}