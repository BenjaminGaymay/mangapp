import { parse, type HTMLElement } from 'node-html-parser';

let MangaCache: HomeManga[][] | null = null;
let TrendsCache: Trends[] | null = null;

export async function getDailyChapters(index: number) {
	if (MangaCache && MangaCache[index]) return MangaCache[index];

	const page: string = await fetchHomePage();
	const parsed = parse(page);

	const manga: HomeManga[][] = parseHomePage(parsed);
	const trends: Trends[] = parseTrends(parsed);

	updateMangaCache(manga);
	updateTrendsCache(trends);

	return manga[index];
}

export async function getWeeklyChapters() {
	if (MangaCache === null) {
		const page: string = await fetchHomePage();
		const parsed = parse(page);

		const manga: HomeManga[][] = parseHomePage(parsed);
		const trends: Trends[] = parseTrends(parsed);

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

export async function getWeeklyTrends() {
	if (TrendsCache) return TrendsCache;

	const page: string = await fetchHomePage();

	const parsed = parse(page);

	const manga: HomeManga[][] = parseHomePage(parsed);
	const trends: Trends[] = parseTrends(parsed);

	updateMangaCache(manga);
	updateTrendsCache(trends);

	return trends;
}

async function fetchHomePage() {
	const response = await fetch('https://www.japscan.lol');
	if (!response.ok) throw 'request failed';

	const text = await response.text();

	return clearString(text);
}

function parseHomePage(page: HTMLElement): HomeManga[][] {
	const tabs = Array.from(page.querySelectorAll('.tab-pane.container').values());

	return tabs.map(tab => {
		const mangaList = Array.from(tab.querySelectorAll(':scope > .row').values());
		return mangaList.map(manga => parseSingleManga(manga));
	});
}

function parseSingleManga(manga: HTMLElement): HomeManga {
	const link = manga.querySelector('a');

	const href = link?.getAttribute('href') || '';
	const title = link?.getAttribute('title') || '';

	const isHot = Boolean(manga.querySelector('img[alt="Top 10"], img[alt="Top 100"], img[alt="Top 500"]'));

	return {
		slug: href.split('/').at(-2) || '',
		name: title,
		isHot,
		chapters: parseSingleMangaChapters(manga)
	};
}

function parseSingleMangaChapters(manga: HTMLElement): Chapter[] {
	const chapters = manga.querySelector('.chapter-list');
	const links = Array.from(chapters?.querySelectorAll('a')?.values() || []);

	return links.map(link => {
		const href = link.getAttribute('href') || '';
		const title = link.getAttribute('title') || '';
		const number = href.split('/').at(-2) || '';

		return {
			href: href.replace('/lecture-en-ligne/', '/manga/'),
			name: title,
			number: parseFloat(number.replace('volume-', '')),
			isVolume: number.includes('volume'),
			infos: link.querySelector('span.badge')?.innerText || undefined
		};
	});
}

function parseTrends(page: HTMLElement): Trends[] {
	const panel = page.querySelector('#top_mangas_week');
	const trends = Array.from(panel?.querySelectorAll('li a[href^="/manga/"][title]') || []);

	return trends.map(trend => ({
		slug: trend.getAttribute('href')?.split('/')?.at(-2) || '',
		name: trend.getAttribute('title') || ''
	}));
}

function updateMangaCache(update: HomeManga[][]) {
	MangaCache = update;

	setTimeout(() => (MangaCache = null), 180000);
}

function updateTrendsCache(update: Trends[]) {
	TrendsCache = update;
	setTimeout(() => (TrendsCache = null), 180000);
}
