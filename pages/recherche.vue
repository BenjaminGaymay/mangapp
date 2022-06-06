<template>
	<NuxtLayout name="mobile">
		<Head>
			<Title>Rechercher un manga</Title>
		</Head>

		<Page>
			<div class="mx-auto w-min">
				<input
					class="search-input rounded-lg px-2 py-1.5"
					type="text"
					placeholder="Rechercher un manga"
					@input="handleSearch"
				/>
			</div>

			<div class="mt-8 grid grid-cols-2 gap-7 items-center">
				<div v-for="({ name, slug, url }, i) in manga" class="relative">
					<NuxtLink :to="url" append>
						<HomeHotManga class="mx-auto" :slug="slug" :name="name" />
					</NuxtLink>
				</div>
			</div>
		</Page>
	</NuxtLayout>
</template>

<script setup lang="ts">
let timeout = null;
const manga = ref([]);

function handleSearch(event, ms = 200) {
	const query = event.target.value.replace(/^\s+|\s+$/g, '');

	if (!query || query === '') return (manga.value = null);
	if (timeout) clearTimeout(timeout);

	timeout = setTimeout(async () => {
		const { data } = await useFetch<QueryResult[]>(`/api/search/${query}`);
		if (data) manga.value = data.value;
	}, ms);
}
</script>

<style lang="scss" scoped>
.search-input {
	background-color: rgba(255, 255, 255, 0.2);

	&:focus {
		outline: 0;
	}
}
</style>
