import { getDailyChapters } from '~~/server/utils/cache';

export default defineEventHandler(async (event): Promise<HomeManga[]> => {
	const index: number = +event.context.params.index || 0;
	if (index < 0 || index > 7) return null;

	return getDailyChapters(index);
});
