<template>
	<div class="infos">
		<div class="flex flex-nowrap gap-x-2">
			<div class="infos-img overflow-hidden">
				<img class="rounded" :src="infos.img" />

				<div class="absolute bottom-1 left-1 z-10">
					<div class="text-xs">{{ infos.type }}</div>
					<div class="text-sm">{{ infos.author }}</div>
				</div>
			</div>

			<div class="infos-others text-right text-sm flex flex-col justify-between py-3 px-1 rounded-l-md">
				<div>
					<div>Depuis {{ infos.date }}</div>
					<div>Volume {{ infos.volume }} ~ {{ infos.status }}</div>
					<div v-if="infos.isAnime" class="mt-2">Disponible en animé</div>
				</div>

				<div class="infos-tags grid grid-cols-3 w-full gap-y-2">
					<div v-for="genre in infos.genre">{{ genre }}</div>
				</div>
			</div>
		</div>

		<div class="infos-text text-xs text-justify px-4 mt-3 py-3 rounded-b-lg">{{ infos.synopsis }}</div>
	</div>
</template>

<script lang="ts" setup>
defineProps({
	infos: {
		type: Object,
		required: true
	}
});
</script>

<style lang="scss" scoped>
.infos {
	&-img {
		position: relative;
		min-width: 50%;
		max-width: 50%;

		& > img {
			object-fit: contain;
		}

		&::after {
			content: '';

			position: absolute;
			inset: 0;

			background-image: linear-gradient(180deg, transparent, black);
		}
	}

	&-tags {
		color: #5dd1ff;
		font-size: 0.6rem;
		line-height: 0.65rem;
		text-align: center;
	}

	&-text {
		background-image: linear-gradient(180deg, transparent, rgba(0, 0, 0, 0.6));
	}

	&-others {
		// background-image: linear-gradient(-90deg, transparent, rgba(14, 3, 14, 0.6));
	}
}
</style>
