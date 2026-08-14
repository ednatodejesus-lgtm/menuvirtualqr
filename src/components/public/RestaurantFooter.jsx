export default function RestaurantFooter({
  restaurant,
}) {
  const year = new Date().getFullYear();

  return (
    <footer className="mvqr-footer">

      <div className="mvqr-footer__content">

        <h2>
          {restaurant?.name}
        </h2>

        {restaurant?.address && (
          <p>
            {restaurant.address}
          </p>
        )}

        {restaurant?.contact_phone && (
          <p>
            {restaurant.contact_phone}
          </p>
        )}

        <small>
          © {year} {restaurant?.name}
        </small>

        <small className="mvqr-footer__brand">
          Menu Virtual QR
        </small>

      </div>

    </footer>
  );
}