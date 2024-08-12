import { parse } from 'node-html-parser';

async function fetchMangaPage(slug: string): Promise<string | null> {
	const response = await fetch(`https://www.japscan.lol/manga/${slug}/`);
	if (!response.ok) return null;

	const text = await response.text();
	return clearString(text);
}

async function getMangaData(slug: string): Promise<Manga | null> {
	const page = await fetchMangaPage(slug);
	if (!page) return null;

	const parsed = parse(page);

	const main = parsed.querySelector('#main');
	if (!main) return null;

	const title = main.querySelector('h1')?.text;
	const img = main.querySelector('img')?.getAttribute('src');
	const synopsis = main.querySelector('#synopsis')?.text?.replace('Synopsis:', '')?.trim();

	const basics = { title, img, synopsis } as MangaData;

	const keys = Object.keys(rManga) as (keyof typeof rManga)[];
	const data = keys.reduce((acc, key) => {
		const [, match]: string[] = main.innerHTML.match(rManga[key]) || [];

		switch (key) {
			case 'genre':
				acc[key] = match?.trim()?.split(', ');
				break;
			case 'isAnime':
				acc[key] = Boolean(match === 'OUI');
				break;
			case 'volume':
				acc[key] = parseFloat(match);
				break;

			default:
				acc[key] = match?.trim();
				break;
		}

		return acc;
	}, basics);

	const chapters = main.querySelectorAll('.chapters_list').map(chapter => {
		const date = chapter.querySelector('span.float-right')?.text;
		const href = chapter.querySelector('a')?.getAttribute('href') || '';

		const number = href.split('/').at(-2) || '';
		const parsedNumber = parseFloat(number.replace('volume-', ''));

		const isVolume = number.includes('volume');

		let name = chapter.querySelector('a')?.text;
		if (name) {
			const key = `${isVolume ? 'Volume' : 'Chapitre'} ${parsedNumber}`;

			name = name.replace(`${key}:`, '');
			name = name.replace(key, '');
		}

		const infos = chapter.querySelector('a > span')?.text;
		if (infos && name) {
			name = name.replace(infos, '');
		}

		return {
			href: href?.replace('/lecture-en-ligne/', '/manga/').replace(/\/$/, ''),
			number: parsedNumber,
			name: name?.trim(),
			isVolume,
			date,
			infos
		};
	});

	return { ...data, chapters };
}

export default defineEventHandler(async (event): Promise<Manga | null> => {
	const slug: string = event.context.params?.slug || '';

	try {
		return await getMangaData(slug);
	} catch (e: any) {
		console.error('error: getMangaData:', e?.message || e?.stack || e);
	}

	return null;
});
