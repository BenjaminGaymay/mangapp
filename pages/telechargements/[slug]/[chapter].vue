<template>
	<NuxtLayout name="reading">
		<Head>
			<Title v-if="loading">Mangapp</Title>
			<Title v-else>{{ infos.manga }} ~ {{ infos.isVolume ? 'Volume' : 'Chapitre' }} {{ infos.number }}</Title>
		</Head>

		<div
			ref="screen"
			@click="navigation = !navigation"
			@scroll="handleScroll"
			class="relative overflow-auto h-screen"
		>
			<UiLoader v-if="loading" />
			<template v-else>
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

				<div class="px-2 py-4" v-if="next && visible >= pages.length">
					<NuxtLink :to="`/telechargements/${route.params.slug}/${next.infos.number}`">
						<div class="next px-4 py-2 rounded-lg flex items-center justify-between">
							<div>{{ next.infos.isVolume ? 'Volume' : 'Chapitre' }} {{ next.infos.number }}</div>
							<div class="w-5">
								<img src="~/assets/svg/arrow/plain.svg" />
							</div>
						</div>
					</NuxtLink>
				</div>

				<div class="px-2 py-4" v-else-if="visible >= pages.length">
					<NuxtLink to="/telechargements">
						<div class="next px-4 py-2 rounded-lg flex items-center gap-x-3">
							<div class="w-4">
								<img src="~/assets/svg/arrow/line.svg" />
							</div>

							<div>Revenir à la liste des téléchargements</div>
						</div>
					</NuxtLink>
				</div>
			</template>
		</div>
	</NuxtLayout>
</template>

<script setup lang="ts">
import { getMany, get } from 'idb-keyval';
import { useDownloads } from '~~/store/downloads';
import { useHistory } from '~~/store/history';
import { useIdb } from '~~/store/idb';

const idb = useIdb();
const store = useHistory();
const dl = useDownloads();

const route = useRoute();

const pages = ref([] as DBPage[]);
const infos = ref({} as ChapterPagesInfos);
const loading = ref(false);

const next = ref(null as DBChapter);

const key: string = `${route.params.slug}-${route.params.chapter}`;

watch(idb, value => {
	if (!value.loading) {
		scrollToSavedPage();

		const { infos } = dl.get(key);
		next.value = findNext(infos);
	}
});

onMounted(async () => {
	loading.value = true;
	const { pages: p, infos: i } = dl.get(key) || (await get<DBChapter>(`[chapter]:${key}`));
	next.value = findNext(i);

	pages.value = await getMany<DBPage>(p.map((uri: string): string => `[page]:${uri}`));
	loading.value = false;

	infos.value = i;

	scrollToSavedPage();
});

const navigation = ref(true);
const visible = ref(2);

const screen = ref(null);
const current = ref(1);

function findNext(infos: ChapterPagesInfos): DBChapter {
	const sorted = dl.downloaded
		.reduce((acc, cur: DlChapter) => {
			if (cur.slug === route.params.slug && cur.infos.number > infos.number) return [...acc, cur];
			return acc;
		}, [])
		.sort((a, b) => b.number - a.number);

	return sorted[0];
}

function handleScroll() {
	navigation.value = false;

	const middle = document.elementFromPoint(window.innerWidth / 2, window.innerHeight / 2);
	if (middle instanceof HTMLElement && middle.dataset.index && parseInt(middle.dataset.index) !== current.value) {
		current.value = parseInt(middle.dataset.index);

		store.set(key, { read: current.value >= pages.value.length, page: current.value });
	}

	if (visible.value >= pages.value.length) {
		let ridden = current.value >= pages.value.length;
		if (screen.value.scrollTop + screen.value.clientHeight >= screen.value.scrollHeight - 10) {
			ridden = true;
			current.value = pages.value.length;
		}

		return store.set(key, { read: ridden, page: current.value });
	}

	if (screen.value.scrollTop + screen.value.clientHeight >= screen.value.scrollHeight - window.innerHeight / 2) {
		visible.value += visible.value >= pages.value.length ? 0 : 1;
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
