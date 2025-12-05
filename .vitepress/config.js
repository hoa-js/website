import { defineConfig } from 'vitepress'
import llmstxt from 'vitepress-plugin-llms'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  vite: {
    plugins: [llmstxt()]
  },

  title: 'Hoa',
  description: 'A minimal web framework built on Web Standards',
  srcDir: './docs',
  sitemap: {
    hostname: 'https://hoa-js.com'
  },

  head: [
    ['link', { rel: 'icon', href: '/favicon.png' }],
    [
      'script',
      {
        async: 'true',
        src: 'https://www.googletagmanager.com/gtag/js?id=G-KNMF563XX4'
      }
    ],
    [
      'script',
      {},
      `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-KNMF563XX4');
      `
    ]
  ],

  themeConfig: {
    nav: [
      { text: 'Home', link: '/' }
    ],

    sidebar: [
      {
        text: 'What is Hoa?',
        link: '/what-is-hoa'
      },
      {
        text: 'API',
        items: [
          { text: 'Hoa', link: '/api/hoa' },
          { text: 'HoaContext', link: '/api/context' },
          { text: 'HoaRequest', link: '/api/request' },
          { text: 'HoaResponse', link: '/api/response' },
        ]
      },
      {
        text: 'Adapter',
        items: [
          { text: 'Node.js', link: '/adapter/node.md' },
        ]
      },
      {
        text: 'Middleware',
        items: [
          { text: 'Basic Authentication', link: '/middleware/basic-auth' },
          { text: 'Body Parser', link: '/middleware/bodyparser' },
          { text: 'Cache', link: '/middleware/cache' },
          { text: 'Combine', link: '/middleware/combine' },
          { text: 'Compress', link: '/middleware/compress' },
          { text: 'Cookie', link: '/middleware/cookie' },
          { text: 'CORS', link: '/middleware/cors' },
          { text: 'CSRF', link: '/middleware/csrf' },
          {
            text: 'Debug',
            items: [
              { text: 'Sentry', link: '/middleware/debug/sentry' },
            ]
          },
          { text: 'Etag', link: '/middleware/etag' },
          { text: 'Favicon', link: '/middleware/favicon' },
          { text: 'IP Restriction', link: '/middleware/ip' },
          { text: 'JSON Format', link: '/middleware/json' },
          { text: 'JWT', link: '/middleware/jwt' },
          { text: 'Language', link: '/middleware/language' },
          { text: 'Logger', link: '/middleware/logger' },
          { text: 'Method Override', link: '/middleware/method-override' },
          {
            text: 'Rate Limit',
            items: [
              { text: 'Cloudflare', link: '/middleware/ratelimit/cloudflare-rate-limit' },
            ]
          },
          { text: 'Request ID', link: '/middleware/request-id' },
          { text: 'Response Time', link: '/middleware/response-time' },
          { text: 'Powered By', link: '/middleware/powered-by' },
          {
            text: 'Routing',
            items: [
              { text: 'Router', link: '/middleware/router/router' },
              { text: 'Tiny Router', link: '/middleware/router/tiny-router' }
            ]
          },
          {
            text: 'Secure Headers',
            items: [
              { text: 'Secure-Headers', link: '/middleware/secure-headers/secure-headers' },
              {
                text: "Content-Security-Policy",
                link: "/middleware/secure-headers/content-security-policy"
              },
              {
                text: "Cross-Origin-Embedder-Policy",
                link: "/middleware/secure-headers/cross-origin-embedder-policy"
              },
              {
                text: "Cross-Origin-Opener-Policy",
                link: "/middleware/secure-headers/cross-origin-opener-policy"
              },
              {
                text: "Cross-Origin-Resource-Policy",
                link: "/middleware/secure-headers/cross-origin-resource-policy"
              },
              {
                text: "Origin-Agent-Cluster",
                link: "/middleware/secure-headers/origin-agent-cluster"
              },
              {
                text: "Referrer-Policy",
                link: "/middleware/secure-headers/referrer-policy"
              },
              {
                text: "Strict-Transport-Security",
                link: "/middleware/secure-headers/strict-transport-security"
              },
              {
                text: "X-Content-Type-Options",
                link: "/middleware/secure-headers/x-content-type-options"
              },
              {
                text: "X-Dns-Prefetch-Control",
                link: "/middleware/secure-headers/x-dns-prefetch-control"
              },
              {
                text: "X-Download-Options",
                link: "/middleware/secure-headers/x-download-options"
              },
              {
                text: "X-Frame-Options",
                link: "/middleware/secure-headers/x-frame-options"
              },
              {
                text: "X-Permitted-Cross-Domain-Policies",
                link: "/middleware/secure-headers/x-permitted-cross-domain-policies"
              },
              {
                text: "X-Xss-Protection",
                link: "/middleware/secure-headers/x-xss-protection"
              },
              {
                text: "Permission-Policy",
                link: "/middleware/secure-headers/permission-policy"
              }
            ]
          },
          { text: 'Timeout', link: '/middleware/timeout' },
          {
            text: 'Validator',
            items: [
              { text: 'Nana', link: '/middleware/validator/nana' },
              { text: 'Zod', link: '/middleware/validator/zod' },
              { text: 'Valibot', link: '/middleware/validator/valibot' }
            ]
          },
          { text: 'Vary', link: '/middleware/vary' },
          {
            text: 'View Renderer',
            items: [
              { text: 'Mustache', link: '/middleware/view/mustache' },
            ]
          }
        ]
      },
      {
        text: 'Example',
        items: [
          { text: '2FA', link: 'https://github.com/hoa-js/examples/tree/master/2fa' },
          { text: 'Image Transformer', link: 'https://github.com/hoa-js/examples/tree/master/image-transformer' },
          { text: 'My IP', link: 'https://github.com/hoa-js/examples/tree/master/myip' },
          { text: 'Temp Note', link: 'https://github.com/hoa-js/examples/tree/master/tempnote' },
        ]
      },
      {
        text: 'LLM',
        items: [
          { text: 'llms.txt', link: '/llms.txt' },
          { text: 'llms-full.txt', link: '/llms-full.txt' },
        ]
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/hoa-js/hoa' }
    ]
  }
})
