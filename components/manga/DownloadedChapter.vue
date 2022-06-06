<template>
	<NuxtLink :to="`/telechargements/${slug}/${infos.number}`">
		<div class="chapter px-4 py-2 rounded-lg flex flex-nowrap justify-between items-center" :class="{ read }">
			<div>
				<div class="text-xs">{{ infos.manga }}</div>
				<div>{{ infos.isVolume ? 'Volume' : 'Chapitre' }} {{ infos.number }}</div>
			</div>
			<div
				class="w-6 h-6 rounded-full border border-purple-500 z-10"
				:class="{ 'bg-purple-500': selected }"
				@click.stop.prevent="store.toggleRm(id)"
			></div>
		</div>
	</NuxtLink>
</template>

<script lang="ts" setup>
import { get } from 'idb-keyval';
import { useDownloads } from '~/store/downloads';

const props = defineProps({
	infos: {
		type: Object,
		required: true
	},

	slug: {
		type: String,
		required: true
	},

	id: {
		type: String,
		required: true
	}
});

const store = useDownloads();

const read = ref(false);
const selected = computed((): boolean => store.rmList.has(props.id));

onMounted(async () => {
	const history = await get<DBHistory>(`[history]:${props.id}`);
	if (history && history.read === true) read.value = true;
});
</script>

<style lang="scss" scoped>
.chapter {
	background: rgba(0, 0, 0, 0.5);

	&.read {
		background: rgba(85, 85, 85, 0.5);
	}
}

.badge {
	@apply bg-red-400 px-2 py-1 rounded;
	box-shadow: inset -2px -2px 10px 3px rgba(0, 0, 0, 0.5);
}
</style>
