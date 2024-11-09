/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // Enable static exports
  images: {
    unoptimized: true, // Required for static export
  },
  distDir: 'out', // Specify the output directory
}

module.exports = nextConfig 