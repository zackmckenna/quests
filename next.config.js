/** @type {import('next').NextConfig} */
const nextConfig = {
  // Required for Cloudflare Pages
  output: "standalone",

  // Image optimization (use Cloudflare's)
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
