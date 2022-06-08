<template>
	<div class="h-screen w-screen text-white font-sm" style="background-color: #090112">
		<main class="w-full">
			<slot />
		</main>
	</div>
</template>

<script setup lang="ts">
import { useIdb } from '~~/store/idb';

const { refreshAll } = useIdb();
onMounted(refreshAll);
</script>

<style lang="scss" scoped></style>
