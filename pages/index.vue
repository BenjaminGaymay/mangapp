<template>
	<NuxtLayout name="mobile">
		<Head>
			<Title>Acceuil</Title>
		</Head>

		<Page>
			<div class="flex items-center justify-between flex-nowrap mb-6">
				<PageTitle>Sorties du jour</PageTitle>

				<div class="w-4 transform rotate-180">
					<NuxtLink to="/semaine">
						<img src="~/assets/svg/arrow/line.svg" />
					</NuxtLink>
				</div>
			</div>

			<div v-if="!tLoaded || !Boolean(todayHots)" class="relative h-48 mb-3 overflow-y-visible"><UiLoader /></div>
			<HomeCarousel v-show="tLoaded && Boolean(todayHots)" @loaded="tLoaded = true" class="pb-3">
				<NuxtLink v-for="{ name, slug, chapters } in todayHots" :to="`/manga/${slug}`">
					<HomeHotManga :slug="slug" :name="name" :fixed="true" :info="chapters[0].infos" />
				</NuxtLink>
			</HomeCarousel>

			<PageTitle class="pt-3 mb-8">Tendances de la semaine</PageTitle>

			<div v-if="!Boolean(trends)" class="relative h-48"><UiLoader /></div>
			<div v-show="Boolean(trends)" class="grid grid-cols-6 gap-x-2 gap-y-3 items-center">
				<div
					v-for="({ name, slug }, i) in trends"
					class="relative col-span-2"
					:class="{ 'col-span-3 mx-1': i < 2 }"
				>
					<NuxtLink :to="`/manga/${slug}`" append>
						<HomeHotManga class="mx-auto" :slug="slug" :name="name" />

						<div class="badge absolute bg-fuchsia-300 text-md top-1.5 left-1.5 rounded w-9 text-center">
							{{ i + 1 }}
						</div>
					</NuxtLink>
				</div>
			</div>
		</Page>
	</NuxtLayout>
</template>

<script setup lang="ts">
const day = 0;
const tLoaded = ref(false);

const { data: tData } = useLazyFetch<HomeManga[]>(`/api/home/day/${day}`);
const todayHots = ref((tData && tData.value ? tData.value.filter(m => m.isHot) : []) as HomeManga[]);

watch(tData, value => {
	todayHots.value = value?.filter(m => m.isHot) || [];
});

const { data: wData } = useLazyFetch<Trends[]>('/api/home/trends');
const trends = ref(wData.value as Trends[]);

watch(wData, value => {
	trends.value = value || [];
});

onMounted(() => {
	refreshNuxtData();
});
</script>

<style lang="scss" scoped>
.badge {
	box-shadow: inset 2px 2px 10px 3px rgba(129, 2, 112, 0.3);
}
</style>
