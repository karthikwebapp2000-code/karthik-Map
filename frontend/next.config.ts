import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: "standalone", <-- இந்த வரியை நீக்கவும் (அல்லது comment செய்யவும்)
  images: {
    unoptimized: true,
  },
  // உங்கள் config-ல் உள்ள மற்ற webpack / turbopack / headers அமைப்புகளை அப்படியே வைத்திருக்கவும்
};

export default nextConfig;
