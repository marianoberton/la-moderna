/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Warning instead of error during build
    ignoreDuringBuilds: true,
  },
  output: 'standalone',
  distDir: 'build',
  reactStrictMode: false
};

module.exports = nextConfig;