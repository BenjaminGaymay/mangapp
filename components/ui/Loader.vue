<template>
	<div class="absolute inset-0 h-full w-full" :style="{ backgroundColor: props.bg }">
		<div class="loader relative left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 transform">
			<div v-for="i in 5" :key="i" class="absolute top-0 left-0 right-0 bottom-0"></div>
		</div>
	</div>
</template>

<script setup lang="ts">
const props = defineProps({
	bg: {
		type: String,
		default: null
	}
});
</script>

<style lang="scss" scoped>
.loader {
	@keyframes rotate {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	div {
		animation: rotate 1.3s cubic-bezier(0.5, 0, 0.5, 1) infinite;

		&::after {
			content: '';

			position: absolute;
			height: 0.5rem;
			width: 0.5rem;
			border-radius: 0.5rem;
			background: #a556ca;
		}

		&:nth-child(1) {
			&::after {
				top: 0.5rem;
				left: 0rem;
			}
		}

		&:nth-child(2) {
			animation-delay: -0.07s;
			&::after {
				top: 0.15rem;
				left: 0.42rem;
			}
		}

		&:nth-child(3) {
			animation-delay: -0.14s;
			&::after {
				top: 0;
				left: 1rem;
			}
		}

		&:nth-child(4) {
			animation-delay: -0.21s;
			&::after {
				top: 0.15rem;
				left: 1.58rem;
			}
		}

		&:nth-child(5) {
			animation-delay: -0.28s;
			&::after {
				top: 0.5rem;
				left: 2rem;
			}
		}
	}
}
</style>
