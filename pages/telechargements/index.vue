<template>
	<NuxtLayout name="mobile">
		<Head>
			<Title>Téléchargements</Title>
		</Head>

		<Page :pending="dl.refreshing || idb.loading">
			<PageTitle class="mb-8">Mes téléchargements</PageTitle>

			<div v-for="manga in sorted" class="manga">
				<div
					class="w-full h-14 rounded-lg manga-name flex items-center justify-center"
					:style="`--url: url('https://japscan.lol/imgs/mangas/${manga[0].slug}.jpg')`"
				>
					<div class="text-xl">
						{{ manga[0].infos.manga }}
					</div>
				</div>

				<div class="grid grid-cols-1 gap-y-1.5 mx-2 mt-3">
					<MangaDownloadedChapter v-for="{ infos, slug, id } in manga" :infos="infos" :slug="slug" :id="id" />
				</div>
			</div>
		</Page>

		<template v-if="dl.rmList.size" #nav>
			<div class="flex items-center justify-between gap-x-8 px-8 h-full">
				<div class="dl-button" @click="dl.removeAll">Supprimer</div>
				<div class="dl-button" @click="dl.rmClear">Annuler</div>
			</div>
		</template>
	</NuxtLayout>
</template>

<script setup lang="ts">
import { useDownloads } from '~/store/downloads';
import { useIdb } from '~/store/idb';

const dl = useDownloads();
const idb = useIdb();

const sorted = computed(() => {
	return dl.downloaded.reduce((acc, cur: DlChapter) => {
		if (acc[cur.slug]) acc[cur.slug] = [...acc[cur.slug], cur].sort((a, b) => a.infos.number - b.infos.number);
		else acc[cur.slug] = [cur];

		return acc;
	}, {});
});
</script>

<style lang="scss" scoped>
.manga {
	&-name {
		background-color: rgba(27, 6, 77, 0.623);
		box-shadow: inset -2px -2px 30px 10px rgba(0, 0, 0, 0.5), -2px -2px 30px 10px rgba(0, 0, 0, 0.5);
	}

	&:not(:last-child) {
		margin-bottom: 1.5rem;
	}
}
</style>
