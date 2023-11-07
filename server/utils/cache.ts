import cloudscraper from 'cloudflare-scraper';

// import { clearString } from '~~/server/utils/string';
// import {
// 	homeManga,
// 	homeChapters,
// 	homeV1,
// 	homeV2,
// 	homeChapterName,
// 	homeChapterNumber,
// 	homeTrend,
// 	homeTrendGroup
// } from '~/server/utils/regex/home';

let MangaCache: HomeManga[][] | null = null;
let TrendsCache: Trends[] | null = null;

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
	if (MangaCache === null) {
		const page: string = await fetchHomePage();
		const manga: HomeManga[][] = parseHomePage(page);
		const trends: Trends[] = parseTrends(page);

		updateMangaCache(manga);
		updateTrendsCache(trends);
	}

	if (!MangaCache) return [];
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
	const response = await cloudscraper.get('https://www.japscan.lol');
	return clearString(response.body);
}

function parseHomePage(text: string): HomeManga[][] {
	const regex: RegExp[] = text.includes('id="tab-1"') ? homeV1 : homeV2;

	const days: HomeManga[][] = regex.map(r => {
		const match = text.match(r);
		if (match && match.length > 0) return parseDailyManga(findDailyManga(match[0]));
		return [];
	});

	return days;
}

function findDailyManga(day: string): RegExpMatchArray[] {
	return [...day.matchAll(homeManga)];
}

function parseDailyManga(mangaList: RegExpMatchArray[]): HomeManga[] {
	return mangaList.map(manga => {
		const [regexed] = manga;
		// console.log(manga.includes('fa-fire-flame'));

		// const [manga, slug, name]: string[] = m;

		// console.log(slug, name, manga);

		return {
			slug: regexed.match(/<a href="\/manga\/(.+?)\/?"/)?.at(1) || '',
			name: regexed.match(/title="(.+?)"/)?.at(1) || '',
			isHot: regexed.includes('fa-fire-flame') || undefined,
			chapters: parseMangaChapters(regexed.split('<div class="col-md-5">')[2])
		};
	});
}

function parseMangaChapters(manga: string): Chapter[] {
	return [...manga.matchAll(homeChapters)].map(([, href, cName, , , infos]) => {
		// const [, name]: string[] = cName.match(homeChapterName) || [];
		const [, number]: string[] = href.match(homeChapterNumber) || [];
		const isVolume: boolean = number.includes('volume');

		return {
			href: href.replace('/lecture-en-ligne/', '/manga/'),
			name: cName,
			number: parseFloat(number.replace('volume-', '')),
			isVolume,
			infos: undefined // infos?.length > 10 ? undefined : infos
		};
	});
}

function parseTrends(text: string): Trends[] {
	const [_day, week, _year]: RegExpMatchArray[] = [...text.matchAll(homeTrendGroup)];
	const trends: Trends[] = [...week[0].matchAll(homeTrend)].map(([, slug, name]) => ({ slug, name }));

	return trends;
}

function updateMangaCache(update: HomeManga[][]) {
	MangaCache = update;
	// console.log(update);

	setTimeout(() => (MangaCache = null), 180000);
}

function updateTrendsCache(update: Trends[]) {
	TrendsCache = update;
	setTimeout(() => (TrendsCache = null), 180000);
}
