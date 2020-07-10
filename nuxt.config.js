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
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: {
    color: "#fe4e0e",
    failedColor: "red"
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
      src: "@/plugins/event",
      ssr: false
    },
    "@/plugins/axios",
    {
      src: "@/plugins/api",
      ssr: false
    }
  ],
  axios: {
    baseURL:
      process.env.NODE_ENV === "development" ? `http://localhost:8080` : ""
  },
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
