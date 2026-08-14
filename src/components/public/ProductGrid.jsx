import ProductCard from "./ProductCard";
import EmptyMenu from "./EmptyMenu";

export default function ProductGrid({
  products = [],
}) {
  if (!products.length) {
    return <EmptyMenu />;
  }

  return (
    <section
      id="menu"
      className="mvqr-product-grid"
    >
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
        />
      ))}
    </section>
  );
}