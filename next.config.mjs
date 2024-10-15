/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  // Add this section:
  experimental: {
    missingSuspenseWithCSRBailout: false,
    serverActions: true,
  },
}

export default nextConfig   