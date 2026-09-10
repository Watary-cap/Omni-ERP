import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

interface Product {
  id: number;
  title: string;
  category: string;
  price: number;
  stock: number;
  rating: number;
  thumbnail: string;
}

interface ProductsResponse {
  products: Product[];
}

async function getProducts(): Promise<Product[]> {
  const response = await fetch("https://dummyjson.com/products?limit=100");

  if (!response.ok) {
    throw new Error("Impossible de récupérer le catalogue produits.");
  }

  const data: ProductsResponse = await response.json();
  return data.products;
}

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const productsQuery = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
    staleTime: 5 * 60 * 1000,
  });

  const products = productsQuery.data ?? [];
  const categories = [...new Set(products.map((product) => product.category))].sort();
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "all" || product.category === category;
    return matchesSearch && matchesCategory;
  });
  const lowStock = products.filter((product) => product.stock > 0 && product.stock < 10).length;
  const outOfStock = products.filter((product) => product.stock === 0).length;

  if (productsQuery.isLoading) {
    return <div className="erp-page"><div className="dashboard-card erp-feedback">Chargement du catalogue produits...</div></div>;
  }

  if (productsQuery.isError) {
    return (
      <div className="erp-page">
        <div className="dashboard-card erp-feedback">
          <strong>Impossible de charger le catalogue</strong>
          <p>{productsQuery.error.message}</p>
          <button className="primary-button" onClick={() => productsQuery.refetch()}>Réessayer</button>
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
        <article className="stat-card"><span className="stat-title">Valeur moyenne</span><strong className="stat-value">{(products.reduce((sum, product) => sum + product.price, 0) / Math.max(products.length, 1)).toFixed(2)} $</strong><span className="stat-subtitle">prix moyen</span></article>
        <article className="stat-card"><span className="stat-title">Stock faible</span><strong className="stat-value warning-text">{lowStock}</strong><span className="stat-subtitle">moins de 10 unités</span></article>
        <article className="stat-card"><span className="stat-title">Ruptures</span><strong className="stat-value danger-text">{outOfStock}</strong><span className="stat-subtitle">à réapprovisionner</span></article>
      </div>

      <section className="dashboard-card erp-catalogue">
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
      </section>
    </div>
  );
}