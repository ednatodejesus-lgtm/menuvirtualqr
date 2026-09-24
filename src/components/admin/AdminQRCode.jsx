import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import Card from "./ui/Card";
import InfoBox from "./InfoBox";
import { getRestaurantQR } from "../../services/qrService";
import { generateRestaurantPDF } from "../../services/pdfQrGenerator";
import { QRCodeCanvas } from "qrcode.react";
import { MENUQR_QR_IMAGE_SETTINGS, getPublicMenuUrl } from "../../services/qrBrand";
import {
  Download, 
  FileText, 
  File, 
  FilePlus, 
  Award, 
  Sparkles,
  CheckCircle, 
  ExternalLink, 
  Copy
} from "lucide-react";

export default function AdminQRCode() {
  const { profile } = useAuth();
  const restaurantId = profile?.restaurant_id;
  const [qr, setQr] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pdfType, setPdfType] = useState("simple");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadQR() {
      try {
        const data = await getRestaurantQR(restaurantId);
        const publicLink = data?.slug ? getPublicMenuUrl(data.slug) : data?.link;
        setQr({ ...data, link: publicLink });
      } catch (error) {
        console.error("Error loading QR:", error);
      } finally {
        setLoading(false);
      }
    }
    if (restaurantId) loadQR();
  }, [restaurantId]);

  function downloadQR() {
    const canvas = document.getElementById("restaurant-qr");
    if (canvas) {
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `qr-code-${qr?.slug || "restaurant"}.png`;
      link.click();
    }
  }

  async function copyLink() {
    if (!qr?.link) return;
    try {
      await navigator.clipboard.writeText(qr.link);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error("Error copying link:", err);
    }
  }

 function handleGeneratePDF() {
  const data = {
    ...qr,
    // ✅ Usa o nome do restaurante. Se não existir, usa o slug como fallback.
    restaurantName: qr?.restaurant.name || qr?.name || qr?.slug || "Restaurante",// Garante que o slug existe
  };
  generateRestaurantPDF(data, pdfType);
}

  if (loading) {
    return <Card title="QR Code do Restaurante"><p style={{ color: "#64748b" }}>A carregar QR Code...</p></Card>;
  }

  if (!qr) {
    return <Card title="QR Code do Restaurante"><p style={{ color: "#ef4444" }}>QR Code nao encontrado.</p></Card>;
  }

  const pdfLabel = pdfType === "simple" ? "Simples" : pdfType === "medium" ? "Medio" : "Premium";

  return (
    <Card title="QR Code do Restaurante">
      <div className="qr-container" style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        padding: "2rem", backgroundColor: "#f8fafc",
        borderRadius: "12px", marginBottom: "1.5rem"
      }}>
        <QRCodeCanvas
          id="restaurant-qr"
          value={qr.link}
          size={250}
          level="H"
          includeMargin={true}
          imageSettings={MENUQR_QR_IMAGE_SETTINGS}
        />
      </div>

      <h3 style={{ fontSize: "0.875rem", fontWeight: "600", color: "#334155", marginBottom: "0.5rem" }}>
        Link publico
      </h3>

      <div style={{
        display: "flex", alignItems: "center", gap: "0.5rem",
        backgroundColor: "#f1f5f9", padding: "0.5rem 0.75rem",
        borderRadius: "8px", border: "1px solid #e2e8f0", marginBottom: "1rem"
      }}>
        <a href={qr.link} target="_blank" rel="noreferrer" style={{
          flex: 1, color: "#8B4513", textDecoration: "none",
          fontSize: "0.875rem", wordBreak: "break-all"
        }}>{qr.link}</a>
        <button onClick={copyLink} title="Copiar link" style={{
          background: "none", border: "none", cursor: "pointer",
          color: "#64748b", padding: "0.25rem"
        }}>
          {copied ? <CheckCircle size={18} color="#22c55e" /> : <Copy size={18} />}
        </button>
        <a href={qr.link} target="_blank" rel="noreferrer" title="Abrir menu"
          style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b", padding: "0.25rem", display: "flex" }}>
          <ExternalLink size={18} />
        </a>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginBottom: "1.5rem" }}>
        <button className="secondary-action" onClick={downloadQR} style={{
          display: "flex", alignItems: "center", gap: "0.5rem",
          padding: "0.5rem 1rem", backgroundColor: "#f1f5f9",
          border: "1px solid #e2e8f0", borderRadius: "8px",
          cursor: "pointer", fontSize: "0.875rem", fontWeight: "500", color: "#475569"
        }}>
          <Download size={18} /> Baixar QR Code
        </button>
      </div>

      <div style={{
        marginBottom: "1.5rem", padding: "1rem", backgroundColor: "#f8fafc",
        borderRadius: "8px", border: "1px solid #e2e8f0"
      }}>
        <p style={{ fontSize: "0.875rem", fontWeight: "600", color: "#334155", marginBottom: "0.75rem" }}>
          Tipo de PDF
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {[
            ["simple", <File size={16} />, "Simples"],
            ["medium", <FileText size={16} />, "Medio"],
            ["premium", <Award size={16} />, "Premium"]
          ].map(([type, icon, label]) => (
            <button key={type} onClick={() => setPdfType(type)} style={{
              display: "flex", alignItems: "center", gap: "0.5rem",
              padding: "0.5rem 1rem",
              backgroundColor: pdfType === type ? "#8B4513" : "#f1f5f9",
              color: pdfType === type ? "white" : "#475569",
              border: pdfType === type ? "1px solid #8B4513" : "1px solid #e2e8f0",
              borderRadius: "8px", cursor: "pointer", fontSize: "0.75rem", fontWeight: "500"
            }}>{icon}{label}</button>
          ))}
        </div>
      </div>

      <button className="primary-action" onClick={handleGeneratePDF} style={{
        display: "flex", alignItems: "center", gap: "0.5rem",
        padding: "0.75rem 1.5rem", backgroundColor: "#8B4513",
        color: "white", border: "none", borderRadius: "8px",
        cursor: "pointer", fontSize: "0.875rem", fontWeight: "600",
        width: "100%", justifyContent: "center", marginBottom: "1.5rem"
      }}>
        <FilePlus size={18} /> Gerar PDF {pdfLabel}
      </button>

      <InfoBox>
        <h4 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Sparkles size={18} /> Dicas do QR Code
        </h4>
        <ul style={{ paddingLeft: "1.5rem", margin: "0.5rem 0" }}>
          <li>Imprima e coloque nas mesas do restaurante</li>
          <li>Partilhe nas redes sociais</li>
          <li>Os clientes escaneiam para ver o menu</li>
          <li>As alteracoes do menu aparecem automaticamente em tempo real</li>
        </ul>
      </InfoBox>
    </Card>
  );
}
