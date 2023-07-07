// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
	app: {
		// buildAssetsDir: '/assets/',
		head: {
			title: 'Mangapp',
			meta: [
				{ charset: 'utf-8' },
				{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
				{ hid: 'description', name: 'description', content: '' }
			]
		}
	},

	modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt', '@kevinmarrec/nuxt-pwa'],

	css: ['@/assets/css/main.css'],

	pwa: {
		manifest: {
			name: 'Mangapp',
			lang: 'fr',
			start_url: '/',
			display: 'standalone',
			background_color: '#090112',
			theme_color: '#090112'
		}
	},

	vite: {
		server: {
			fs: {
				allow: ['/home/b1j']
			}
		}
	}
});
