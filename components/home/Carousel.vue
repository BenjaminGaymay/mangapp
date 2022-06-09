<template>
	<div class="w-full overflow-x-auto flex flex-nowrap items-start gap-x-5">
		<slot />
	</div>
</template>

<script setup>
const emit = defineEmits(['loaded']);

onMounted(() => {
	emit('loaded', true);
});
</script>
