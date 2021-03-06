module.exports = {
  mode: "universal",
  /*
   ** Headers of the page
   */
  head: {
    title: process.env.npm_package_name || "",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: process.env.npm_package_description || ""
      }
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      {
        rel: "stylesheet",
        href: "//at.alicdn.com/t/font_1872348_iezgtdvnw8n.css"
      }
    ]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: {
    color: "#00c58e",
    failedColor: "red",
    continuous: true
  },
  /*
   ** Global CSS
   */
  css: ["element-ui/lib/theme-chalk/index.css", "@assets/style/main.scss"],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    {
      src: "@/plugins/element-ui",
      ssr: true
    },
    {
      src: "@/plugins/directive",
      ssr: false
    },
    "@/plugins/axios",
    {
      src: "@/plugins/api",
      ssr: true
    },
    {
      src: "@/plugins/variable-color",
      ssr: false
    },
    {
      src: "@/plugins/events",
      ssr: false
    }
  ],
  axios: {},
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [],
  /*
   ** Nuxt.js modules
   */
  modules: ["@nuxtjs/axios"],
  /*
   ** Build configuration
   */
  build: {
    transpile: [/^element-ui/],
    babel: {
      plugins: [
        [
          "component",
          {
            libraryName: "element-ui",
            styleLibraryName: "theme-chalk"
          }
        ]
      ],
      comments: true
    },
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {}
  },
  server: {
    port: 8080
  },
  telemetry: true
};
