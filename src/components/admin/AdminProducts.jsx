import { useEffect, useState, useRef } from "react";
import { ImagePlus, Upload, X, Package, Loader2 } from "lucide-react";

import { useAuth } from "../../hooks/useAuth";
import { supabase } from "../../services/supabase";

import Card from "./ui/Card";
import Table from "./ui/Table";
import Textarea from "./ui/Textarea";
import Input from "./ui/Input";
import Select from "./ui/Select";
import Button from "./ui/Button";

import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../services/productService";

const EMPTY_FORM = {
  image_url: "",
  name: "",
  description: "",
  price: "",
  category_id: "",
  disponivel: true,
};

const PRODUCT_IMAGES_BUCKET = "products";

export default function AdminProducts() {
  const { profile } = useAuth();
  const restaurantId = profile?.restaurant_id;

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editing, setEditing] = useState(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);

  async function loadData() {
    if (!restaurantId) return;

    setLoading(true);
    setError(null);

    try {
      const [productsData, categoriesData] = await Promise.all([
        getProducts(restaurantId),
        getCategories(restaurantId),
      ]);

      console.log("Produtos carregados:", productsData?.length || 0);
      console.log("Categorias carregadas:", categoriesData?.length || 0);

      setProducts(productsData || []);
      setCategories(categoriesData || []);
    } catch (err) {
      console.error("❌ Erro ao carregar:", err);
      setError("Não foi possível carregar os produtos. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [restaurantId]);

  async function getCategories(restaurantId) {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("restaurant_id", restaurantId)
        .order("name", { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error("❌ Erro ao buscar categorias:", err);
      return [];
    }
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function resetForm() {
    setForm(EMPTY_FORM);
    setEditing(null);
    setImagePreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleImageChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Por favor, selecione uma imagem válida.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("A imagem deve ter no máximo 2MB.");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    setUploadingImage(true);
    setError(null);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${restaurantId}/${fileName}`;

      console.log("📤 Enviando imagem:", filePath);

      const { error: uploadError } = await supabase.storage
        .from(PRODUCT_IMAGES_BUCKET)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        console.error("❌ Erro no upload:", uploadError);
        if (uploadError.message?.includes("row-level security")) {
          setError("Erro de permissão no Storage. Configure o bucket 'products' como público.");
        } else {
          setError(`Erro ao enviar imagem: ${uploadError.message}`);
        }
        setImagePreview(null);
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from(PRODUCT_IMAGES_BUCKET)
        .getPublicUrl(filePath);

      console.log("Imagem enviada:", publicUrl);

      setForm((prev) => ({
        ...prev,
        image_url: publicUrl,
      }));
    } catch (err) {
      console.error("❌ Erro ao enviar imagem:", err);
      setError("Não foi possível enviar a imagem. Tente novamente.");
      setImagePreview(null);
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  function removeImage() {
    setForm((prev) => ({ ...prev, image_url: "" }));
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.name.trim()) {
      setError("O nome do produto é obrigatório.");
      return;
    }

    const price = Number(form.price);
    if (form.price === "" || Number.isNaN(price) || price < 0) {
      setError("Indique um preço válido.");
      return;
    }

    if (!form.category_id) {
      setError("Selecione uma categoria.");
      return;
    }

    const payload = {
      restaurant_id: restaurantId,
      category_id: form.category_id,
      name: form.name.trim(),
      description: form.description?.trim() || "",
      price: price,
      image_url: form.image_url || null,
      disponivel: form.disponivel,
    };

    console.log("💾 Salvando produto:", payload);

    setSaving(true);
    setError(null);

    try {
      if (editing) {
        await updateProduct(editing.id, payload);
      } else {
        await createProduct({
          ...payload,
          sort_order: products.length,
        });
      }

      resetForm();
      await loadData();
    } catch (err) {
      console.error("❌ Erro ao guardar produto:", err);
      setError(err.message || "Não foi possível guardar o produto. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  function startEditing(product) {
    console.log("✏️ Editando produto:", product);
    setEditing(product);
    setForm({
      image_url: product.image_url || "",
      name: product.name || "",
      description: product.description || "",
      price: product.price ?? "",
      category_id: product.category_id || "",
      disponivel: product.disponivel !== undefined ? product.disponivel : true,
    });
    setImagePreview(product.image_url || null);
    setError(null);
  }

  async function removeProduct(id) {
    if (!confirm("Tem certeza que deseja eliminar este produto?")) return;

    try {
      await deleteProduct(id);
      await loadData();
    } catch (err) {
      console.error("❌ Erro ao eliminar produto:", err);
      setError("Não foi possível eliminar o produto. Tente novamente.");
    }
  }

  const columns = [
    {
      key: "image_url",
      label: "Imagem",
      render: (product) =>
        product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            width="60"
            height="60"
            style={{ objectFit: "cover", borderRadius: "8px" }}
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        ) : (
          <span style={{ color: "#94a3b8", fontSize: "0.75rem" }}>—</span>
        ),
    },
    {
      key: "name",
      label: "Produto",
    },
    {
      key: "category",
      label: "Categoria",
      render: (product) => {
        const category = categories.find((c) => c.id === product.category_id);
        return category?.name || "—";
      },
    },
    {
      key: "price",
      label: "Preço",
      render: (product) => `${Number(product.price).toFixed(2)} Kz`,
    },
    {
      key: "disponivel",
      label: "Estado",
      render: (product) =>
        product.disponivel ? (
          <span style={{ color: "#22c55e", fontWeight: "500" }}>🟢 Disponível</span>
        ) : (
          <span style={{ color: "#ef4444", fontWeight: "500" }}>🔴 Indisponível</span>
        ),
    },
  ];

  function renderActions(product) {
    return (
      <div style={{ display: "flex", gap: "0.25rem", flexWrap: "wrap" }}>
        <Button variant="outline" size="sm" onClick={() => startEditing(product)}>
          Editar
        </Button>
        <Button variant="danger" size="sm" onClick={() => removeProduct(product.id)}>
          Excluir
        </Button>
      </div>
    );
  }

  return (
    <Card title="Produtos"> 
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {/* Imagem */}
        <div>
          <h3 style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", fontWeight: "600" }}>
            <ImagePlus size={20} />
            Imagem do Produto
          </h3>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap", marginTop: "0.5rem" }}>
            <label
              className="upload-box"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: "150px",
                height: "120px",
                border: "2px dashed #94a3b8",
                borderRadius: "8px",
                cursor: uploadingImage ? "not-allowed" : "pointer",
                background: imagePreview ? "transparent" : "#f8fafc",
                overflow: "hidden",
                position: "relative",
                opacity: uploadingImage ? 0.5 : 1,
              }}
            >
              {imagePreview ? (
                <>
                  <img
                    src={imagePreview}
                    alt="Pré-visualização"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage();
                    }}
                    style={{
                      position: "absolute",
                      top: "4px",
                      right: "4px",
                      background: "#ef4444",
                      color: "white",
                      border: "none",
                      borderRadius: "50%",
                      width: "24px",
                      height: "24px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <X size={14} />
                  </button>
                </>
              ) : (
                <>
                  <Upload size={35} color="#94a3b8" />
                  <span style={{ fontSize: "0.75rem", color: "#94a3b8", textAlign: "center" }}>
                    {uploadingImage ? "Enviando..." : "Selecionar imagem"}
                  </span>
                </>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={uploadingImage}
                style={{ display: "none" }}
              />
            </label>

            {uploadingImage && (
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#64748b" }}>
                <Loader2 size={16} className="animate-spin" />
                <span style={{ fontSize: "0.875rem" }}>A enviar imagem...</span>
              </div>
            )}

            {form.image_url && !uploadingImage && (
              <span style={{ fontSize: "0.75rem", color: "#22c55e" }}>Imagem carregada</span>
            )}
          </div>
        </div>

        {/* Nome */}
        <Input
          name="name"
          placeholder="Nome do produto *"
          value={form.name}
          onChange={handleChange}
          required
        />

        {/* Descrição */}
        <Textarea
          name="description"
          placeholder="Descrição do produto"
          value={form.description}
          onChange={handleChange}
          rows={3}
        />

        {/* Preço e Categoria */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <Input
            name="price"
            type="number"
            step="0.01"
            min="0"
            placeholder="Preço *"
            value={form.price}
            onChange={handleChange}
            required
          />

          <Select
            name="category_id"
            value={form.category_id}
            onChange={handleChange}
            placeholder="Selecione a Categoria *"
            required
            options={categories.map((cat) => ({
              value: cat.id,
              label: cat.name,
            }))}
          />
        </div>

        {/*CHECKBOX DISPONIVEL */}
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: "0.75rem",
          padding: "0.5rem",
          background: form.disponivel ? "#f0fdf4" : "#fef2f2",
          borderRadius: "8px",
          border: form.disponivel ? "1px solid #86efac" : "1px solid #fecaca",
          transition: "all 0.2s"
        }}>
          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
            <input
              type="checkbox"
              name="disponivel"
              checked={form.disponivel}
              onChange={handleChange}
              style={{
                width: "18px",
                height: "18px",
                cursor: "pointer",
                accentColor: "#8B4513",
              }}
            />
            <span style={{ fontWeight: "500", fontSize: "0.875rem" }}>
              {form.disponivel ? "🟢 Produto Disponível" : "🔴 Produto Indisponível"}
            </span>
          </label>
        </div>

        {/* Mensagem se não houver categorias */}
        {categories.length === 0 && !loading && (
          <p style={{ fontSize: "0.75rem", color: "#ef4444" }}>
            ⚠️ Nenhuma categoria encontrada. Crie uma categoria primeiro.
          </p>
        )}

        {/* Botões */}
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <Button type="submit" disabled={saving || uploadingImage || loading}>
            {saving ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                A guardar...
              </>
            ) : editing ? (
              "Actualizar Produto"
            ) : (
              "Criar Produto"
            )}
          </Button>

          {editing && (
            <Button variant="outline" onClick={resetForm} disabled={saving || uploadingImage}>
              Cancelar
            </Button>
          )}
        </div>

        {/* Erro */}
        {error && (
          <div
            style={{
              color: "#ef4444",
              padding: "0.75rem",
              background: "#fef2f2",
              borderRadius: "8px",
              border: "1px solid #fecaca",
              fontSize: "0.875rem",
            }}
          >
            ❌ {error}
          </div>
        )}
      </form>

      <hr style={{ margin: "2rem 0", border: "none", borderTop: "1px solid #e2e8f0" }} />

      {/* Tabela de produtos */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <Loader2 size={24} className="animate-spin" style={{ color: "#8B4513" }} />
          <p style={{ marginTop: "0.5rem", color: "#64748b" }}>A carregar produtos...</p>
        </div>
      ) : (
        <Table
          columns={columns}
          data={products}
          actions={renderActions}
          emptyMessage="Nenhum produto cadastrado. Crie o primeiro produto acima."
        />
      )}
    </Card>
  );
}