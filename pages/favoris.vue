<template>
	<NuxtLayout name="mobile">
		<Head>
			<Title>Favoris</Title>
		</Head>

		<Page :pending="fav.refreshing || idb.loading">
			<div class="grid grid-cols-6 gap-7 items-center">
				<div
					v-for="({ name, slug }, i) in fav.list"
					class="relative col-span-2"
					:class="{ 'col-span-3': i < 2 }"
				>
					<NuxtLink :to="`/manga/${slug}`" append>
						<HomeHotManga class="mx-auto" :slug="slug" :name="name" />
					</NuxtLink>
				</div>
			</div>
		</Page>
	</NuxtLayout>
</template>

<script setup lang="ts">
import { useFavorites } from '~~/store/favorites';
import { useIdb } from '~/store/idb';

const fav = useFavorites();
const idb = useIdb();
</script>
