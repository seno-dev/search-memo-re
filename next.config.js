import nextPWA from 'next-pwa'

const withPWA = nextPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
})

/** @type {import('next').NextConfig} */
const config = {
  experimental: {
    // esmExternals: false,
    typedRoutes: true,
    reactCompiler: true,
    dynamicIO: true,
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

export default withPWA(config)
