import { useTheme } from "../../contexts/ThemeContext";
import { ShoppingBag } from "lucide-react";

export default function ProductCard({
  product,
  featured = false,
}) {
  const { theme } = useTheme();

  const variant =
    theme?.layout?.menu?.card_variant ||
    "elevated";


  const price = Number(
    product.price || 0
  ).toLocaleString(
    "pt-AO",
    {
      minimumFractionDigits: 2,
    }
  );


  const unavailable =
    product.available === false;


  return (
    <article
      className={`
        mvqr-product-card
        mvqr-product-card--${variant}

        ${featured
          ? "mvqr-product-card--featured"
          : ""}

        ${unavailable
          ? "is-unavailable"
          : ""}
      `}
    >

      <div className="mvqr-product-card__image-wrapper">

        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="mvqr-product-card__image"
            loading="lazy"
          />
        ) : (
          <div className="mvqr-product-card__image-placeholder">
            <ShoppingBag size={28} />
          </div>
        )}

        {featured && (
          <span className="mvqr-product-card__featured">
            Destaque
          </span>
        )}

        {unavailable && (
          <span className="mvqr-product-card__unavailable">
            Indisponível
          </span>
        )}

      </div>


      <div className="mvqr-product-card__content">

        <div className="mvqr-product-card__header">

          <h3>
            {product.name}
          </h3>

          <strong>
            {price} Kz
          </strong>

        </div>


        {product.description && (
          <p className="mvqr-product-card__description">
            {product.description}
          </p>
        )}

      </div>

    </article>
  );
}