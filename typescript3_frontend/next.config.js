/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // exportPathMap: function () {
  //   return {
  //     '/': { page: '/' },
  //     // Add other routes as needed
  //   }
  // },
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "m.media-amazon.com",
          // port: "",
          // pathname: "/account123/**",
        },
        {
          protocol: "http",
          hostname: "127.0.0.1",
        },
        {
          protocol: "http",
          hostname: "http://44.204.150.148/",
        },
      ],
    },
  };
  
  module.exports = nextConfig;