<template>
	<div class="font-sm flex h-screen w-screen flex-col text-white antialiased" style="background-color: #090112">
		<div class="gradient fixed w-screen" :class="gradientPosition"></div>

		<div v-if="status" class="notification">Téléchargement {{ status }}</div>

		<main class="z-10 mx-auto w-full max-w-xl flex-grow overflow-auto pb-2">
			<slot />
		</main>

		<div class="navbar z-10 rounded-t-2xl">
			<slot name="nav">
				<!-- <nav class="grid grid-cols-4 items-center"> -->
				<nav class="grid grid-cols-3 items-center">
					<NuxtLink to="/">
						<div class="flex h-14 items-center">
							<img v-if="selected === 'home'" src="~/assets/svg/circle/plain.svg" class="selected" />
							<img v-else src="~/assets/svg/circle/line.svg" />
						</div>
					</NuxtLink>

					<NuxtLink to="/favoris">
						<div class="flex h-14 items-center">
							<img v-if="selected === 'favorite'" src="~/assets/svg/heart/plain.svg" class="selected" />
							<img v-else src="~/assets/svg/heart/line.svg" />
						</div>
					</NuxtLink>

					<!-- <NuxtLink to="/telechargements">
						<div class="h-14 flex items-center">
							<img
								v-if="selected === 'download'"
								src="~/assets/svg/download/plain.svg"
								class="selected"
							/>
							<img v-else src="~/assets/svg/download/line.svg" />
						</div>
					</NuxtLink> -->

					<NuxtLink to="/recherche">
						<div class="flex h-14 items-center">
							<img v-if="selected === 'search'" src="~/assets/svg/search/plain.svg" class="selected" />
							<img v-else src="~/assets/svg/search/line.svg" />
						</div>
					</NuxtLink>
				</nav>
			</slot>
		</div>
	</div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useDownloads } from '~/store/downloads';
import { useIdb } from '~~/store/idb';

const route = useRoute();

const pages = {
	home: ['/manga', '/semaine'],
	favorite: ['/favoris'],
	download: ['/telechargements'],
	search: ['/recherche']
};

const selected = computed((): string => {
	const path: string = route.path;
	if (path === '/') return 'home';

	const groups: string[] = Object.keys(pages);
	const filtered: string[] = groups.filter(group =>
		pages[group].reduce((acc: boolean, cur: string): boolean => acc || cur === path || path.startsWith(cur), false)
	);

	if (filtered.length > 0) return filtered[0];
	return 'home';
});

const gradientPosition = computed((): string => {
	switch (route.path) {
		case '/telechargements':
			return 'top-0 transform -translate-y-1/2 translate-x-1/3';

		case '/favoris':
			return 'top-0 transform translate-y-1/3 -translate-x-1/2';

		case '/recherche':
			return 'top-0 transform translate-y-3/4 translate-x-2/3';

		default:
			return 'bottom-0 transform translate-y-1/2 -translate-x-1/3';
	}
});

const { status } = storeToRefs(useDownloads());
const { refreshAll } = useIdb();

onMounted(refreshAll);
</script>

<style lang="scss" scoped>
.notification {
	@apply mt-1 rounded-md py-0.5 text-sm;
	text-align: center;
	width: calc(100% - 2rem);
	margin-inline: 1rem;

	background: rgba(255, 255, 255, 0.3);
}

.gradient {
	z-index: 1;

	aspect-ratio: 1 / 1;
	background-image: linear-gradient(45deg, rgb(110, 37, 179), rgb(28, 30, 141) 50%, rgb(216, 41, 207));

	filter: blur(1000px);
}

.navbar {
	background: linear-gradient(0deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.3) 100%);
	min-height: 3.5rem;
	max-height: 3.5rem;

	nav {
		& > *:hover {
			font-weight: 600;
		}

		img {
			margin-inline: auto;
			height: 1.5rem;

			transition: all 0.3s linear;

			&.selected {
				transform: scale(1.15);
				transition: all 0.3s linear;
			}
		}
	}
}
</style>
