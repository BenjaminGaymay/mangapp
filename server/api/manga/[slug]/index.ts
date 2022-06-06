import { rChapterNumber } from '~~/server/utils/regex/home';
import { rManga, rChapters, rDate, rHref, rInfos, rName } from '~~/server/utils/regex/manga';
import { clearString } from '~~/server/utils/string';

async function fetchMangaPage(slug: string): Promise<string> {
	const response: Response = await fetch(`https://www.japscan.ws/manga/${slug}/`);
	const text: string = await response.text();

	return clearString(text);
}

async function getMangaData(slug: string): Promise<Manga> {
	const page: string = await fetchMangaPage(slug);

	const data: MangaData = Object.keys(rManga).reduce((acc, key) => {
		const [, match]: string[] = page.match(rManga[key]) || [];

		if (key === 'img') acc[key] = `https://japscan.ws${match}`;
		else if (key === 'genre') acc[key] = match?.trim()?.split(', ');
		else if (key === 'isAnime') acc[key] = Boolean(match === 'OUI');
		else if (key === 'volume') acc[key] = parseFloat(match);
		else acc[key] = match?.trim();

		return acc;
	}, {});

	const parsed: Chapter[] = [...page.matchAll(rChapters)].map(([chapter]: string[]): Chapter => {
		const [, date]: string[] = chapter.match(rDate);
		const [, href]: string[] = chapter.match(rHref);
		const [, name]: string[] = chapter.match(rName) || [];
		const [, infos]: string[] = name?.match(rInfos) || [];
		const [, number]: string[] = href.match(rChapterNumber) || [];
		const isVolume: boolean = number.includes('volume') || undefined;

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

export default defineEventHandler(async (event): Promise<Manga> => {
	const slug: string = event.context.params.slug;

	return getMangaData(slug);
});
