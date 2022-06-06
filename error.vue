<template>
	<NuxtLayout name="mobile">
		<Head>
			<Title>{{ error.message }}</Title>
		</Head>

		<div class="text-lg flex items-center justify-center h-full gap-y-2 flex-wrap">
			<div class="text-2xl">{{ error.message }}</div>
		</div>
	</NuxtLayout>
</template>

<script setup>
const props = defineProps({
	error: Object
});
</script>
