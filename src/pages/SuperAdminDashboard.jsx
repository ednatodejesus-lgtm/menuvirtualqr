import {
  useEffect,
  useState
} from "react";

import {
  Plus,
  Search,
  Store,
  Users,
  CheckCircle,
  XCircle,
  QrCode,
  Eye,
  UserRound,
  Trash2,
  Power,
  PowerOff,
  RefreshCcw,
  AlertCircle
} from "lucide-react";

import { supabase } from "../services/supabase";

import RestaurantCreate from "../components/superadmin/RestaurantCreate";
import RestaurantSuccessModal from "../components/superadmin/RestaurantSuccessModal";
import ManagerModal from "../components/superadmin/ManagerModal";
import QrModal from "../components/superadmin/QrModal";

import "../styles/superadmin.css";

export default function SuperAdminDashboard() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState("");

  // Modal states
  const [createdRestaurant, setCreatedRestaurant] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Novos states
  const [theme, setTheme] = useState("light");
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [showQR, setShowQR] = useState(false);
  const [showManager, setShowManager] = useState(false);
  const [profile, setProfile] = useState(null);

  // Modal states
  const [showManagerModal, setShowManagerModal] = useState(false);
  const [managerData, setManagerData] = useState(null);

  // State para mensagem de erro
  const [errorMessage, setErrorMessage] = useState(null);

  async function loadRestaurants() {
    setLoading(true);

    const { data, error } = await supabase
      .from("restaurants")
      .select(`*`)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading restaurants:", error);
      setLoading(false);
      return;
    }

    setRestaurants(data || []);
    setLoading(false);
  }

  async function loadProfile() {
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    setProfile(data);
  }

  useEffect(() => {
    loadRestaurants();
    loadProfile();
  }, []);

  const filteredRestaurants = restaurants.filter((item) =>
    item.name?.toLowerCase().includes(search.toLowerCase())
  );

  // ============================================================
  // 1. FUNCAO PARA ACTIVAR/DESACTIVAR RESTAURANTE
  // ============================================================
  async function toggleStatus(id, currentStatus) {
  // Usar 'suspended' em vez de 'disabled' (conforme constraint da tabela)
  const newStatus = currentStatus === "active" ? "suspended" : "active";
  const action = newStatus === "active" ? "activar" : "bloquear";

  const confirmAction = window.confirm(
    `Tem certeza que deseja ${action} este restaurante?`
  );

  if (!confirmAction) return;

  try {
    const { error } = await supabase
      .from("restaurants")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      console.error("Error updating status:", error);
      setErrorMessage(`Erro ao ${action} restaurante. Tente novamente.`);
      setTimeout(() => setErrorMessage(null), 5000);
      return;
    }

    // Se o restaurante foi bloqueado, mostrar mensagem
    if (newStatus === "suspended") {
      setErrorMessage(
        `Restaurante bloqueado com sucesso. O menu nao pode ser exibido no momento.`
      );
      setTimeout(() => setErrorMessage(null), 5000);
    }

    loadRestaurants();
  } catch (err) {
    console.error("Toggle status error:", err);
    setErrorMessage(`Erro ao ${action} restaurante. Tente novamente.`);
    setTimeout(() => setErrorMessage(null), 5000);
  }
}

  // ============================================================
  // 2. FUNCAO PARA ELIMINAR RESTAURANTE (COM SENHA)
  // ============================================================
  async function deleteRestaurant(id, name) {
  // Primeiro: confirmar
  const confirmDelete = window.confirm(
    `Tem certeza que deseja eliminar o restaurante "${name}"? Esta acao nao pode ser revertida.`
  );

  if (!confirmDelete) return;

  // Segundo: pedir senha
  const password = window.prompt(
    `Para confirmar a eliminacao do restaurante "${name}", digite a palavra: ELIMINAR`
  );

  if (password === null) {
    return;
  }

  if (password !== "ELIMINAR") {
    setErrorMessage(`Palavra incorreta. A eliminacao foi cancelada.`);
    setTimeout(() => setErrorMessage(null), 5000);
    return;
  }

  try {
    // 1. Buscar o admin do restaurante
    const { data: adminData, error: adminFindError } = await supabase
      .from("profiles")
      .select("id")
      .eq("restaurant_id", id)
      .eq("role", "restaurant_admin")
      .maybeSingle();

    if (adminFindError) {
      console.error("Error finding admin:", adminFindError);
    }

    // 2. Eliminar o perfil do admin (se existir)
    if (adminData) {
      const { error: profileDeleteError } = await supabase
        .from("profiles")
        .delete()
        .eq("id", adminData.id);

      if (profileDeleteError) {
        console.error("Error deleting profile:", profileDeleteError);
        setErrorMessage(`Erro ao eliminar perfil do admin. Tente novamente.`);
        setTimeout(() => setErrorMessage(null), 5000);
        return;
      }

      // 3. Eliminar o usuário do auth (se existir)
      const { error: userDeleteError } = await supabase.auth.admin.deleteUser(
        adminData.id
      );

      if (userDeleteError) {
        console.error("Error deleting user:", userDeleteError);
        // Continua mesmo se falhar eliminar o usuário
      }
    }

    // 4. Eliminar QR Codes do restaurante
    const { error: qrDeleteError } = await supabase
      .from("qr_codes")
      .delete()
      .eq("restaurant_id", id);

    if (qrDeleteError) {
      console.error("Error deleting QR codes:", qrDeleteError);
    }

    // 5. Eliminar produtos do restaurante
    const { error: productsDeleteError } = await supabase
      .from("products")
      .delete()
      .eq("restaurant_id", id);

    if (productsDeleteError) {
      console.error("Error deleting products:", productsDeleteError);
    }

    // 6. Eliminar categorias do restaurante
    const { error: categoriesDeleteError } = await supabase
      .from("categories")
      .delete()
      .eq("restaurant_id", id);

    if (categoriesDeleteError) {
      console.error("Error deleting categories:", categoriesDeleteError);
    }

    // 7. Finalmente eliminar o restaurante
    const { error } = await supabase
      .from("restaurants")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting restaurant:", error);
      setErrorMessage(`Erro ao eliminar restaurante. Tente novamente.`);
      setTimeout(() => setErrorMessage(null), 5000);
      return;
    }

    loadRestaurants();
  } catch (err) {
    console.error("Delete error:", err);
    setErrorMessage(`Erro ao eliminar restaurante. Tente novamente.`);
    setTimeout(() => setErrorMessage(null), 5000);
  }
}

  // ============================================================
  // 3. FUNCAO PARA ABRIR QR CODE
  // ============================================================
  function openQR(restaurant) {
    setSelectedRestaurant(restaurant);
    setShowQR(true);
  }

  // ============================================================
  // 4. FUNCAO PARA ABRIR RESTAURANTE (MENU PUBLICO)
  // ============================================================
  function openRestaurant(restaurant) {
    // Verificar se o restaurante esta ativo
    if (restaurant.status === "disabled") {
      setErrorMessage(
        `Este restaurante esta bloqueado. O menu nao pode ser exibido no momento.`
      );
      setTimeout(() => setErrorMessage(null), 5000);
      return;
    }

    window.open(`/menu/${restaurant.slug}`, "_blank");
  }

  // ============================================================
  // 5. FUNCAO PARA ABRIR GERENTE
  // ============================================================
  async function openManager(restaurant) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("restaurant_id", restaurant.id)
      .eq("role", "restaurant_admin")
      .maybeSingle();

    if (error) {
      console.error("Error loading manager:", error);
      setErrorMessage("Erro ao carregar dados do gerente.");
      setTimeout(() => setErrorMessage(null), 5000);
      return;
    }

    setManagerData(data);
    setShowManagerModal(true);
  }

  function toggleTheme() {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.body.className = newTheme;
  }

  return (
    <div className="super-dashboard">
      <h1>Menu Virtual QR</h1>

      <header className="dashboard-top">
        <div>
          <p>
            Bom dia, Super Admin:
            <strong> {profile?.full_name || "Administrador"}</strong>
          </p>
        </div>
        <div className="header-actions">
          <button
            className="primary-button"
            onClick={() => setShowCreate(!showCreate)}
          >
            <Plus size={18} />
            Novo Restaurante
          </button>

          <button className="secondary-button" onClick={toggleTheme}>
            {theme === "light" ? "🌙" : "☀️"}
            Alternar tema
          </button>

          <button
            className="danger-button"
            onClick={async () => {
              await supabase.auth.signOut();
              window.location.href = "/login";
            }}
          >
            Sair
          </button>
        </div>
      </header>

      {/* Mensagem de erro */}
      {errorMessage && (
        <div className="error-banner" style={{
          backgroundColor: "#fef2f2",
          color: "#dc2626",
          padding: "0.75rem 1rem",
          borderRadius: "8px",
          marginBottom: "1rem",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          border: "1px solid #fecaca"
        }}>
          <AlertCircle size={18} />
          {errorMessage}
        </div>
      )}

      {showCreate && (
        <section className="create-container">
          <RestaurantCreate
            onCreated={(result) => {
              setCreatedRestaurant(result);
              setShowSuccessModal(true);
              setShowCreate(false);
              loadRestaurants();
            }}
          />
        </section>
      )}

      <section className="stats-grid">
        <div className="stat-card">
          <Store />
          <div>
            <strong>{restaurants.length}</strong>
            <span>Restaurantes</span>
          </div>
        </div>

        <div className="stat-card">
          <CheckCircle />
          <div>
            <strong>
              {restaurants.filter((r) => r.status === "active").length}
            </strong>
            <span>Ativos</span>
          </div>
        </div>

        <div className="stat-card">
          <XCircle />
          <div>
            <strong>
              {restaurants.filter((r) => r.status === "suspended").length}
            </strong>
            <span>Bloqueados</span>
          </div>
        </div>

        <div className="stat-card">
          <Users />
          <div>
            <strong>{restaurants.length}</strong>
            <span>Gerentes</span>
          </div>
        </div>
      </section>

      <section className="restaurant-panel">
        <div className="panel-header">
          <div className="search-box">
            <Search size={18} />
            <input
              placeholder="Pesquisar restaurante..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button className="icon-button" onClick={loadRestaurants}>
            <RefreshCcw size={18} />
          </button>
        </div>

        {loading ? (
          <div className="loading">Carregando restaurantes...</div>
        ) : (
          <div className="restaurant-list">
            {filteredRestaurants.map((restaurant, index) => (
              <div
                key={restaurant.id}
                className={`
                  restaurant-row
                  ${index % 2 === 0 ? "dark-row" : "light-row"}
                `}
              >
                <div className="restaurant-main">
                  {restaurant.logo_url ? (
                    <img src={restaurant.logo_url} alt="logo" />
                  ) : (
                    <div className="logo-empty">
                      <Store />
                    </div>
                  )}

                  <div>
                    <h3>{restaurant.name}</h3>
                    <span>{restaurant.business_type}</span>
                  </div>
                </div>

                <div className="status">
                  {restaurant.status === "active" ? (
                    <span className="active">Ativo</span>
                  ) : (
                    <span className="inactive">Bloqueado</span>
                  )}
                </div>

                <div className="actions">
                  {/* Ver restaurante */}
                  <button
                    title="Ver restaurante"
                    onClick={() => openRestaurant(restaurant)}
                  >
                    <Eye />
                  </button>

                  {/* QR Code */}
                  <button
                    title="QR Code"
                    onClick={() => openQR(restaurant)}
                  >
                    <QrCode />
                  </button>

                  {/* Gerente */}
                  <button
                    title="Gerente"
                    onClick={() => openManager(restaurant)}
                  >
                    <UserRound />
                  </button>

                  {/* Activar/Bloquear */}
                  {restaurant.status === "active" ? (
                    <button
                      title="Bloquear restaurante"
                      onClick={() => toggleStatus(restaurant.id, restaurant.status)}
                    >
                      <PowerOff />
                    </button>
                  ) : (
                    <button
                      title="Activar restaurante"
                      onClick={() => toggleStatus(restaurant.id, restaurant.status)}
                    >
                      <Power />
                    </button>
                  )}

                  {/* Eliminar */}
                  <button
                    className="danger"
                    title="Eliminar restaurante"
                    onClick={() => deleteRestaurant(restaurant.id, restaurant.name)}
                  >
                    <Trash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {showSuccessModal && (
        <RestaurantSuccessModal
          data={createdRestaurant}
          onClose={() => {
            setShowSuccessModal(false);
            setCreatedRestaurant(null);
          }}
        />
      )}

      {showManagerModal && (
        <ManagerModal
          manager={managerData}
          onClose={() => {
            setShowManagerModal(false);
            setManagerData(null);
          }}
        />
      )}

      {showQR && (
        <QrModal
          restaurant={selectedRestaurant}
          onClose={() => {
            setShowQR(false);
            setSelectedRestaurant(null);
          }}
        />
      )}

      <footer className="dashboard-footer">
        © 2026 Menu Virtual QR
        <br />
        Todos os direitos reservados.
        <br />
        Feito com ☕ e codigo por Ednato
        <br />
        Com assistencia do ChatGPT
      </footer>
    </div>
  );
}