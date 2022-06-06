<template>
	<div class="manga relative" :class="{ size: fixed }">
		<img class="rounded" :src="imgUri" />

		<div
			:class="fixed ? 'mt-1 text-sm' : 'mt-2 text-md'"
			class="text-center whitespace-nowrap overflow-hidden overflow-ellipsis"
		>
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

	fixed: {
		type: Boolean,
		default: false
	}
});

const imgUri = computed((): string => `https://japscan.ws/imgs/mangas/${props.slug}.jpg`);
</script>

<style lang="scss" scoped>
.manga {
	&.size {
		width: 8rem;
	}

	& > img {
		object-fit: cover;
		width: 100%;
	}
}
</style>
