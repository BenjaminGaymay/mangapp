<template>
	<div class="manga relative flex flex-col items-center gap-2" :class="{ size: fixed }">
		<img class="rounded flex-grow" :src="imgUri" />

		<div v-if="info" class="absolute top-1 right-1 badge">
			{{ info }}
		</div>

		<div class="manga-name text-center whitespace-nowrap overflow-hidden overflow-ellipsis w-full text-sm">
			{{ name }}
		</div>
	</div>
</template>

<script lang="ts" setup>
const props = defineProps({
	slug: {
		type: String,
		required: true
	},

	name: {
		type: String,
		default: null
	},

	info: {
		type: String,
		default: null
	},

	fixed: {
		type: Boolean,
		default: false
	}
});

const imgUri = computed((): string => `https://japscan.ws/imgs/mangas/${props.slug}.jpg`);
</script>

<style lang="scss" scoped>
.manga {
	min-height: 9rem;

	&.size {
		width: 8rem;
		height: 12rem;
	}

	& > img {
		object-fit: cover;
		width: 100%;
		height: calc(100% - 1.2rem);
	}

	&-name {
		margin-top: -0.4rem;
	}

	.badge {
		@apply bg-blue-300 px-1.5 py-1 rounded text-sm;
		box-shadow: inset -2px -2px 10px 3px rgba(0, 0, 0, 0.5);
	}
}
</style>
