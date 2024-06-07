export async function fetchFirstPage(slug: string, chapter: string): Promise<string> {
	let headers = await bypassOptions(`https://www.japscan.lol/lecture-en-ligne/${slug}/${chapter}/`);
	if (!headers) throw 'bypass failed';

	let response = await fetch(`https://www.japscan.lol/lecture-en-ligne/${slug}/${chapter}/`, { headers });
	if (!response.ok) {
		headers = await bypassOptions(`https://www.japscan.lol/lecture-en-ligne/${slug}/${chapter}/`, true);
		if (!headers) throw 'bypass failed';

		let response = await fetch(`https://www.japscan.lol/lecture-en-ligne/${slug}/${chapter}/`, { headers });
		if (!response.ok) throw 'request failed';
	}

	const text = await response.text();
	return clearString(text);
}

const exclude = [
	'https://c3.japscan.lol/214258e9379993f903696879515977a9d0e99589f32967e25309d999a1f932826549779233c9c8f957a2f282a/43986d909025859960977e9383214d98149e852f07284399112e7627232c712231997123dc9613208036173b0/5307221e32830295b239139f8933b29e42f6e3eed8674926495f8827795fe8eeb087b069503961264157e03a9/09ff8.png',
	'https://www.japscan.lol/imgs/japs/01_1200x2000_banner_fr.jpg',
	'https://www.japscan.lol/imgs/japs/02_1200x2000_banner_fr.jpg',
	'https://www.japscan.lol/imgs/japs/03_1200x2000_banner_fr.jpg',
	'https://www.japscan.lol/imgs/japo/reader.jpg',
	'https://www.japscan.lol/imgs/japo/reader_1.jpg'
];

async function getChapterPages(slug: string, chapter: string): Promise<ChapterPages> {
	const page: string = await fetchFirstPage(slug, chapter);

	const [, cypher] = page.match(/<i.+?data-atad="(.+?)"/) || [null, ''];
	const { imagesLink: pages } = await decodeCypher(cypher);

	const [, name]: string[] = page.match(chapterName) || [];

	const [, manga]: string[] = page.match(chapterManga(slug)) || [];

	const [, next]: string[] = page.match(chapterNext) || [];
	const [, previous]: string[] = page.match(chapterPrevious) || [];

	const infos = {
		name: name?.split('Attention :')[0],
		manga,
		number: parseFloat(chapter.replace('volume-', '')),
		isVolume: chapter.includes('volume') || false,
		next: next?.replace('/lecture-en-ligne/', '/manga/')?.replace(/\/$/, ''),
		previous: previous?.replace('/lecture-en-ligne/', '/manga/')?.replace(/\/$/, '')
	};

	return { ...infos, pages: pages.filter(e => !exclude.includes(e)) };
}

export default defineEventHandler(async (event): Promise<ChapterPages | undefined> => {
	const slug: string = event.context.params?.slug || '';
	const chapter: string = event.context.params?.chapter || '';

	try {
		return await getChapterPages(slug, chapter);
	} catch (e: any) {
		console.error('error: getChapterPages:', e?.message || e?.stack || e);
	}
});
