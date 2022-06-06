<template>
	<div class="chapter px-4 py-2 rounded-lg flex flex-nowrap justify-between items-center" :class="{ read, dl }">
		<div>
			<div>{{ chapter.isVolume ? 'Volume' : 'Chapitre' }} {{ chapter.number }}</div>
			<div class="whitespace-nowrap text-xs">{{ date }}</div>
		</div>

		<div
			class="w-6 h-6 rounded-full border border-purple-500"
			:class="{ 'bg-purple-500': selected || dl }"
			@click="store.toggleDl(id)"
		></div>
	</div>
</template>

<script lang="ts" setup>
import { get } from 'idb-keyval';
import { useDownloads } from '~/store/downloads';

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

const store = useDownloads();

const id = ref(JSON.stringify({ slug: props.slug, number: props.chapter.number }));
const key: string = `${props.slug}-${props.chapter.number}`;
const read = ref(false);
const dl = ref(false);
const selected = computed((): boolean => store.dlList.has(id.value));

onMounted(async () => {
	const history = await get<DBHistory>(`[history]:${key}`);
	if (history && history.read === true) read.value = true;

	if (await get(`[chapter]:${key}`)) dl.value = true;
});

const formatter = new Intl.DateTimeFormat('fr-FR', { year: 'numeric', month: 'short', day: '2-digit' }).format;
const date = computed((): string => formatter(new Date(props.chapter.date)));
</script>

<style lang="scss" scoped>
.chapter {
	background: rgba(0, 0, 0, 0.5);

	&.read {
		background: rgba(85, 85, 85, 0.5);
	}

	&.dl {
		position: relative;

		&::after {
			content: '';
			position: absolute;
			inset: 0;

			background: rgba(0, 0, 0, 0.575);
			@apply rounded-lg;
		}
	}
}

.badge {
	@apply bg-red-400 px-2 py-1 rounded;
	box-shadow: inset -2px -2px 10px 3px rgba(0, 0, 0, 0.5);
}
</style>
