const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/sathish',
        destination: 'https://csc-admin-test.netlify.app',
        permanent: true, // Use false to prevent a permanent redirect (keeps the browser URL)
      },
    ];
  },
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
