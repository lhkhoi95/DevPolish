/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ hostname: "img.clerk.com" }],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push({
        pdf2json: "commonjs pdf2json",
      });
    }
    return config;
  },
};

export default nextConfig;
