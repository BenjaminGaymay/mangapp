import { getWeeklyChapters } from '~~/server/utils/cache';

export default defineEventHandler(async (): Promise<HomeManga[]> => getWeeklyChapters());
