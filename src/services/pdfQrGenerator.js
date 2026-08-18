import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// 🔥 IMPORTAR OS TEMPLATES
import { generateSimplePDF } from "./pdfTemplates/simplePDF";
import { generateMediumPDF } from "./pdfTemplates/mediumPDF";
import { generatePremiumPDF } from "./pdfTemplates/premiumPDF";

/**
 * Gerar PDF do restaurante com base no tipo selecionado
 */
export async function generateRestaurantPDF(data, type = "simple") {
  try {
    let pdfBlob;

    switch (type) {
      case "simple":
        pdfBlob = await generateSimplePDF(data);
        break;
      case "medium":
        pdfBlob = await generateMediumPDF(data);
        break;
      case "premium":
        pdfBlob = await generatePremiumPDF(data);
        break;
      default:
        pdfBlob = await generateSimplePDF(data);
    }

    // Baixar o PDF
    const link = document.createElement("a");
    link.href = URL.createObjectURL(pdfBlob);
    link.download = `qr-code-${data?.slug || "restaurant"}-${type}.pdf`;
    link.click();
    URL.revokeObjectURL(link.href);

    return pdfBlob;
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw new Error("Nao foi possivel gerar o PDF.");
  }
}