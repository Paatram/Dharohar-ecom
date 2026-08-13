const developmentOrigin = "http://localhost:3000";

export function getSiteOrigin() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) {
    return configured.replace(/\/$/, "");
  }

  return developmentOrigin;
}

export function absoluteUrl(pathname: string) {
  return new URL(pathname, `${getSiteOrigin()}/`).toString();
}
