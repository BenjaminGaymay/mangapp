<template>
	<div>
		<slot name="header" />

		<div :class="{ 'px-4 pt-4': !noPadding }">
			<slot v-if="!pending" />
			<UiLoader v-else />
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
