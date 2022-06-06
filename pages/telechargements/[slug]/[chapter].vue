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
						<NuxtLink to="/telechargements">
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
					<div class="text-center w-full">{{ current }}/{{ pages.length }}</div>
				</nav>
			</transition>

			<div v-for="(page, i) in pages">
				<img v-if="visible >= i" :src="page" :data-index="i + 1" class="mx-auto" />
			</div>
		</div>
	</NuxtLayout>
</template>

<script setup lang="ts">
import { getMany, get } from 'idb-keyval';
import { useDownloads } from '~~/store/downloads';
import { useHistory } from '~~/store/history';

const store = useHistory();
const { get: getFromStore } = useDownloads();

const route = useRoute();

const pages = ref([] as DBPage[]);
const infos = ref({} as ChapterPagesInfos);

const key: string = `${route.params.slug}-${route.params.chapter}`;

onMounted(async () => {
	const { pages: p, infos: i } = getFromStore(key) || (await get<DBChapter>(`[chapter]:${key}`));

	pages.value = await getMany<DBPage>(p.map((uri: string): string => `[page]:${uri}`));
	infos.value = i;

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

function handleScroll() {
	navigation.value = false;

	const middle = document.elementFromPoint(window.innerWidth / 2, window.innerHeight / 2);
	if (middle instanceof HTMLElement && middle.dataset.index && parseInt(middle.dataset.index) !== current.value) {
		current.value = parseInt(middle.dataset.index);

		store.set(key, { read: current.value >= pages.value.length, page: current.value });
	}

	if (visible.value >= pages.value.length) {
		return store.set(key, { read: current.value >= pages.value.length, page: current.value });
	}

	if (screen.value.scrollTop + screen.value.clientHeight >= screen.value.scrollHeight - window.innerHeight / 2) {
		visible.value += visible.value >= pages.value.length ? 0 : 1;
	}
}
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
