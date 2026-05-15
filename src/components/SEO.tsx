import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogType?: string;
  ogImage?: string;
  noIndex?: boolean;
}

const BASE_URL = "https://livelylightingco.com";
const DEFAULT_IMAGE = "https://res.cloudinary.com/dhmijpfiy/image/upload/v1/House6_kmwq4e";
const SITE_NAME = "LivelyLightingCo";

export const SEO = ({
  title,
  description,
  canonical,
  ogType = "website",
  ogImage = DEFAULT_IMAGE,
  noIndex = false,
}: SEOProps) => {
  const fullTitle = title
    ? `${title} | ${SITE_NAME}`
    : `Permanent Outdoor Lighting in Texas & Oklahoma | ${SITE_NAME}`;

  const metaDescription = description ||
    "PermTrack permanent LED lighting installed by certified pros in the Austin metro and beyond. Lifetime PermTrack hardware warranty + 5-year workmanship warranty.";

  const canonicalUrl = canonical ? `${BASE_URL}${canonical}` : BASE_URL;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      {canonical && <link rel="canonical" href={canonicalUrl} />}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={SITE_NAME} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
};

export default SEO;
