<template>
	<NuxtLayout name="mobile">
		<Head>
			<Title v-if="status === 'pending' || !Boolean(manga)">Mangapp</Title>
			<Title v-else>{{ manga.title }} </Title>
		</Head>

		<Page :no-padding="true" :pending="status === 'pending' || !Boolean(manga)">
			<!-- <template v-if="!download"> -->
			<div class="sticky top-0 z-20 mb-4 px-4 pb-2 pt-4 shadow-2xl" style="background-color: #090112">
				<div class="flex flex-nowrap items-center justify-between px-4 py-2">
					<div class="w-4">
						<NuxtLink to="/">
							<img src="~/assets/svg/arrow/line.svg" />
						</NuxtLink>
					</div>

					<div class="flex flex-nowrap items-center gap-x-3">
						<div v-if="manga.title" class="w-5 cursor-pointer" @click="toggle(slug, manga.title)">
							<img v-if="find(slug)" src="~/assets/svg/heart/plain.svg" />
							<img v-else src="~/assets/svg/heart/line.svg" />
						</div>

						<!-- <div class="w-5 cursor-not-allowed" v-if="dl.loading">
								<img src="~/assets/svg/download/plain.svg" />
							</div>
							<div v-else class="w-5 cursor-pointer" @click="toggleDl">
								<img v-if="download" src="~/assets/svg/download/plain.svg" />
								<img v-else src="~/assets/svg/download/line.svg" />
							</div> -->
						<!-- <div>share</div> -->
					</div>
				</div>

				<MangaTitle v-if="manga.title">
					{{ manga.title }}
				</MangaTitle>
			</div>

			<MangaInfos v-if="manga" :infos="manga" :slug="slug" class="mx-4" />
			<!-- </template> -->

			<div class="mx-2 mt-6 grid grid-cols-1 gap-y-1.5">
				<!-- <template v-if="!download && manga.chapters"> -->
				<template v-if="manga.chapters">
					<MangaChapter
						v-for="chapter in manga.chapters"
						:chapter="chapter"
						:slug="slug"
						:data-index="chapter.number"
					/>
				</template>

				<!-- <template v-else-if="manga.chapters">
					<MangaDownloadChapter
						v-for="chapter in manga.chapters"
						:chapter="chapter"
						:slug="slug"
						:data-index="chapter.number"
					/>
				</template> -->
			</div>
		</Page>

		<!-- <template v-if="download" #nav>
			<div class="flex h-full items-center justify-between gap-x-8 px-8">
				<div class="dl-button" @click="dl.execDl() && toggleDl()">Télécharger</div>
				<div class="dl-button" @click="toggleDl">Annuler</div>
			</div>
		</template> -->
	</NuxtLayout>
</template>

<script setup lang="ts">
// import { useDownloads } from '~/store/downloads';
import { useFavorites } from '~~/store/favorites';
import { useHistory } from '~~/store/history';
import { useIdb } from '~~/store/idb';

// const dl = useDownloads();
const { find, toggle } = useFavorites();
const idb = useIdb();
const history = useHistory();

// dl.dlClear();
const route = useRoute();
const { data, status } = useLazyFetch<Manga>(`/api/manga/${route.params.slug}`);
const manga = ref(data.value as Manga);

watch(data, value => {
	if (!value) return;

	manga.value = value;

	if (!value.title) throw new Error("Cette page n'existe pas");
	scrollToLastRidden();
});

watch(idb, value => {
	if (!value.loading) scrollToLastRidden();
});

const slug: string = route.params.slug as string;

// const download = ref(false);
// function toggleDl() {
// 	dl.dlClear();
// 	download.value = !download.value;

// 	nextTick(scrollToLastRidden);
// }

onMounted(scrollToLastRidden);

function findLastRiddenChapter() {
	if (!manga || !manga.value || !manga.value.chapters) return null;

	const ridden = manga.value.chapters.reduce(
		(acc, cur) => {
			const chapterFromHistory = history.get(`${route.params.slug}-${cur.number}`);

			if (!chapterFromHistory || !chapterFromHistory.read) return acc;
			return [...acc, cur];
		},
		[] as Manga['chapters']
	);

	return ridden.sort((a, b) => b.number - a.number)[0];
}

function scrollToLastRidden() {
	if (!idb.loaded) return;

	const scrollToInterval = setInterval(() => {
		const lastRidden = findLastRiddenChapter();
		if (!lastRidden) return clearInterval(scrollToInterval);

		const div = document.querySelector(`*[data-index="${lastRidden.number}"]`);
		if (!div) return;

		clearInterval(scrollToInterval);
		div.scrollIntoView({ behavior: 'smooth', block: 'center' });
	}, 100);
}
</script>

<style lang="scss">
.dl-button {
	@apply w-full cursor-pointer rounded-lg py-1.5 text-center;
	background: rgba(0, 0, 0, 0.6);
}
</style>
