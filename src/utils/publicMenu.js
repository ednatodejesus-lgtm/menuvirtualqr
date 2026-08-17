export function getPublicMenuPath(slug) {

    if (!slug) {
        return "/menu";
    }

    return `/menu/${slug}`;
}


export function getPublicMenuUrl(slug) {

    const path =
        getPublicMenuPath(slug);

    return `${window.location.origin}${path}`;
}