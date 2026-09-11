import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { useAuthStore } from "../../auth/store/authStore";
import { getEmployee } from "../../hrm/services/employeeService";
import type { AuthUser } from "../../auth/types/auth.types";

interface Product {
  id: number | string;
  companyId: string;
  title: string;
  category: string;
  price: number;
  stock: number;
  rating: number;
  thumbnail: string;
}

interface Cart {
  id: number;
  total: number;
  totalProducts: number;
  totalQuantity: number;
  userId: number;
}

interface CartsResponse {
  carts: Cart[];
}

async function getProducts(): Promise<Product[]> {
  const response = await fetch("http://localhost:3000/products");

  if (!response.ok) {
    throw new Error("Impossible de récupérer le catalogue produits.");
  }

  const data: Product[] = await response.json();
  return data;
}

async function getUserCompanyId(
  user: AuthUser | null,
) {
  if (!user || user.role === "admin" || user.role === "super_manager") {
    return undefined;
  }

  if (user.companyId) {
    return String(user.companyId);
  }

  if (user.employeeId && !Number.isNaN(Number(user.employeeId))) {
    const employee = await getEmployee(Number(user.employeeId));
    return employee.companyId ? String(employee.companyId) : undefined;
  }

  return undefined;
}

async function getCarts(): Promise<Cart[]> {
  const response = await fetch("https://dummyjson.com/carts?limit=100");

  if (!response.ok) {
    throw new Error("Impossible de récupérer les commandes.");
  }

  const data: CartsResponse = await response.json();
  return data.carts;
}

export default function ProductsPage() {
  const { user } = useAuthStore();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [view, setView] = useState<"products" | "orders">("products");
  const productsQuery = useQuery({
    queryKey: ["products", user?.id, user?.companyId, user?.employeeId],
    queryFn: async () => {
      const allProducts = await getProducts();
      const companyId = await getUserCompanyId(user);

      return companyId
        ? allProducts.filter((product) => product.companyId === companyId)
        : allProducts;
    },
    staleTime: 5 * 60 * 1000,
  });
  const cartsQuery = useQuery({
    queryKey: ["carts"],
    queryFn: getCarts,
    staleTime: 5 * 60 * 1000,
  });

  const products = productsQuery.data ?? [];
  const carts = cartsQuery.data ?? [];
  const categories = [...new Set(products.map((product) => product.category))].sort();
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "all" || product.category === category;
    return matchesSearch && matchesCategory;
  });
  const lowStock = products.filter((product) => product.stock > 0 && product.stock < 10).length;
  const inventoryUnits = products.reduce((sum, product) => sum + product.stock, 0);
  const orderTotal = carts.reduce((sum, cart) => sum + cart.total, 0);

  if (productsQuery.isLoading || cartsQuery.isLoading) {
    return <div className="erp-page"><div className="dashboard-card erp-feedback">Chargement du catalogue produits...</div></div>;
  }

  if (productsQuery.isError) {
    return (
      <div className="erp-page">
        <div className="dashboard-card erp-feedback">
          <strong>Impossible de charger le catalogue</strong>
          <p>{(productsQuery.error ?? cartsQuery.error)?.message}</p>
          <button className="primary-button" onClick={() => { void productsQuery.refetch(); void cartsQuery.refetch(); }}>Réessayer</button>
        </div>
      </div>
    );
  }

  return (
    <div className="erp-page">
      <div className="dashboard-heading">
        <div>
          <h1>Produits</h1>
          <p>Catalogue et suivi des stocks ERP.</p>
        </div>
        <button className="primary-button" onClick={() => productsQuery.refetch()}>↻ Actualiser</button>
      </div>

      <div className="stats-grid">
        <article className="stat-card"><span className="stat-title">Produits</span><strong className="stat-value">{products.length}</strong><span className="stat-subtitle">dans le catalogue</span></article>
        <article className="stat-card"><span className="stat-title">Stock total</span><strong className="stat-value">{inventoryUnits}</strong><span className="stat-subtitle">unités disponibles</span></article>
        <article className="stat-card"><span className="stat-title">Stock faible</span><strong className="stat-value warning-text">{lowStock}</strong><span className="stat-subtitle">moins de 10 unités</span></article>
        <article className="stat-card"><span className="stat-title">Commandes</span><strong className="stat-value">{carts.length}</strong><span className="stat-subtitle">{orderTotal.toFixed(2)} $ au total</span></article>
      </div>

      <section className="dashboard-card erp-catalogue">
        <div className="erp-tabs" role="tablist" aria-label="Vues ERP">
          <button className={view === "products" ? "erp-tab active" : "erp-tab"} onClick={() => setView("products")} role="tab" aria-selected={view === "products"}>Produits</button>
          <button className={view === "orders" ? "erp-tab active" : "erp-tab"} onClick={() => setView("orders")} role="tab" aria-selected={view === "orders"}>Commandes ({carts.length})</button>
        </div>

        {view === "orders" ? (
          <div className="orders-list">
            {carts.map((cart) => (
              <div className="order-row" key={cart.id}><div><strong>Commande #{cart.id}</strong><span>Client #{cart.userId} · {cart.totalProducts} produit(s)</span></div><strong>{cart.total.toFixed(2)} $</strong><span className="stock">{cart.totalQuantity} unité(s)</span></div>
            ))}
          </div>
        ) : (
          <>
        <div className="erp-toolbar">
          <input aria-label="Rechercher un produit" placeholder="Rechercher un produit..." value={search} onChange={(event) => setSearch(event.target.value)} />
          <select aria-label="Filtrer par catégorie" value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="all">Toutes les catégories</option>
            {categories.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="erp-feedback"><strong>Aucun produit trouvé</strong><p>Modifiez votre recherche ou votre filtre.</p></div>
        ) : (
          <div className="product-grid">
            {filteredProducts.map((product) => (
              <article className="product-card" key={product.id}>
                <img src={product.thumbnail} alt="" />
                <div className="product-card-content">
                  <span className="product-category">{product.category}</span>
                  <h3>{product.title}</h3>
                  <div className="product-meta"><strong>{product.price.toFixed(2)} $</strong><span>★ {product.rating.toFixed(1)}</span></div>
                  <span className={product.stock === 0 ? "stock stock-empty" : product.stock < 10 ? "stock stock-low" : "stock"}>
                    {product.stock === 0 ? "Rupture" : `${product.stock} en stock`}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
          </>
        )}
      </section>
    </div>
  );
}