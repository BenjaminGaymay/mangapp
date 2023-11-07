<template>
	<NuxtLayout name="reading">
		<Head>
			<Title v-if="pending || !Boolean(chapter)">Mangapp</Title>
			<Title v-else>
				{{ chapter.manga }} ~ {{ chapter.isVolume ? 'Volume' : 'Chapitre' }} {{ chapter.number }}
			</Title>
		</Head>

		<div
			ref="screen"
			@click="navigation = !navigation"
			@scroll="handleScroll"
			class="relative h-screen overflow-auto"
		>
			<UiLoader v-if="pending" />

			<template v-else-if="!Boolean(chapter)">
				<div class="error-img text-center">
					<div>Erreur lors du chargement du chapitre</div>
					<div>Veuillez contacter un administrateur</div>
				</div>
			</template>

			<template v-else>
				<transition name="slide">
					<nav v-if="navigation" @click.stop class="top-0">
						<div class="w-4">
							<NuxtLink :to="`/manga/${route.params.slug}`">
								<img src="~/assets/svg/arrow/line.svg" />
							</NuxtLink>
						</div>
						<div class="text-center">
							<div class="pt-1.5 text-lg font-semibold leading-4">{{ chapter.manga }}</div>
							<div>{{ chapter.isVolume ? 'Volume' : 'Chapitre' }} {{ chapter.number }}</div>
						</div>

						<div class="w-4"></div>
					</nav>
				</transition>

				<transition name="slide-reverse">
					<nav v-if="navigation" @click.stop class="bottom-0">
						<div class="w-10"></div>
						<div class="text-center">{{ current }}/{{ chapter.pages.length }}</div>

						<div class="flex gap-x-2">
							<div class="w-5 rotate-180 transform">
								<NuxtLink v-if="chapter.previous" :to="chapter.previous">
									<img src="~/assets/svg/arrow/plain.svg" />
								</NuxtLink>
							</div>

							<div class="w-5">
								<NuxtLink v-if="chapter.next" :to="chapter.next">
									<img src="~/assets/svg/arrow/plain.svg" />
								</NuxtLink>
							</div>
						</div>
					</nav>
				</transition>

				<template v-if="chapter.pages.length > 0">
					<div v-for="(page, i) in chapter.pages">
						<img
							v-if="visible >= i"
							:src="`/api/image/chapter/${page}`"
							:data-index="i + 1"
							class="mx-auto"
						/>
					</div>
				</template>

				<div v-else class="error-img text-center">
					<div>Erreur lors du déchiffrement des images</div>
					<div>Veuillez contacter un administrateur</div>
				</div>

				<div class="px-2 py-4" v-if="chapter.next && visible >= chapter.pages.length">
					<NuxtLink :to="chapter.next">
						<div class="next flex items-center justify-between rounded-lg px-4 py-2">
							<div>{{ nextName }}</div>
							<div class="w-5">
								<img src="~/assets/svg/arrow/plain.svg" />
							</div>
						</div>
					</NuxtLink>
				</div>

				<div class="px-2 py-4" v-else-if="visible >= chapter.pages.length">
					<NuxtLink to="/">
						<div class="next flex items-center gap-x-3 rounded-lg px-4 py-2">
							<div class="w-4">
								<img src="~/assets/svg/arrow/line.svg" />
							</div>

							<div>Revenir à la liste des mangas</div>
						</div>
					</NuxtLink>
				</div>
			</template>
		</div>
	</NuxtLayout>
</template>

<script setup lang="ts">
import { useHistory } from '~~/store/history';
import { useIdb } from '~~/store/idb';

const route = useRoute();
const store = useHistory();
const idb = useIdb();

const { data, pending } = useLazyFetch<ChapterPages>(`/api/manga/${route.params.slug}/${route.params.chapter}`);
const chapter = ref(data.value as ChapterPages);

watch(data, (value: ChapterPages) => {
	chapter.value = value;
});

watch(idb, value => {
	if (!value.loading) scrollToSavedPage();
});

const key: string = `${route.params.slug}-${route.params.chapter}`;

onMounted(scrollToSavedPage);

const navigation = ref(true);
const visible = ref(2);

const screen = ref(null);
const current = ref(1);

const nextName = computed((): string => {
	if (!chapter.value || !chapter.value.next) return null;

	const type = chapter.value.next.includes('volume-') ? 'Volume' : 'Chapitre';
	const name: string = chapter.value.next.split('/').pop().replace('volume-', '');
	return `${type} ${name}`;
});

function handleScroll() {
	navigation.value = false;
	if (!chapter.value || !chapter.value.pages) return;

	const middle = document.elementFromPoint(window.innerWidth / 2, window.innerHeight / 2);
	if (middle instanceof HTMLElement && middle.dataset.index && parseInt(middle.dataset.index) !== current.value) {
		current.value = parseInt(middle.dataset.index);

		store.set(key, { read: current.value >= chapter.value.pages.length, page: current.value });
	}

	if (visible.value >= chapter.value.pages.length) {
		let ridden = current.value >= chapter.value.pages.length;
		if (screen.value.scrollTop + screen.value.clientHeight >= screen.value.scrollHeight - 10) {
			ridden = true;
			current.value = chapter.value.pages.length;
		}

		return store.set(key, {
			read: ridden,
			page: current.value
		});
	}

	if (screen.value.scrollTop + screen.value.clientHeight >= screen.value.scrollHeight - window.innerHeight / 2) {
		visible.value += visible.value >= chapter.value.pages.length ? 0 : 1;
	}
}

function scrollToSavedPage() {
	const { page } = store.get(key) || {};
	if (!page) return;

	visible.value = page + 1;

	const scrollToInterval = setInterval(() => {
		const div = document.querySelector(`img[data-index="${page}"]`);
		if (!div) return;

		clearInterval(scrollToInterval);
		div.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}, 100);
}

useHead({
	// @ts-ignore
	link: computed(() => {
		if (!chapter.value || !chapter.value.pages) return [];

		return chapter.value.pages.slice(0, current.value + 3).map(page => ({
			rel: 'preload',
			as: 'image',
			href: `/api/image/chapter/${page}`
		}));
	})
});
</script>

<style lang="scss" scoped>
.slide-enter-active {
	transition: all 0.2s ease-out;
}

.slide-leave-active {
	transition: all 0.2s linear;
}

.slide-enter-from,
.slide-leave-to {
	transform: translateY(-3.5rem);
}

.slide-reverse-enter-active {
	transition: all 0.2s ease-out;
}

.slide-reverse-leave-active {
	transition: all 0.2s linear;
}

.slide-reverse-enter-from,
.slide-reverse-leave-to {
	transform: translateY(3.5rem);
}

nav {
	@apply fixed z-50 flex h-14 w-screen flex-nowrap items-center justify-between px-4;
	background-color: #090112;
}

.next {
	background: rgba(255, 255, 255, 0.2);
}

.error-img {
	background-color: #090112;
	height: calc(100% - 4.5rem);
	display: grid;
	place-content: center;

	color: white;
}
</style>
