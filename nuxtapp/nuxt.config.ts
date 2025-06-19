export default defineNuxtConfig({
    compatibilityDate: '2025-05-15',
    devtools: {enabled: true},
    modules: ['@nuxt/eslint', 'vuetify-nuxt-module'],
    experimental: {
        renderJsonPayloads: false
    },
    ssr: false,
})