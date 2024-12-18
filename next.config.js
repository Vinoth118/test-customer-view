const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias["@"] = __dirname;
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

module.exports = nextConfig;
