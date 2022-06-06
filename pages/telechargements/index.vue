<template>
	<NuxtLayout name="mobile">
		<Head>
			<Title>Téléchargements</Title>
		</Head>

		<Page>
			<div class="grid grid-cols-1 gap-y-1.5 mx-2 mt-6">
				<MangaDownloadedChapter
					v-for="{ infos, slug, id } in store.downloaded"
					:infos="infos"
					:slug="slug"
					:id="id"
				/>
			</div>
		</Page>

		<template v-if="store.rmList.size" #nav>
			<div class="flex items-center justify-between gap-x-8 px-8 h-full">
				<div class="dl-button" @click="store.removeAll">Supprimer</div>
				<div class="dl-button" @click="store.rmClear">Annuler</div>
			</div>
		</template>
	</NuxtLayout>
</template>

<script setup lang="ts">
import { useDownloads } from '~/store/downloads';

const store = useDownloads();
</script>
