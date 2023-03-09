<template>
	<div class="manga relative flex flex-col items-center gap-2" :class="{ size: fixed }">
		<img class="flex-grow rounded" :src="`/api/image/manga/${props.slug}`" />

		<div v-if="info" class="badge absolute top-1 right-1">
			{{ info }}
		</div>

		<div class="manga-name w-full overflow-hidden overflow-ellipsis whitespace-nowrap text-center text-sm">
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
		@apply rounded bg-blue-300 px-1.5 py-1 text-sm;
		box-shadow: inset -2px -2px 10px 3px rgba(0, 0, 0, 0.5);
	}
}
</style>
