import { clearString } from '~~/server/utils/string';
import {
	rManga,
	rChapters,
	rHomeV1,
	rHomeV2,
	rChapterName,
	rChapterNumber,
	rTrend,
	rTrendGroup
} from '~~/server/utils/regex/home';

let MangaCache: HomeManga[][] = null;
let TrendsCache: Trends[] = null;

export async function getDailyChapters(index: number): Promise<HomeManga[]> {
	if (MangaCache && MangaCache[index]) return MangaCache[index];

	const page: string = await fetchHomePage();
	const manga: HomeManga[][] = parseHomePage(page);
	const trends: Trends[] = parseTrends(page);

	updateMangaCache(manga);
	updateTrendsCache(trends);

	return manga[index];
}

export async function getWeeklyChapters(): Promise<HomeManga[]> {
	if (!MangaCache) {
		const page: string = await fetchHomePage();
		const manga: HomeManga[][] = parseHomePage(page);
		const trends: Trends[] = parseTrends(page);

		updateMangaCache(manga);
		updateTrendsCache(trends);
	}

	const wManga: HomeManga[] = [];

	for (const day of MangaCache) {
		day.map(e => {
			const index = wManga.findIndex(m => m.slug === e.slug);
			if (index === -1) wManga.push(e);
			else {
				wManga[index] = {
					slug: e.slug,
					name: e.name,
					isHot: e.isHot || wManga[index].isHot,
					chapters: [...e.chapters, ...wManga[index].chapters]
				};
			}
		});
	}

	return wManga;
}

export async function getWeeklyTrends(): Promise<Trends[]> {
	if (TrendsCache) return TrendsCache;

	const page: string = await fetchHomePage();
	const manga: HomeManga[][] = parseHomePage(page);
	const trends: Trends[] = parseTrends(page);

	updateMangaCache(manga);
	updateTrendsCache(trends);

	return trends;
}

async function fetchHomePage(): Promise<string> {
	const response: Response = await fetch('https://www.japscan.ws');
	const text: string = await response.text();

	return clearString(text);
}

function parseHomePage(text: string): HomeManga[][] {
	const regex: RegExp[] = text.includes('id="tab-1"') ? rHomeV1 : rHomeV2;

	const days: HomeManga[][] = regex.map(r => {
		const [match] = text.match(r);
		return parseDailyManga(findDailyManga(match));
	});

	return days;
}

function findDailyManga(day: string): RegExpMatchArray[] {
	return [...day.matchAll(rManga)];
}

function parseDailyManga(mangaList: RegExpMatchArray[]): HomeManga[] {
	return mangaList.map(m => {
		const [manga, slug, name]: string[] = m;

		return {
			slug,
			name,
			isHot: manga.includes('>Hot<') || undefined,
			chapters: parseMangaChapters(manga)
		};
	});
}

function parseMangaChapters(manga: string): Chapter[] {
	return [...manga.matchAll(rChapters)].map(([, href, cName, , , infos]) => {
		const [, name]: string[] = cName.match(rChapterName) || [];
		const [, number]: string[] = href.match(rChapterNumber) || [];
		const isVolume: boolean = number.includes('volume') || undefined;

		return {
			href: href.replace('/lecture-en-ligne/', '/manga/'),
			name,
			number: parseFloat(number.replace('volume-', '')),
			isVolume,
			infos
		};
	});
}

function parseTrends(text: string): Trends[] {
	const [_day, week, _year]: RegExpMatchArray[] = [...text.matchAll(rTrendGroup)];
	const trends: Trends[] = [...week[0].matchAll(rTrend)].map(([, slug, name]) => ({ slug, name }));

	return trends;
}

function updateMangaCache(update: HomeManga[][]) {
	MangaCache = update;
	setTimeout(() => (MangaCache = null), 180000);
}

function updateTrendsCache(update: Trends[]) {
	TrendsCache = update;
	setTimeout(() => (TrendsCache = null), 180000);
}
