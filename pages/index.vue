<template>
	<NuxtLayout name="mobile">
		<Head>
			<Title>Acceuil</Title>
		</Head>

		<Page>
			<div class="flex items-center justify-between flex-nowrap">
				<PageTitle>Sorties du jour</PageTitle>

				<div class="w-4 transform rotate-180">
					<NuxtLink to="/semaine">
						<img src="~/assets/svg/arrow/line.svg" />
					</NuxtLink>
				</div>
			</div>

			<HomeCarousel class="mt-6">
				<NuxtLink v-for="{ name, slug } in todayHots" :to="`/manga/${slug}`" append>
					<HomeHotManga :slug="slug" :name="name" :fixed="true" />
				</NuxtLink>
			</HomeCarousel>

			<PageTitle class="pt-6">Tendances de la semaine</PageTitle>

			<div class="mt-8 grid grid-cols-6 gap-7 items-center">
				<div v-for="({ name, slug }, i) in trends" class="relative col-span-2" :class="{ 'col-span-3': i < 2 }">
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

const { data: tData } = await useFetch<HomeManga[]>(`/api/home/day/${day}`);
const today: HomeManga[] = tData.value;

const todayHots = computed(() => today.filter(m => m.isHot));

const { data: wData } = await useFetch<Trends[]>('/api/home/trends');
const trends: Trends[] = wData.value;
</script>

<style lang="scss" scoped>
.badge {
	box-shadow: inset 2px 2px 10px 3px rgba(129, 2, 112, 0.3);
}
</style>
