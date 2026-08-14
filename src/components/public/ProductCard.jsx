export default function ProductCard({ product }) {
  return (
    <article className="mvqr-product-card">

      <div className="mvqr-product-card__image-wrapper">

        <img
          src={product.image_url}
          alt={product.name}
          className="mvqr-product-card__image"
          loading="lazy"
        />

        {!product.available && (
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
            {Number(product.price || 0).toLocaleString(
              "pt-AO",
              {
                minimumFractionDigits: 2,
              }
            )}{" "}
            Kz
          </strong>

        </div>


        {product.description && (
          <p>
            {product.description}
          </p>
        )}

      </div>

    </article>
  );
}