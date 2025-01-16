import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    loader: "default",
    // loaderFile: "./src/app/internalComponents/Loader.tsx",
    unoptimized: true,
  },
};

export default nextConfig;
