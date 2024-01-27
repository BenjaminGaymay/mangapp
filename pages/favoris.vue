<template>
	<NuxtLayout name="mobile">
		<Head>
			<Title>Favoris</Title>
		</Head>

		<Page :pending="fav.refreshing || idb.loading">
			<PageTitle class="mb-8">Mes favoris</PageTitle>

			<div class="grid grid-cols-3 gap-x-3 gap-y-3 items-center">
				<div v-for="{ name, slug } in fav.list" class="relative">
					<NuxtLink :to="`/manga/${slug}`" append>
						<HomeHotManga class="mx-auto" :slug="slug" :name="name" />

						<div v-if="updated.includes(slug)" class="absolute inset-0 updated">
							<div
								class="mt-1 ml-auto mr-1 w-min whitespace-nowrap badge bg-red-400 text-xs font-semibold"
							>
								Nouveau !
							</div>
						</div>
					</NuxtLink>
				</div>
			</div>
		</Page>
	</NuxtLayout>
</template>

<script setup lang="ts">
import { get } from 'idb-keyval';

import { useFavorites } from '~~/store/favorites';
import { useIdb } from '~/store/idb';

const fav = useFavorites();
const idb = useIdb();

const { data: wData } = useLazyFetch<HomeManga[]>('/api/home/week');

const updated = ref<string[]>([]);
watch(() => [idb.loading, wData.value, fav.refreshing], buildUpdatedArray, { immediate: true });

async function buildUpdatedArray() {
	if (idb.loading || !wData.value || fav.refreshing) return;

	for (const manga of fav.list) {
		if (await hasBeenUpdated(manga.slug)) updated.value.push(manga.slug);
	}
}

async function hasBeenUpdated(slug: string) {
	const lastChapter = wData?.value?.find((manga: HomeManga) => manga.slug === slug)?.chapters?.at(-1);
	if (!lastChapter) return false;

	const historyKey: string = `[history]:${slug}-${lastChapter.number}`;

	const history = await get<DBHistory>(historyKey);
	if (history && history.read) return false;

	return true;
}
</script>

<style lang="scss" scoped>
.updated {
	position: absolute;
	inset: 0;

	background-image: linear-gradient(180deg, rgba(0, 0, 0, 0.6), transparent);
}

.badge {
	@apply px-2 py-1 rounded;
	box-shadow: inset -2px -2px 10px 3px rgba(0, 0, 0, 0.5);
}
</style>
