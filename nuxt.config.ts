import { defineNuxtConfig } from 'nuxt';

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
	head: {
		title: 'Mangapp',
		meta: [
			{ charset: 'utf-8' },
			{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
			{ hid: 'description', name: 'description', content: '' }
		]
	},

	app: {
		buildAssetsDir: '/assets/'
	},

	css: ['@/assets/css/main.css'],
	modules: ['@nuxtjs/tailwindcss'],

	buildModules: [['@pinia/nuxt', { disableVuex: true }], '@kevinmarrec/nuxt-pwa'],

	typescript: {
		shim: false
	},

	pwa: {
		manifest: {
			name: 'Mangapp',
			lang: 'fr',
			start_url: '/',
			display: 'standalone',
			background_color: '#090112',
			theme_color: '#090112'
		}
	}
});
