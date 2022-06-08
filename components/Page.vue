<template>
	<div>
		<slot name="header" />

		<div :class="{ 'px-4 pt-4': !noPadding }">
			<template v-if="!pending">
				<slot />
			</template>

			<template v-else>
				<div class="flex items-center justify-center h-screen w-screen absolute inset-0">CHARGEMENT</div>
			</template>
		</div>

		<slot name="footer" />
	</div>
</template>

<script lang="ts" setup>
defineProps({
	noPadding: {
		type: Boolean,
		default: false
	},

	pending: {
		type: Boolean,
		default: false
	}
});
</script>
