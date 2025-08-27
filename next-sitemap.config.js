// next-sitemap.config.js
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://example.vercel.app"; // harmless fallback for local

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: SITE_URL,
  generateRobotsTxt: true,
  sitemapSize: 7000,
  exclude: ["/api/*"],
  robotsTxtOptions: {
    policies: [{ userAgent: "*", allow: "/" }],
  },
};
