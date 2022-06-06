<template>
	<NuxtLink :to="chapter.href">
		<div class="chapter px-4 py-2 rounded-lg" :class="{ read }">
			<div class="flex items-center justify-between">
				<div>{{ chapter.isVolume ? 'Volume' : 'Chapitre' }} {{ chapter.number }}</div>

				<div v-if="chapter.infos" class="text-sm">{{ chapter.infos }}</div>
				<div v-else-if="isToday" class="whitespace-nowrap badge text-xs font-semibold">Nouveau !</div>
			</div>

			<div class="flex items-center justify-between text-xs gap-x-3">
				<div class="whitespace-nowrap overflow-hidden overflow-ellipsis text-fuchsia-300 opacity-80">
					{{ chapter.name }}
				</div>
				<div v-if="!isToday" class="whitespace-nowrap">{{ date }}</div>
			</div>
		</div>
	</NuxtLink>
</template>

<script lang="ts" setup>
import { get } from 'idb-keyval';

const props = defineProps({
	chapter: {
		type: Object,
		required: true
	},

	slug: {
		type: String,
		required: true
	}
});

const historyKey: string = `[history]:${props.slug}-${props.chapter.number}`;
const read = ref(false);

onMounted(async () => {
	const history = await get<DBHistory>(historyKey);
	if (history && history.read === true) read.value = true;
});

const dateRef = new Date();
const formatter = new Intl.DateTimeFormat('fr-FR', { year: 'numeric', month: 'short', day: '2-digit' }).format;

const today: string = formatter(dateRef);
dateRef.setDate(dateRef.getDate() - 1);
const yesterday: string = formatter(dateRef);

const date = computed((): string => formatter(new Date(props.chapter.date)));
const isToday = computed((): boolean => today === date.value || yesterday === date.value);
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
