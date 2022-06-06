<template>
	<NuxtLayout name="mobile">
		<Head>
			<Title>{{ title }} </Title>
		</Head>

		<Page :no-padding="true">
			<template v-if="!download">
				<div class="px-4 py-2 flex flex-nowrap justify-between items-center">
					<div class="w-4">
						<NuxtLink to="/">
							<img src="~/assets/svg/arrow/line.svg" />
						</NuxtLink>
					</div>

					<div class="flex flex-nowrap gap-x-3 items-center">
						<div class="w-5 cursor-pointer" @click="toggle(slug, title)">
							<img v-if="find(slug)" src="~/assets/svg/heart/plain.svg" />
							<img v-else src="~/assets/svg/heart/line.svg" />
						</div>
						<div class="w-5 cursor-pointer" @click="toggleDl">
							<img v-if="download" src="~/assets/svg/download/plain.svg" />
							<img v-else src="~/assets/svg/download/line.svg" />
						</div>
						<div>share</div>
					</div>
				</div>

				<MangaTitle class="top-0 pt-4 pb-2 mb-4 sticky shadow-2xl z-20 px-4" style="background-color: #090112">
					{{ title }}
				</MangaTitle>

				<MangaInfos :infos="infos" class="mx-4" />
			</template>

			<div class="grid grid-cols-1 gap-y-1.5 mx-2 mt-6">
				<template v-if="!download">
					<MangaChapter v-for="chapter in chapters" :chapter="chapter" :slug="slug" />
				</template>

				<template v-else>
					<MangaDownloadChapter v-for="chapter in chapters" :chapter="chapter" :slug="slug" />
				</template>
			</div>
		</Page>

		<template v-if="download" #nav>
			<div class="flex items-center justify-between gap-x-8 px-8 h-full">
				<div class="dl-button" @click="execDl() && toggleDl()">Télécharger</div>
				<div class="dl-button" @click="toggleDl">Annuler</div>
			</div>
		</template>
	</NuxtLayout>
</template>

<script setup lang="ts">
import { useDownloads } from '~/store/downloads';
import { useFavorites } from '~~/store/favorites';

const { dlClear, execDl } = useDownloads();
const { find, toggle } = useFavorites();

dlClear();
const route = useRoute();
const { data } = await useFetch<Manga>(`/api/manga/${route.params.slug}`);
const { title, chapters, ...infos } = data.value;

if (!title) throwError(new Error("Cette page n'existe pas"));

const slug: string | string[] = route.params.slug;

const download = ref(false);
function toggleDl() {
	dlClear();
	download.value = !download.value;
}
</script>

<style lang="scss">
.dl-button {
	@apply py-1.5 rounded-lg w-full text-center cursor-pointer;
	background: rgba(0, 0, 0, 0.6);
}
</style>
