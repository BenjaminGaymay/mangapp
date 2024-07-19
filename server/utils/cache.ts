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
	const response = await fetch('https://www.japscan.lol');
	if (!response.ok) throw 'request failed';

	const text = await response.text();

	return clearString(text);
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
	return mangaList.map((manga, i) => {
		const [regexed] = manga;

		return {
			slug: regexed.match(/<a href="\/manga\/(.+?)\/?"/)?.at(1) || '',
			name: regexed.match(/title="(.+?)"/)?.at(1) || '',
			isHot: regexed.includes('Top') || undefined,
			chapters: parseMangaChapters(regexed.split(/<div class="col-md-5( donate)?">/).at(-1))
		};
	});
}

function parseMangaChapters(manga: string): Chapter[] {
	return [...manga.matchAll(homeChapters)].map(([, href, cName, , , infos]) => {
		console.log(href, cName, infos);

		const [, number]: string[] = href.match(homeChapterNumber) || [];
		const isVolume: boolean = number.includes('volume');

		return {
			href: href.replace('/lecture-en-ligne/', '/manga/'),
			name: cName,
			number: parseFloat(number.replace('volume-', '')),
			isVolume,
			infos: undefined
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

	setTimeout(() => (MangaCache = null), 180000);
}

function updateTrendsCache(update: Trends[]) {
	TrendsCache = update;
	setTimeout(() => (TrendsCache = null), 180000);
}
