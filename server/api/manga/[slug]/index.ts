import cloudscraper from 'cloudflare-scraper';

async function fetchMangaPage(slug: string): Promise<string> {
	const response = await fetch(`https://www.japscan.lol/manga/${slug}/`);
	if (!response.ok) return null;

	const text = await response.text();
	return clearString(text);
}

async function getMangaData(slug: string): Promise<Manga> {
	const page: string = await fetchMangaPage(slug);

	const data: MangaData = Object.keys(rManga).reduce((acc, key: string) => {
		const [, match]: string[] = page.match(rManga[key]) || [];

		if (key === 'img') acc[key] = `https://japscan.lol${match}`;
		else if (key === 'genre') acc[key] = match?.trim()?.split(', ');
		else if (key === 'isAnime') acc[key] = Boolean(match === 'OUI');
		else if (key === 'volume') acc[key] = parseFloat(match);
		else acc[key] = match?.trim();

		return acc;
	}, {} as MangaData);

	const parsed: Chapter[] = [...page.matchAll(mangaChapters)].map(([chapter]: string[]): Chapter => {
		const [, date]: string[] = chapter.match(mangaDate) || [];
		const [, href]: string[] = chapter.match(mangaHref) || [];
		const [, name]: string[] = chapter.match(mangaName) || [];
		const [, infos]: string[] = name?.match(mangaInfos) || [];
		const [, number]: string[] = href.match(homeChapterNumber) || [];
		const isVolume: boolean = number.includes('volume');

		return {
			href: href.replace('/lecture-en-ligne/', '/manga/').replace(/\/$/, ''),
			name: name?.includes('<span') ? undefined : name?.trim(),
			number: parseFloat(number.replace('volume-', '')),
			isVolume,
			date,
			infos
		};
	});

	return { ...data, chapters: parsed };
}

export default defineEventHandler(async (event): Promise<Manga | undefined> => {
	const slug: string = event.context.params?.slug || '';

	try {
		return await getMangaData(slug);
	} catch (e: any) {
		console.error('error: getMangaData:', e?.message || e?.stack || e);
	}
});
