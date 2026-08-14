const DEFAULT_FONTS = {
  body: "Roboto",
  headings: "Montserrat",
  accent: "Roboto",
};


export function resolveFonts(fonts = {}) {
  return {
    body:
      fonts.body ||
      DEFAULT_FONTS.body,

    headings:
      fonts.headings ||
      fonts.heading ||
      DEFAULT_FONTS.headings,

    accent:
      fonts.accent ||
      DEFAULT_FONTS.accent,
  };
}


export { DEFAULT_FONTS };