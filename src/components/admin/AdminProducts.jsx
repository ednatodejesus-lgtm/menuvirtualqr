import { useEffect, useState } from "react";
import { ImagePlus, Upload } from "lucide-react";

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

import { getCategories } from "../../services/categoryService";

const EMPTY_FORM = {
  image_url: "",
  name: "",
  description: "",
  price: "",
  category_id: "",
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

  async function loadData() {
    if (!restaurantId) return;

    setLoading(true);
    setError(null);

    try {
      const [productsData, categoriesData] = await Promise.all([
        getProducts(restaurantId),
        getCategories(restaurantId),
      ]);

      setProducts(productsData || []);
      setCategories(categoriesData || []);
    } catch (err) {
      console.error("Erro ao carregar produtos/categorias:", err);
      setError("Não foi possível carregar os produtos. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [restaurantId]);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function resetForm() {
    setForm(EMPTY_FORM);
    setEditing(null);
    setImagePreview(null);
  }

  async function handleImageChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview imediato, antes mesmo do upload terminar
    setImagePreview(URL.createObjectURL(file));

    setUploadingImage(true);
    setError(null);

    try {
      const fileExt = file.name.split(".").pop();
      const filePath = `${restaurantId}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from(PRODUCT_IMAGES_BUCKET)
        .upload(filePath, file, { upsert: false });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from(PRODUCT_IMAGES_BUCKET).getPublicUrl(filePath);

      setForm((prev) => ({
        ...prev,
        image_url: publicUrl,
      }));
    } catch (err) {
      console.error("Erro ao enviar imagem:", err);
      setError("Não foi possível enviar a imagem. Tente novamente.");
      setImagePreview(null);
    } finally {
      setUploadingImage(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.name.trim()) {
      setError("O nome do produto é obrigatório.");
      return;
    }

    const price = Number(form.price);
    if (form.price === "" || Number.isNaN(price)) {
      setError("Indique um preço válido.");
      return;
    }

    const payload = {
      restaurant_id: restaurantId,
      category_id: form.category_id || null,
      name: form.name,
      description: form.description,
      price,
      image_url: form.image_url,
    };

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
      console.error("Erro ao guardar produto:", err);
      setError("Não foi possível guardar o produto. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  function startEditing(product) {
    setEditing(product);
    setForm({
      image_url: product.image_url || "",
      name: product.name || "",
      description: product.description || "",
      price: product.price ?? "",
      category_id: product.category_id || "",
    });
    setImagePreview(product.image_url || null);
  }

  async function removeProduct(id) {
    if (!confirm("Eliminar produto?")) return;

    try {
      await deleteProduct(id);
      await loadData();
    } catch (err) {
      console.error("Erro ao eliminar produto:", err);
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
          />
        ) : (
          "-"
        ),
    },
    {
      key: "name",
      label: "Produto",
    },
    {
      key: "categories",
      label: "Categoria",
      render: (product) => product.categories?.name || "-",
    },
    {
      key: "price",
      label: "Preço",
      render: (product) => `${product.price} Kz`,
    },
    {
      key: "available",
      label: "Estado",
      render: (product) =>
        product.available ? "Disponível" : "Indisponível",
    },
  ];

  function renderActions(product) {
    return (
      <>
        <Button onClick={() => startEditing(product)}>Editar</Button>
        <Button onClick={() => removeProduct(product.id)}>Excluir</Button>
      </>
    );
  }

  return (
    <Card title="Produtos">
      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h2>
            <ImagePlus size={20} />
            Imagem
          </h2>

          <label className="upload-box">
            {imagePreview ? (
              <img src={imagePreview} className="imagem-preview" alt="Pré-visualização do produto" />
            ) : (
              <>
                <Upload size={35} />
                <span>Selecionar imagem do produto</span>
              </>
            )}

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={uploadingImage}
            />
          </label>

          {uploadingImage && <p>A enviar imagem...</p>}
        </div>

        <Input
          name="name"
          placeholder="Nome do produto"
          value={form.name}
          onChange={handleChange}
          required
        />

        <Textarea
          name="description"
          placeholder="Descrição"
          value={form.description}
          onChange={handleChange}
        />

        <Input
          name="price"
          type="number"
          step="0.01"
          min="0"
          placeholder="Preço"
          value={form.price}
          onChange={handleChange}
          required
        />

        <Select
          name="category_id"
          value={form.category_id}
          onChange={handleChange}
        >
          <option value="">Categoria</option>

          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </Select>

        <Button type="submit" disabled={saving || uploadingImage}>
          {saving ? "A guardar..." : editing ? "Actualizar" : "Criar Produto"}
        </Button>

        {editing && (
          <Button
            type="button"
            onClick={resetForm}
            disabled={saving || uploadingImage}
          >
            Cancelar
          </Button>
        )}
      </form>

      {error && (
        <p style={{ color: "crimson", marginTop: "8px" }}>{error}</p>
      )}

      <hr />

      {loading ? (
        <p>A carregar produtos...</p>
      ) : (
        <Table columns={columns} data={products} actions={renderActions} />
      )}
    </Card>
  );
}
