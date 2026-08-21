import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import {
    getPromotions,
    createPromotion,
    updatePromotion,
    deletePromotion,
    togglePromotionStatus,
    getPromotionTypeLabel,
    isPromotionActive,
    getPromotionTimeLeft
} from '../../services/promotionService';
import { getProducts } from '../../services/productService';
import {
    Plus,
    Edit,
    Trash2,
    CheckCircle,
    XCircle,
    Clock,
    Calendar,
    Percent,
    Tag,
    Sparkles,
    Eye,
    RefreshCw,
    AlertCircle,
    Package,
    FolderOpen
} from 'lucide-react';
import Card from './ui/Card';
import Input from './ui/Input';
import Select from './ui/Select';
import Button from './ui/Button';

export default function AdminPromotions() {
    const { profile } = useAuth();
    const restaurantId = profile?.restaurant_id;

    const [promotions, setPromotions] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingPromotion, setEditingPromotion] = useState(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [productLoading, setProductLoading] = useState(true);

    const [form, setForm] = useState({
        product_id: '',
        name: '',
        description: '',
        type: 'promotion',
        original_price: '',
        discounted_price: '',
        start_date: new Date().toISOString().slice(0, 16),
        end_date: '',
        featured: false,
    });

    const typeOptions = [
        { value: 'promotion', label: '📢 Promoção' },
        { value: 'offer_day', label: '🌅 Oferta do Dia' },
        { value: 'flash_sale', label: '⚡ Flash Sale' },
    ];

    useEffect(() => {
        if (restaurantId) {
            loadData();
            loadProducts();
        }
    }, [restaurantId]);

    async function loadData() {
        try {
            setLoading(true);
            const data = await getPromotions(restaurantId);
            setPromotions(data || []);
        } catch (err) {
            console.error('Erro ao carregar promoções:', err);
            setError('Não foi possível carregar as promoções.');
        } finally {
            setLoading(false);
        }
    }

    async function loadProducts() {
        try {
            setProductLoading(true);
            const data = await getProducts(restaurantId);
            setProducts(data || []);
        } catch (err) {
            console.error('Erro ao carregar produtos:', err);
            setError('Não foi possível carregar os produtos. Crie um produto primeiro.');
        } finally {
            setProductLoading(false);
        }
    }

    function handleChange(e) {
        const { name, value, type, checked } = e.target;
        
        // 🔥 Se selecionar um produto, preencher automaticamente o nome e preços
        if (name === 'product_id') {
            const selectedProduct = products.find(p => p.id === value);
            if (selectedProduct) {
                setForm({
                    ...form,
                    product_id: value,
                    name: selectedProduct.name,
                    original_price: selectedProduct.price,
                    discounted_price: selectedProduct.price,
                });
                return;
            }
        }

        setForm({
            ...form,
            [name]: type === 'checkbox' ? checked : value
        });
        if (name === 'original_price' || name === 'discounted_price') {
            setError(null);
        }
    }

    function resetForm() {
        setForm({
            product_id: '',
            name: '',
            description: '',
            type: 'promotion',
            original_price: '',
            discounted_price: '',
            start_date: new Date().toISOString().slice(0, 16),
            end_date: '',
            featured: false,
        });
        setEditingPromotion(null);
        setError(null);
    }

    function openCreateModal() {
        if (products.length === 0) {
            setError('⚠️ Crie um produto primeiro antes de criar uma promoção!');
            setTimeout(() => setError(null), 5000);
            return;
        }
        resetForm();
        setShowModal(true);
    }

    function openEditModal(promotion) {
        setEditingPromotion(promotion);
        setForm({
            product_id: promotion.product_id || '',
            name: promotion.name,
            description: promotion.description || '',
            type: promotion.type,
            original_price: promotion.original_price || '',
            discounted_price: promotion.discounted_price || '',
            start_date: promotion.start_date.slice(0, 16),
            end_date: promotion.end_date ? promotion.end_date.slice(0, 16) : '',
            featured: promotion.featured || false,
        });
        setShowModal(true);
    }

    async function handleSubmit(e) {
        e.preventDefault();

        // Validações
        if (!form.product_id) {
            setError('Selecione um produto para a promoção.');
            return;
        }

        if (!form.name.trim()) {
            setError('O nome da promoção é obrigatório.');
            return;
        }

        if (!form.discounted_price || parseFloat(form.discounted_price) <= 0) {
            setError('O preço com desconto é obrigatório e deve ser maior que 0.');
            return;
        }

        if (form.original_price && parseFloat(form.original_price) <= parseFloat(form.discounted_price)) {
            setError('O preço original deve ser maior que o preço com desconto.');
            return;
        }

        if (!form.start_date) {
            setError('A data de início é obrigatória.');
            return;
        }

        try {
            setSaving(true);
            setError(null);

            const payload = {
                restaurant_id: restaurantId,
                product_id: form.product_id,
                name: form.name.trim(),
                description: form.description.trim() || null,
                type: form.type,
                original_price: form.original_price ? parseFloat(form.original_price) : null,
                discounted_price: parseFloat(form.discounted_price),
                start_date: new Date(form.start_date).toISOString(),
                end_date: form.end_date ? new Date(form.end_date).toISOString() : null,
                featured: form.featured,
                is_active: true,
            };

            if (editingPromotion) {
                await updatePromotion(editingPromotion.id, payload);
            } else {
                await createPromotion(payload);
            }

            setShowModal(false);
            resetForm();
            await loadData();
        } catch (err) {
            console.error('Erro ao guardar promoção:', err);
            setError('Erro ao guardar promoção. Tente novamente.');
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(id, name) {
        if (!confirm(`Tem certeza que deseja eliminar a promoção "${name}"?`)) return;
        
        try {
            await deletePromotion(id);
            await loadData();
        } catch (err) {
            console.error('Erro ao eliminar promoção:', err);
            setError('Erro ao eliminar promoção.');
        }
    }

    async function handleToggleStatus(id, currentStatus) {
        try {
            await togglePromotionStatus(id, !currentStatus);
            await loadData();
        } catch (err) {
            console.error('Erro ao alterar status:', err);
            setError('Erro ao alterar status da promoção.');
        }
    }

    // 🔥 Função para encontrar o produto pelo ID
    function getProductName(productId) {
        const product = products.find(p => p.id === productId);
        return product?.name || 'Produto não encontrado';
    }

    function getProductCategory(productId) {
        const product = products.find(p => p.id === productId);
        return product?.category_name || '';
    }

    // Renderizar
    if (loading) {
        return (
            <Card title="📢 Promoções e Ofertas">
                <p style={{ color: '#64748b' }}>Carregando promoções...</p>
            </Card>
        );
    }

    return (
        <Card title={<span><Tag size={18} style={{ marginRight: '0.5rem' }} /> Promoções e Ofertas</span>}>
            {/* 🔥 AVISO: Criar produto primeiro */}
            {products.length === 0 && (
                <div className="warning-banner">
                    <AlertCircle size={20} />
                    <div>
                        <strong>Nenhum produto encontrado!</strong>
                        <p>Você precisa criar produtos antes de criar promoções.</p>
                        <Button 
                            variant="primary" 
                            size="sm"
                            onClick={() => window.location.href = '/admin/products'}
                        >
                            <Package size={14} />
                            Ir para Produtos
                        </Button>
                    </div>
                </div>
            )}

            <div className="promotions-header">
                <div>
                    <p style={{ color: '#64748b', marginBottom: '0.25rem' }}>
                        Crie promoções, ofertas do dia e flash sales para produtos existentes.
                    </p>
                    <p style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
                        {products.length} {products.length === 1 ? 'produto disponível' : 'produtos disponíveis'} para promover
                    </p>
                </div>
                <Button onClick={openCreateModal} className="primary-button" disabled={products.length === 0}>
                    <Plus size={18} />
                    Nova Promoção
                </Button>
            </div>

            {error && (
                <div className="error-banner">
                    <AlertCircle size={18} />
                    {error}
                </div>
            )}

            {promotions.length === 0 ? (
                <div className="empty-state">
                    <Tag size={48} />
                    <h3>Nenhuma promoção criada</h3>
                    <p>
                        {products.length === 0 
                            ? 'Crie produtos primeiro para depois criar promoções.'
                            : 'Clique em "Nova Promoção" para criar a sua primeira oferta.'
                        }
                    </p>
                </div>
            ) : (
                <div className="promotions-grid">
                    {promotions.map((promotion) => {
                        const isActive = isPromotionActive(promotion);
                        const timeLeft = getPromotionTimeLeft(promotion);
                        const productName = getProductName(promotion.product_id);

                        return (
                            <div key={promotion.id} className={`promotion-card ${isActive ? 'active' : 'inactive'}`}>
                                <div className="promotion-header-card">
                                    <div className="promotion-type-badge">
                                        {promotion.type === 'offer_day' && '🌅 Oferta do Dia'}
                                        {promotion.type === 'flash_sale' && '⚡ Flash Sale'}
                                        {promotion.type === 'promotion' && '🏷️ Promoção'}
                                    </div>
                                    <div className="promotion-status">
                                        {isActive ? (
                                            <CheckCircle size={16} color="#22c55e" />
                                        ) : (
                                            <XCircle size={16} color="#ef4444" />
                                        )}
                                        <span>{isActive ? 'Ativa' : 'Inativa'}</span>
                                    </div>
                                </div>

                                <div className="promotion-body">
                                    <h3>{promotion.name}</h3>
                                    <p className="promotion-description">{promotion.description || 'Sem descrição'}</p>

                                    {/* 🔥 Produto associado */}
                                    <div className="promotion-product-info">
                                        <Package size={14} />
                                        <span>{productName}</span>
                                    </div>

                                    <div className="promotion-prices">
                                        {promotion.original_price && (
                                            <span className="original-price">
                                                {promotion.original_price} Kz
                                            </span>
                                        )}
                                        <span className="discounted-price">
                                            {promotion.discounted_price} Kz
                                        </span>
                                        {promotion.discount_percentage > 0 && (
                                            <span className="discount-badge">
                                                -{promotion.discount_percentage}%
                                            </span>
                                        )}
                                    </div>

                                    <div className="promotion-dates">
                                        <Calendar size={14} />
                                        <span>
                                            {new Date(promotion.start_date).toLocaleDateString('pt-PT')}
                                            {promotion.end_date && ` → ${new Date(promotion.end_date).toLocaleDateString('pt-PT')}`}
                                        </span>
                                        {timeLeft && (
                                            <span className="time-left">
                                                <Clock size={14} />
                                                {timeLeft}
                                            </span>
                                        )}
                                    </div>

                                    <div className="promotion-actions">
                                        <Button 
                                            variant="outline" 
                                            size="sm"
                                            onClick={() => openEditModal(promotion)}
                                        >
                                            <Edit size={14} />
                                            Editar
                                        </Button>
                                        <Button 
                                            variant={isActive ? 'warning' : 'success'}
                                            size="sm"
                                            onClick={() => handleToggleStatus(promotion.id, isActive)}
                                        >
                                            {isActive ? 'Desativar' : 'Ativar'}
                                        </Button>
                                        <Button 
                                            variant="danger" 
                                            size="sm"
                                            onClick={() => handleDelete(promotion.id, promotion.name)}
                                        >
                                            <Trash2 size={14} />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>{editingPromotion ? 'Editar Promoção' : 'Nova Promoção'}</h2>
                        
                        {/* 🔥 AVISO: Selecionar produto primeiro */}
                        <div className="modal-hint">
                            <Package size={16} />
                            <span>Selecione o produto que deseja promover</span>
                        </div>

                        <form onSubmit={handleSubmit}>
                            {/* 🔥 PASSO 1: Selecionar Produto */}
                            <Select
                                label="Produto *"
                                name="product_id"
                                value={form.product_id}
                                onChange={handleChange}
                                options={[
                                    { value: '', label: 'Selecione um produto...' },
                                    ...products.map(p => ({ 
                                        value: p.id, 
                                        label: `${p.name} (${p.category_name || 'Sem categoria'})` 
                                    }))
                                ]}
                                required
                            />

                            {/* 🔥 PASSO 2: Nome da Promoção (preenchido automaticamente) */}
                            <Input
                                label="Nome da Promoção *"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Ex: 20% Desconto em Pizzas"
                                required
                            />

                            <Input
                                label="Descrição"
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Descrição da promoção..."
                                as="textarea"
                                rows={2}
                            />

                            <Select
                                label="Tipo de Promoção"
                                name="type"
                                value={form.type}
                                onChange={handleChange}
                                options={typeOptions}
                            />

                            {/* 🔥 PASSO 3: Preços */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <Input
                                    label="Preço Original"
                                    name="original_price"
                                    type="number"
                                    step="0.01"
                                    value={form.original_price}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                />
                                <Input
                                    label="Preço com Desconto *"
                                    name="discounted_price"
                                    type="number"
                                    step="0.01"
                                    value={form.discounted_price}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                    required
                                />
                            </div>

                            {/* 🔥 PASSO 4: Datas */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <Input
                                    label="Data de Início *"
                                    name="start_date"
                                    type="datetime-local"
                                    value={form.start_date}
                                    onChange={handleChange}
                                    required
                                />
                                <Input
                                    label="Data de Fim"
                                    name="end_date"
                                    type="datetime-local"
                                    value={form.end_date}
                                    onChange={handleChange}
                                />
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        name="featured"
                                        checked={form.featured}
                                        onChange={handleChange}
                                    />
                                    <span style={{ fontSize: '0.875rem' }}>Destacar promoção</span>
                                </label>
                            </div>

                            {error && (
                                <div className="error-text">{error}</div>
                            )}

                            <div className="modal-actions">
                                <Button 
                                    type="button" 
                                    variant="outline"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancelar
                                </Button>
                                <Button type="submit" disabled={saving}>
                                    {saving ? 'Guardando...' : editingPromotion ? 'Atualizar' : 'Criar'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style jsx>{`
                .warning-banner {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 1rem 1.5rem;
                    background: #fef3c7;
                    border: 1px solid #fcd34d;
                    border-radius: 12px;
                    margin-bottom: 1.5rem;
                }

                .warning-banner div {
                    flex: 1;
                }

                .warning-banner strong {
                    color: #92400e;
                    display: block;
                }

                .warning-banner p {
                    color: #92400e;
                    margin: 0.25rem 0;
                    font-size: 0.875rem;
                }

                .promotions-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 1rem;
                    margin-bottom: 1.5rem;
                }

                .promotions-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    gap: 1.5rem;
                }

                .promotion-card {
                    background: white;
                    border-radius: 12px;
                    border: 1px solid #e2e8f0;
                    overflow: hidden;
                    transition: all 0.3s;
                }

                .promotion-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                }

                .promotion-card.inactive {
                    opacity: 0.6;
                }

                .promotion-header-card {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0.75rem 1rem;
                    background: #f8fafc;
                    border-bottom: 1px solid #e2e8f0;
                }

                .promotion-type-badge {
                    font-size: 0.75rem;
                    font-weight: 500;
                    color: #8B4513;
                }

                .promotion-status {
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;
                    font-size: 0.75rem;
                }

                .promotion-body {
                    padding: 1rem;
                }

                .promotion-body h3 {
                    font-size: 1rem;
                    font-weight: 600;
                    margin: 0 0 0.25rem 0;
                }

                .promotion-description {
                    font-size: 0.85rem;
                    color: #64748b;
                    margin-bottom: 0.5rem;
                }

                .promotion-product-info {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.8rem;
                    color: #8B4513;
                    background: #fef3e8;
                    padding: 0.25rem 0.75rem;
                    border-radius: 6px;
                    margin-bottom: 0.5rem;
                }

                .promotion-prices {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    margin-bottom: 0.5rem;
                }

                .original-price {
                    font-size: 0.85rem;
                    color: #94a3b8;
                    text-decoration: line-through;
                }

                .discounted-price {
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: #22c55e;
                }

                .discount-badge {
                    background: #ef4444;
                    color: white;
                    padding: 0.1rem 0.5rem;
                    border-radius: 12px;
                    font-size: 0.7rem;
                    font-weight: 600;
                }

                .promotion-dates {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.75rem;
                    color: #94a3b8;
                    flex-wrap: wrap;
                }

                .time-left {
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;
                    color: #8B4513;
                    font-weight: 500;
                }

                .promotion-actions {
                    display: flex;
                    gap: 0.5rem;
                    margin-top: 0.75rem;
                    flex-wrap: wrap;
                }

                .empty-state {
                    text-align: center;
                    padding: 3rem 2rem;
                    color: #94a3b8;
                }

                .empty-state h3 {
                    color: #0f172a;
                    margin: 0.5rem 0;
                }

                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    padding: 1rem;
                }

                .modal-content {
                    background: white;
                    border-radius: 12px;
                    padding: 2rem;
                    max-width: 600px;
                    width: 100%;
                    max-height: 90vh;
                    overflow-y: auto;
                }

                .modal-content h2 {
                    margin-bottom: 1.5rem;
                }

                .modal-hint {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.5rem 0.75rem;
                    background: #f0fdf4;
                    border-radius: 8px;
                    border: 1px solid #86efac;
                    color: #166534;
                    font-size: 0.875rem;
                    margin-bottom: 1.5rem;
                }

                .modal-actions {
                    display: flex;
                    gap: 0.5rem;
                    justify-content: flex-end;
                    margin-top: 1.5rem;
                }

                .error-text {
                    color: #ef4444;
                    font-size: 0.875rem;
                    padding: 0.5rem;
                    background: #fef2f2;
                    border-radius: 8px;
                    border: 1px solid #fecaca;
                }

                .error-banner {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.75rem;
                    background: #fef2f2;
                    color: #dc2626;
                    border-radius: 8px;
                    border: 1px solid #fecaca;
                    margin-bottom: 1rem;
                }

                @media (max-width: 768px) {
                    .promotions-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </Card>
    );
}