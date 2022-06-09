<template>
	<NuxtLayout name="mobile">
		<Head>
			<Title>Favoris</Title>
		</Head>

		<Page :pending="fav.refreshing || idb.loading">
			<PageTitle class="mb-8">Mes favoris</PageTitle>

			<div class="grid grid-cols-3 gap-x-3 gap-y-3 items-center">
				<div v-for="({ name, slug }, i) in fav.list" class="relative">
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
