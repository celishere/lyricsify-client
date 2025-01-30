const IS_DEV = false;

/** @type {import('next').NextConfig, {webpack(*, *): (*), exportPathMap: function(...[*]): Promise<*>}} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    experimental: {
        reactCompiler: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    env: {
        API_URL: !IS_DEV ? "YOUR_HOST" : "http://localhost:4019",
        CENTRIFUGE_WS_URL: !IS_DEV ? "wss://YOUR_HOST" : "ws://localhost:3901/connection/websocket",
        NEXT_PUBLIC_POSTHOG_KEY: "YOUR_KEY",
        NEXT_PUBLIC_POSTHOG_HOST: "YOUR_HOST"
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "is1-ssl.mzstatic.com",
            },
            {
                protocol: "https",
                hostname: "emojicdn.elk.sh"
            }
        ]
    }
};

module.exports = nextConfig;
