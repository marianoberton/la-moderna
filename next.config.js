/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Warning instead of error during build
    ignoreDuringBuilds: true,
  },
  reactStrictMode: false,
  images: {
    domains: ['xlwcbonmkfpliydbyngb.supabase.co'],
  }
};

module.exports = nextConfig;