/** @type {import('next').NextConfig} */
export default {
  experimental: {
    // esmExternals: false,
    typedRoutes: true,
    reactCompiler: true,
    optimizePackageImports: ['@chakra-ui/react'],
  },
  // swcMinify: false,
  webpack: (/** @type {import('webpack').Configuration} */ config) => {
    config.resolve.extensionAlias = {
      '.js': ['.ts', '.tsx', '.js'],
      '.jsx': ['.ts', '.tsx', '.js'],
    }
    config.externals.push(/^vitest$/)
    return config
  },
}
