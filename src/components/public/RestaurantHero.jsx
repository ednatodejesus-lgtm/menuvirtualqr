import { useTheme } from "../../contexts/ThemeContext";

export default function RestaurantHero({ restaurant }) {
  const { theme } = useTheme();

  const hero = theme?.hero || {};

  const {
    title,
    subtitle,
    ctaText,
    secondaryCta,
    imageUrl,
    imageTreatment,
    overlayStrength,
    variant,
    height,
    alignment,
  } = hero;

  const restaurantName =
    restaurant?.name || "Restaurante";

  const finalTitle =
    title || restaurantName;

  const finalSubtitle =
    subtitle ||
    restaurant?.description ||
    "";

  const heroClass = [
    "mvqr-hero",
    `mvqr-hero--${variant}`,
    `mvqr-hero--height-${height}`,
    `mvqr-hero--align-${alignment}`,
    `mvqr-hero--image-${imageTreatment}`,
  ].join(" ");

  const backgroundStyle = imageUrl
    ? {
        backgroundImage: `
          linear-gradient(
            to bottom,
            rgba(0,0,0,0.15),
            rgba(0,0,0,${overlayStrength})
          ),
          url("${imageUrl}")
        `,
      }
    : {};

  return (
    <section
      className={heroClass}
      style={backgroundStyle}
      aria-label={`Apresentação de ${restaurantName}`}
    >

      <div className="mvqr-hero__overlay" />

      <div className="mvqr-hero__inner">

        <div className="mvqr-hero__content">

          <span className="mvqr-hero__eyebrow">
            {restaurant?.business_type || "Experiência"}
          </span>

          <h1 className="mvqr-hero__title">
            {finalTitle}
          </h1>

          {finalSubtitle && (
            <p className="mvqr-hero__subtitle">
              {finalSubtitle}
            </p>
          )}

          {(ctaText || secondaryCta) && (
            <div className="mvqr-hero__actions">

              {ctaText && (
                <a
                  href="#menu"
                  className="mvqr-button mvqr-button--primary"
                >
                  {ctaText}
                </a>
              )}

              {secondaryCta && (
                <a
                  href="#menu"
                  className="mvqr-button mvqr-button--secondary"
                >
                  {secondaryCta}
                </a>
              )}

            </div>
          )}

        </div>

      </div>

      <div className="mvqr-hero__scroll-indicator">
        <span />
      </div>

    </section>
  );
}