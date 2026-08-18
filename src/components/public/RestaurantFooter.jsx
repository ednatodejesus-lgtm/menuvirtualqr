import { useTheme } from "../../contexts/ThemeContext";
import {
  MapPin,
  Phone,
  Globe,
  MessageCircle,
  ArrowUpRight,
} from "lucide-react";

export default function RestaurantFooter({
  restaurant,
}) {
  const { theme } = useTheme();

  const year =
    new Date().getFullYear();

  const variant =
    theme?.layout?.footer?.variant ||
    "elegant";

  const social =
    restaurant?.social_links || {};


  const hasSocial =
    social.instagram ||
    social.facebook ||
    social.website ||
    social.whatsapp;


  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }


  /*
   * -----------------------------------------
   * DARK
   * -----------------------------------------
   */

  if (variant === "dark") {
    return (
      <footer
        className="
          mvqr-footer
          mvqr-footer--dark
        "
      >
        <div className="mvqr-footer__content">

          <div className="mvqr-footer__identity">

            <h2>
              {restaurant?.name}
            </h2>

            {restaurant?.description && (
              <p>
                {restaurant.description}
              </p>
            )}

          </div>


          <div className="mvqr-footer__contact">

            {restaurant?.address && (
              <div>
                <MapPin size={17} />
                <span>
                  {restaurant.address}
                </span>
              </div>
            )}

            {restaurant?.contact_phone && (
              <div>
                <Phone size={17} />
                <span>
                  {restaurant.contact_phone}
                </span>
              </div>
            )}

          </div>


          <FooterSocials
            social={social}
            visible={hasSocial}
          />

        </div>

        <FooterBottom
          restaurant={restaurant}
          year={year}
          onTop={scrollToTop}
        />
      </footer>
    );
  }


  /*
   * -----------------------------------------
   * MINIMAL
   * -----------------------------------------
   */

  if (variant === "minimal") {
    return (
      <footer
        className="
          mvqr-footer
          mvqr-footer--minimal
        "
      >
        <div className="mvqr-footer__content">

          <h2>
            {restaurant?.name}
          </h2>

          <span>
            © {year}
          </span>

        </div>
      </footer>
    );
  }


  /*
   * -----------------------------------------
   * SPLIT
   * -----------------------------------------
   */

  if (variant === "split") {
    return (
      <footer
        className="
          mvqr-footer
          mvqr-footer--split
        "
      >
        <div className="mvqr-footer__split-left">

          <span className="mvqr-footer__eyebrow">
            Visit us
          </span>

          <h2>
            {restaurant?.name}
          </h2>

          {restaurant?.description && (
            <p>
              {restaurant.description}
            </p>
          )}

        </div>


        <div className="mvqr-footer__split-right">

          {restaurant?.address && (
            <div>
              <MapPin size={17} />
              <span>
                {restaurant.address}
              </span>
            </div>
          )}

          {restaurant?.contact_phone && (
            <div>
              <Phone size={17} />
              <span>
                {restaurant.contact_phone}
              </span>
            </div>
          )}

          <FooterSocials
            social={social}
            visible={hasSocial}
          />

        </div>


        <FooterBottom
          restaurant={restaurant}
          year={year}
          onTop={scrollToTop}
        />

      </footer>
    );
  }


  /*
   * -----------------------------------------
   * ELEGANT
   * -----------------------------------------
   */

  return (
    <footer
      className="
        mvqr-footer
        mvqr-footer--elegant
      "
    >
      <div className="mvqr-footer__content">

        <span className="mvqr-footer__eyebrow">
          {restaurant?.business_type || "Restaurant"}
        </span>

        <h2>
          {restaurant?.name}
        </h2>

        {restaurant?.description && (
          <p>
            {restaurant.description}
          </p>
        )}


        <div className="mvqr-footer__details">

          {restaurant?.address && (
            <div>
              <MapPin size={17} />
              <span>
                {restaurant.address}
              </span>
            </div>
          )}

          {restaurant?.contact_phone && (
            <div>
              <Phone size={17} />
              <span>
                {restaurant.contact_phone}
              </span>
            </div>
          )}

        </div>


        <FooterSocials
          social={social}
          visible={hasSocial}
        />

      </div>


      <FooterBottom
        restaurant={restaurant}
        year={year}
        onTop={scrollToTop}
      />

    </footer>
  );
}


/*
 * =========================================
 * SOCIALS
 * =========================================
 */

function FooterSocials({
  social,
  visible,
}) {
  if (!visible) {
    return null;
  }

  return (
    <div className="mvqr-footer__socials">

      {social.instagram && (
        <a
          href={social.instagram}
          target="_blank"
          rel="noreferrer"
          aria-label="Instagram"
        >
          <Instagram size={18} />
        </a>
      )}

      {social.facebook && (
        <a
          href={social.facebook}
          target="_blank"
          rel="noreferrer"
          aria-label="Facebook"
        >
          <Facebook size={18} />
        </a>
      )}

      {social.website && (
        <a
          href={social.website}
          target="_blank"
          rel="noreferrer"
          aria-label="Website"
        >
          <Globe size={18} />
        </a>
      )}

      {social.whatsapp && (
        <a
          href={`https://wa.me/${String(
            social.whatsapp
          ).replace(/\D/g, "")}`}
          target="_blank"
          rel="noreferrer"
          aria-label="WhatsApp"
        >
          <MessageCircle size={18} />
        </a>
      )}

    </div>
  );
}


/*
 * =========================================
 * FOOTER BOTTOM
 * =========================================
 */

function FooterBottom({
  restaurant,
  year,
  onTop,
}) {
  return (
    <div className="mvqr-footer__bottom">

      <small>
        © {year} {restaurant?.name}
      </small>

      <small className="mvqr-footer__brand">
        Menu Virtual QR
      </small>

      <button
        type="button"
        onClick={onTop}
        className="mvqr-footer__top"
        aria-label="Voltar ao topo"
      >
        <ArrowUpRight size={16} />
      </button>

    </div>
  );
}