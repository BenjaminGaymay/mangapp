<template>
	<NuxtLayout name="mobile">
		<Head>
			<Title>Sorties de la semaine</Title>
		</Head>

		<Page :pending="pending">
			<div class="flex items-center justify-between flex-nowrap mb-6">
				<PageTitle>Sorties de la semaine</PageTitle>

				<div class="w-4 transform">
					<NuxtLink to="/">
						<img src="~/assets/svg/arrow/line.svg" />
					</NuxtLink>
				</div>
			</div>

			<div class="mt-6 grid grid-cols-3 gap-x-2 gap-y-3 items-center">
				<NuxtLink v-for="{ name, slug, chapters } in weekHots" :to="`/manga/${slug}`" append>
					<HomeHotManga class="mx-auto" :slug="slug" :name="name" :info="chapters[0].infos" />
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
