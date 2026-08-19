import { useTheme } from '../../engine/ThemeProvider';
import ProductCard from "./ProductCard";
import EmptyMenu from "./EmptyMenu";

export default function ProductGrid({
  products = [],
}) {
  const { theme } = useTheme();

  if (!products.length) {
    return <EmptyMenu />;
  }

  const variant =
    theme?.layout?.menu?.variant ||
    "classic_grid";

  const featured =
    theme?.layout?.featured?.enabled === true;

  const featuredVariant =
    theme?.layout?.featured?.variant ||
    "large_cards";


  let orderedProducts = [...products];


  /*
   * FEATURED FIRST
   *
   * Caso exista um campo `featured`
   * no produto, ele sobe para o topo.
   */

  if (
    variant === "featured_first" ||
    featured
  ) {
    orderedProducts.sort(
      (a, b) =>
        Number(Boolean(b.featured)) -
        Number(Boolean(a.featured))
    );
  }


  return (
    <section
      id="menu"
      className={`
        mvqr-product-grid
        mvqr-product-grid--${variant}

        ${
          featured
            ? "mvqr-product-grid--has-featured"
            : ""
        }

        ${
          featured
            ? `mvqr-product-grid--featured-${featuredVariant}`
            : ""
        }
      `}
    >
      {orderedProducts.map(
        (product, index) => {

          const isFeatured =
            Boolean(product.featured) ||
            (
              featured &&
              index === 0
            );

          return (
            <ProductCard
              key={product.id}
              product={product}
              featured={isFeatured}
            />
          );
        }
      )}
    </section>
  );
}