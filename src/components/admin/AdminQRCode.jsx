import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import Card from "./ui/Card";
import InfoBox from "./InfoBox";
import { hasTables } from "../../config/businessConfig";
import { getRestaurantQR } from "../../services/qrService";
import { generateRestaurantPDF } from "../../services/pdfQrGenerator";
import { QRCodeCanvas } from "qrcode.react";
import { MENUQR_QR_IMAGE_SETTINGS, getPublicMenuUrl } from "../../services/qrBrand";
import { supabase } from "../../services/supabase";
import {
  Download,
  FileText,
  File,
  FilePlus,
  Award,
  Sparkles,
  CheckCircle,
  ExternalLink,
  Copy,
  Plus,
  Trash2,
  Utensils,
  AlertCircle,
} from "lucide-react";

export default function AdminQRCode() {
  const { profile } = useAuth();
  const restaurantId = profile?.restaurant_id;

  const [qr, setQr] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pdfType, setPdfType] = useState("simple");
  const [copied, setCopied] = useState(false);

  // 🔥 Estado do restaurante (para obter business_type)
  const [restaurant, setRestaurant] = useState(null);

  // 🔥 Estado para QR Codes das mesas
  const [mesaQRCodes, setMesaQRCodes] = useState([]);
  const [loadingMesas, setLoadingMesas] = useState(true);
  const [copiedMesa, setCopiedMesa] = useState(null);

  // business_type vem do RESTAURANTE, não do profile
  const businessType = restaurant?.business_type;
  const businessHasTables = hasTables(businessType);

  // 🔥 Carregar dados do restaurante
  useEffect(() => {
    async function loadRestaurant() {
      if (!restaurantId) return;
      try {
        const { data, error } = await supabase
          .from("restaurants")
          .select("business_type, name")
          .eq("id", restaurantId)
          .single();

        if (error) throw error;
        setRestaurant(data);
      } catch (error) {
        console.error("Error loading restaurant:", error);
      }
    }
    loadRestaurant();
  }, [restaurantId]);

  // 🔥 Carregar QR Code do restaurante
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

  // 🔥 Carregar QR Codes das mesas (só se o negócio tiver mesas)
  useEffect(() => {
    if (restaurantId && businessHasTables) {
      loadMesaQRCodes();
    } else {
      setLoadingMesas(false);
    }
  }, [restaurantId, businessHasTables]);

  async function loadMesaQRCodes() {
    try {
      setLoadingMesas(true);
      const { data, error } = await supabase
        .from("qr_codes")
        .select("*")
        .eq("restaurant_id", restaurantId)
        .eq("tipo", "mesa")
        .order("mesa", { ascending: true });

      if (error) throw error;
      setMesaQRCodes(data || []);
    } catch (error) {
      console.error("Error loading mesa QR codes:", error);
    } finally {
      setLoadingMesas(false);
    }
  }

  // 🔥 Gerar próximo QR de mesa automaticamente
  async function generateNextMesaQR() {
    try {
      const usedMesas = mesaQRCodes.map((q) => q.mesa).filter(Boolean);
      let nextMesa = 1;
      while (usedMesas.includes(nextMesa)) {
        nextMesa++;
      }

      const baseLink = qr?.link || getPublicMenuUrl(qr?.slug);
      const separator = baseLink.includes("?") ? "&" : "?";
      const link = `${baseLink}${separator}mesa=${nextMesa}`;

      const { data, error } = await supabase
        .from("qr_codes")
        .insert([
          {
            restaurant_id: restaurantId,
            code: `MESA-${nextMesa}-${Date.now()}`,
            link: link,
            tipo: "mesa",
            mesa: nextMesa,
            ativo: true,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setMesaQRCodes((prev) =>
        [...prev, data].sort((a, b) => a.mesa - b.mesa)
      );
    } catch (error) {
      console.error("Error generating mesa QR:", error);
      alert("Erro ao gerar QR da mesa: " + error.message);
    }
  }

  // 🔥 Eliminar QR de mesa
  async function deleteMesaQR(id, mesa) {
    if (!confirm(`Tem certeza que deseja eliminar o QR da Mesa ${mesa}?`)) return;

    try {
      const { error } = await supabase.from("qr_codes").delete().eq("id", id);
      if (error) throw error;

      setMesaQRCodes((prev) => prev.filter((q) => q.id !== id));
    } catch (error) {
      console.error("Error deleting mesa QR:", error);
      alert("Erro ao eliminar QR: " + error.message);
    }
  }

  // 🔥 Download QR de mesa
  function downloadMesaQR(id, mesa) {
    const canvas = document.getElementById(id);
    if (canvas) {
      const link = document.createElement("a");
      link.download = `mesa-${mesa}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    }
  }

  // 🔥 Copiar link da mesa
  async function copyMesaLink(link, id) {
    try {
      await navigator.clipboard.writeText(link);
      setCopiedMesa(id);
      setTimeout(() => setCopiedMesa(null), 2000);
    } catch (err) {
      console.error("Error copying link:", err);
    }
  }

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
      restaurantName: qr?.restaurant?.name || qr?.name || qr?.slug || "Restaurante",
    };
    generateRestaurantPDF(data, pdfType);
  }

  if (loading) {
    return (
      <Card title="QR Code do Restaurante">
        <p style={{ color: "#64748b" }}>A carregar QR Code...</p>
      </Card>
    );
  }

  if (!qr) {
    return (
      <Card title="QR Code do Restaurante">
        <p style={{ color: "#ef4444" }}>QR Code nao encontrado.</p>
      </Card>
    );
  }

  const pdfLabel =
    pdfType === "simple" ? "Simples" : pdfType === "medium" ? "Medio" : "Premium";

  return (
    <>
      {/* ============================================================
          SECÇÃO 1: QR CODE DO RESTAURANTE
          ============================================================ */}
      <Card title="QR Code do Restaurante">
        <div
          className="qr-container"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "2rem",
            backgroundColor: "#f8fafc",
            borderRadius: "12px",
            marginBottom: "1.5rem",
          }}
        >
          <QRCodeCanvas
            id="restaurant-qr"
            value={qr.link}
            size={250}
            level="H"
            includeMargin={true}
            imageSettings={MENUQR_QR_IMAGE_SETTINGS}
          />
        </div>

        <h3
          style={{
            fontSize: "0.875rem",
            fontWeight: "600",
            color: "#334155",
            marginBottom: "0.5rem",
          }}
        >
          Link publico
        </h3>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            backgroundColor: "#f1f5f9",
            padding: "0.5rem 0.75rem",
            borderRadius: "8px",
            border: "1px solid #e2e8f0",
            marginBottom: "1rem",
          }}
        >
          <a
            href={qr.link}
            target="_blank"
            rel="noreferrer"
            style={{
              flex: 1,
              color: "#8B4513",
              textDecoration: "none",
              fontSize: "0.875rem",
              wordBreak: "break-all",
            }}
          >
            {qr.link}
          </a>
          <button
            onClick={copyLink}
            title="Copiar link"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#64748b",
              padding: "0.25rem",
            }}
          >
            {copied ? <CheckCircle size={18} color="#22c55e" /> : <Copy size={18} />}
          </button>
          <a
            href={qr.link}
            target="_blank"
            rel="noreferrer"
            title="Abrir menu"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#64748b",
              padding: "0.25rem",
              display: "flex",
            }}
          >
            <ExternalLink size={18} />
          </a>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.75rem",
            marginBottom: "1.5rem",
          }}
        >
          <button
            className="secondary-action"
            onClick={downloadQR}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.5rem 1rem",
              backgroundColor: "#f1f5f9",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "0.875rem",
              fontWeight: "500",
              color: "#475569",
            }}
          >
            <Download size={18} /> Baixar QR Code
          </button>
        </div>

        <div
          style={{
            marginBottom: "1.5rem",
            padding: "1rem",
            backgroundColor: "#f8fafc",
            borderRadius: "8px",
            border: "1px solid #e2e8f0",
          }}
        >
          <p
            style={{
              fontSize: "0.875rem",
              fontWeight: "600",
              color: "#334155",
              marginBottom: "0.75rem",
            }}
          >
            Tipo de PDF
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {[
              ["simple", <File size={16} />, "Simples"],
              ["medium", <FileText size={16} />, "Medio"],
              ["premium", <Award size={16} />, "Premium"],
            ].map(([type, icon, label]) => (
              <button
                key={type}
                onClick={() => setPdfType(type)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.5rem 1rem",
                  backgroundColor: pdfType === type ? "#8B4513" : "#f1f5f9",
                  color: pdfType === type ? "white" : "#475569",
                  border:
                    pdfType === type
                      ? "1px solid #8B4513"
                      : "1px solid #e2e8f0",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "0.75rem",
                  fontWeight: "500",
                }}
              >
                {icon}
                {label}
              </button>
            ))}
          </div>
        </div>

        <button
          className="primary-action"
          onClick={handleGeneratePDF}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.75rem 1.5rem",
            backgroundColor: "#8B4513",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "0.875rem",
            fontWeight: "600",
            width: "100%",
            justifyContent: "center",
            marginBottom: "1.5rem",
          }}
        >
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

      {/* ============================================================
          SECÇÃO 2: QR CODES DAS MESAS
          (apenas restaurant, hamburgeria, cafeteria, bar_noturno, pizzaria)
          ============================================================ */}
      {businessHasTables && (
        <Card title="QR Codes das Mesas">
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
              flexWrap: "wrap",
              gap: "0.5rem",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "0.875rem",
                color: "#64748b",
              }}
            >
              <Utensils size={18} />
              <span>
                {mesaQRCodes.length}{" "}
                {mesaQRCodes.length === 1 ? "mesa" : "mesas"} configuradas
              </span>
            </div>

            <button
              onClick={generateNextMesaQR}
              disabled={loadingMesas}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.6rem 1.2rem",
                background: "#22c55e",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: loadingMesas ? "not-allowed" : "pointer",
                fontSize: "0.875rem",
                fontWeight: "600",
                opacity: loadingMesas ? 0.6 : 1,
                transition: "all 0.2s",
              }}
            >
              <Plus size={16} />
              Gerar QR da Mesa {mesaQRCodes.length + 1}
            </button>
          </div>

          {/* Aviso */}
          <div
            style={{
              padding: "0.75rem 1rem",
              background: "#fef3c7",
              border: "1px solid #fcd34d",
              borderRadius: "8px",
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "0.8rem",
              color: "#92400e",
            }}
          >
            <AlertCircle size={16} />
            O sistema gera automaticamente o próximo número de mesa disponível.
          </div>

          {/* Lista */}
          {loadingMesas ? (
            <p
              style={{
                color: "#64748b",
                textAlign: "center",
                padding: "2rem",
              }}
            >
              A carregar mesas...
            </p>
          ) : mesaQRCodes.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "3rem 2rem",
                color: "#94a3b8",
                background: "#f8fafc",
                borderRadius: "12px",
                border: "1px dashed #e2e8f0",
              }}
            >
              <Utensils
                size={40}
                style={{ opacity: 0.4, marginBottom: "0.5rem" }}
              />
              <p style={{ margin: 0 }}>Nenhum QR de mesa gerado ainda.</p>
              <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.8rem" }}>
                Clique em "Gerar QR da Mesa 1" para começar.
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                gap: "1rem",
              }}
            >
              {mesaQRCodes.map((mesa) => (
                <div
                  key={mesa.id}
                  style={{
                    background: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    padding: "1rem",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "0.75rem",
                    transition: "all 0.2s",
                  }}
                >
                  <div
                    style={{
                      background: "#fef3e8",
                      color: "#8B4513",
                      padding: "0.25rem 0.75rem",
                      borderRadius: "20px",
                      fontSize: "0.75rem",
                      fontWeight: "600",
                    }}
                  >
                    Mesa {mesa.mesa}
                  </div>

                  <div
                    style={{
                      background: "white",
                      padding: "0.5rem",
                      borderRadius: "8px",
                    }}
                  >
                    <QRCodeCanvas
                      id={`qr-mesa-${mesa.id}`}
                      value={mesa.link}
                      size={120}
                      level="H"
                      includeMargin={false}
                      imageSettings={MENUQR_QR_IMAGE_SETTINGS}
                    />
                  </div>

                  <div
                    style={{ display: "flex", gap: "0.4rem", width: "100%" }}
                  >
                    <button
                      onClick={() =>
                        downloadMesaQR(`qr-mesa-${mesa.id}`, mesa.mesa)
                      }
                      title="Baixar"
                      style={{
                        flex: 1,
                        padding: "0.4rem",
                        background: "#8B4513",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "0.7rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.25rem",
                        fontWeight: "500",
                      }}
                    >
                      <Download size={12} />
                      Baixar
                    </button>

                    <button
                      onClick={() => copyMesaLink(mesa.link, mesa.id)}
                      title="Copiar link"
                      style={{
                        padding: "0.4rem 0.5rem",
                        background: "#f1f5f9",
                        color: "#475569",
                        border: "1px solid #e2e8f0",
                        borderRadius: "6px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {copiedMesa === mesa.id ? (
                        <CheckCircle size={12} color="#22c55e" />
                      ) : (
                        <Copy size={12} />
                      )}
                    </button>

                    <button
                      onClick={() => deleteMesaQR(mesa.id, mesa.mesa)}
                      title="Eliminar"
                      style={{
                        padding: "0.4rem 0.5rem",
                        background: "#fee2e2",
                        color: "#ef4444",
                        border: "1px solid #fecaca",
                        borderRadius: "6px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}
    </>
  );
}