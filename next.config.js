/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images:{
    remotePatterns:[
      {
        protocol:'https',
        hostname:'gulrjrxrlxgsjolomcoo.supabase.co'
      }
    ]
  }
}

module.exports = nextConfig
