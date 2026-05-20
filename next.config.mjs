import withPWA from "next-pwa";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com"
      }
    ]
  }
};

/** @type {import('next-pwa/types').PWAConfig} */
const withPWAConfig = {
  dest: "public"
};

export default withPWA(withPWAConfig)(nextConfig);
