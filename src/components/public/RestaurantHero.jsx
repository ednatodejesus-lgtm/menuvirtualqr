import { useTheme } from "../../contexts/ThemeContext";

export default function RestaurantHero({ restaurant }) {
  const { theme } = useTheme();

  const hero = theme?.hero_section || {};

  const title =
    hero.headline ||
    restaurant?.name ||
    "Bem-vindo";

  const subtitle =
    hero.subheadline ||
    restaurant?.description ||
    "";

  const backgroundImage =
    hero.background_image ||
    "";

  const ctaText =
    hero.cta_text ||
    "Ver Menu";

  const ctaUrl =
    hero.cta_url ||
    "#menu";

  return (
    <section
      className="mvqr-hero"
      style={{
        backgroundImage: backgroundImage
          ? `linear-gradient(
              var(--hero-overlay),
              var(--hero-overlay)
            ),
            url("${backgroundImage}")`
          : undefined,
      }}
    >
      <div className="mvqr-hero__content">

        <span className="mvqr-hero__eyebrow">
          {restaurant?.business_type || "Menu"}
        </span>

        <h1 className="mvqr-hero__title">
          {title}
        </h1>

        {subtitle && (
          <p className="mvqr-hero__subtitle">
            {subtitle}
          </p>
        )}

        {ctaText && (
          <a
            href={ctaUrl}
            className="mvqr-button"
          >
            {ctaText}
          </a>
        )}

      </div>
    </section>
  );
}