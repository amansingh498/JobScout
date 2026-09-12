/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
    const cleanUrl = backendUrl.replace(/\/+$/, '').replace(/\/api$/, '');
    return [
      {
        source: '/backend-api/:path*',
        destination: `${cleanUrl}/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;

