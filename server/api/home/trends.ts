import { getWeeklyTrends } from '~~/server/utils/cache';

export default defineEventHandler(async (): Promise<Trends[]> => getWeeklyTrends());
