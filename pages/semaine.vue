<template>
	<NuxtLayout name="mobile">
		<Head>
			<Title>Sorties de la semaine</Title>
		</Head>

		<Page>
			<PageTitle>Sorties de la semaine</PageTitle>

			<div class="mt-6 grid grid-cols-3 gap-x-2 gap-y-3 items-center">
				<NuxtLink v-for="{ name, slug } in weekHots" :to="`/manga/${slug}`" append>
					<HomeHotManga class="mx-auto" :slug="slug" :name="name" :small="true" />
				</NuxtLink>
			</div>
		</Page>
	</NuxtLayout>
</template>

<script setup lang="ts">
const { data, pending } = useLazyFetch<HomeManga[]>(`/api/home/week`);
const weekHots = ref((data.value && data.value ? data.value.filter(m => m.isHot) : []) as HomeManga[]);

watch(data, (value: HomeManga[]) => {
	weekHots.value = value.filter(m => m.isHot);
});
</script>
