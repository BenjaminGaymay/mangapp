<template>
	<NuxtLayout name="reading">
		<Head>
			<Title>{{ infos.manga }} ~ {{ infos.isVolume ? 'Volume' : 'Chapitre' }} {{ infos.number }}</Title>
		</Head>

		<div
			ref="screen"
			@click="navigation = !navigation"
			@scroll="handleScroll"
			class="relative overflow-auto h-screen"
		>
			<transition name="slide">
				<nav v-if="navigation" @click.stop class="top-0">
					<div class="w-4">
						<NuxtLink :to="`/manga/${route.params.slug}`">
							<img src="~/assets/svg/arrow/line.svg" />
						</NuxtLink>
					</div>
					<div class="text-center">
						<div class="font-semibold text-lg leading-4 pt-1.5">{{ infos.manga }}</div>
						<div>{{ infos.isVolume ? 'Volume' : 'Chapitre' }} {{ infos.number }}</div>
					</div>

					<div class="w-4"></div>
				</nav>
			</transition>

			<transition name="slide-reverse">
				<nav v-if="navigation" @click.stop class="bottom-0">
					<div class="w-10"></div>
					<div class="text-center">{{ current }}/{{ pages.length }}</div>

					<div class="flex gap-x-2">
						<div class="w-5 transform rotate-180">
							<NuxtLink v-if="infos.previous" :to="infos.previous">
								<img src="~/assets/svg/arrow/plain.svg" />
							</NuxtLink>
						</div>

						<div class="w-5">
							<NuxtLink v-if="infos.next" :to="infos.next">
								<img src="~/assets/svg/arrow/plain.svg" />
							</NuxtLink>
						</div>
					</div>
				</nav>
			</transition>

			<div v-for="(page, i) in pages">
				<img v-if="visible >= i" :src="page" :data-index="i + 1" class="mx-auto" />
			</div>

			<div class="px-2 py-4" v-if="infos.next && current >= pages.length">
				<NuxtLink :to="infos.next">
					<div class="next px-4 py-2 rounded-lg flex items-center justify-between">
						<div>{{ nextName }}</div>
						<div class="w-5">
							<img src="~/assets/svg/arrow/plain.svg" />
						</div>
					</div>
				</NuxtLink>
			</div>

			<div class="px-2 py-4" v-else-if="current >= pages.length">
				<NuxtLink to="/">
					<div class="next px-4 py-2 rounded-lg flex items-center gap-x-3">
						<div class="w-4">
							<img src="~/assets/svg/arrow/line.svg" />
						</div>

						<div>Revenir à la liste des mangas</div>
					</div>
				</NuxtLink>
			</div>
		</div>
	</NuxtLayout>
</template>

<script setup lang="ts">
import { useHistory } from '~~/store/history';

const route = useRoute();
const store = useHistory();

const { data } = await useFetch<ChapterPages>(`/api/manga/${route.params.slug}/${route.params.chapter}`);
const { pages, ...infos } = data.value;

const key: string = `${route.params.slug}-${route.params.chapter}`;

onMounted(async () => {
	const { page } = store.list[key] || {};
	if (!page) return;

	visible.value = page + 1;

	const scrollToInterval = setInterval(() => {
		const div = document.querySelector(`img[data-index="${page}"]`);
		if (!div) return;

		clearInterval(scrollToInterval);
		div.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}, 100);
});

const navigation = ref(true);
const visible = ref(2);

const screen = ref(null);
const current = ref(1);

const nextName = computed((): string => {
	if (!infos.next) return null;

	const type = infos.next.includes('volume-') ? 'Volume' : 'Chapitre';
	const name: string = infos.next.split('/').pop().replace('volume-', '');
	return `${type} ${name}`;
});

function handleScroll() {
	navigation.value = false;

	const middle = document.elementFromPoint(window.innerWidth / 2, window.innerHeight / 2);
	if (middle instanceof HTMLElement && middle.dataset.index && parseInt(middle.dataset.index) !== current.value) {
		current.value = parseInt(middle.dataset.index);

		store.set(key, { read: current.value >= pages.length, page: current.value });
	}

	if (visible.value >= pages.length) {
		return store.set(key, { read: current.value >= pages.length, page: current.value });
	}

	if (screen.value.scrollTop + screen.value.clientHeight >= screen.value.scrollHeight - window.innerHeight / 2) {
		visible.value += visible.value >= pages.length ? 0 : 1;
	}
}

useHead({
	// @ts-ignore
	link: computed(() => {
		return pages.slice(0, current.value + 3).map(page => ({
			rel: 'preload',
			as: 'image',
			href: page
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
	@apply fixed w-screen h-14 px-4 z-50 flex flex-nowrap items-center justify-between;
	background-color: #090112;
}

.next {
	background: rgba(255, 255, 255, 0.2);
}
</style>
