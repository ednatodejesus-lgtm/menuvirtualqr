import { useState } from "react";
import { X, Copy, Check, Download } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";  // Correto para v4.2.0
import { supabase } from "../../services/supabase";

export default function QrModal({ restaurant, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!restaurant) return null;

  const APP_URL = import.meta.env.VITE_APP_URL || "http://localhost:5173";
  const qrLink = `${APP_URL}/menu/${restaurant.slug}`;

  async function downloadQR() {
    const canvas = document.getElementById("qr-code-canvas");
    if (canvas) {
      const link = document.createElement("a");
      link.download = `qr-code-${restaurant.slug}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(qrLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error("Error copying link:", err);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>QR Code - {restaurant.name}</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="qr-container">
            <QRCodeCanvas
              id="qr-code-canvas"
              value={qrLink}
              size={200}
              level="H"
              includeMargin={true}
            />
          </div>

          <div className="qr-link">
            <p className="link-label">Link do menu:</p>
            <div className="link-box">
              <span className="link-text">{qrLink}</span>
              <button className="copy-btn" onClick={copyLink}>
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
          </div>

          <div className="qr-actions">
            <button className="primary-button" onClick={downloadQR}>
              <Download size={18} />
              Baixar QR Code
            </button>
            <button className="secondary-button" onClick={onClose}>
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}