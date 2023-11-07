import cloudscraper from 'cloudflare-scraper';
// import { fetchURL } from '~/server/utils/scraper';

// import { decodeCypher } from '~~/server/utils/cypher';
// import { chapterName, chapterManga, chapterNext, chapterPrevious } from '~~/server/utils/regex/chapter';

// import { clearString } from '~~/server/utils/string';

export async function fetchFirstPage(slug: string, chapter: string): Promise<string> {
	const abortController = new AbortController();
	const timeout = setTimeout(() => abortController.abort(), 25000);

	const response = await cloudscraper.get(`https://www.japscan.lol/lecture-en-ligne/${slug}/${chapter}/`, {
		signal: abortController.signal
	});

	clearTimeout(timeout);
	return clearString(response.body);
	// const response = await fetchURL(`https://www.japscan.lol/lecture-en-ligne/${slug}/${chapter}/`);
	// return clearString(response);
}

const exclude = [
	'https://c3.japscan.lol/214258e9379993f903696879515977a9d0e99589f32967e25309d999a1f932826549779233c9c8f957a2f282a/43986d909025859960977e9383214d98149e852f07284399112e7627232c712231997123dc9613208036173b0/5307221e32830295b239139f8933b29e42f6e3eed8674926495f8827795fe8eeb087b069503961264157e03a9/09ff8.png'
];

async function getChapterPages(slug: string, chapter: string): Promise<ChapterPages> {
	const page: string = await fetchFirstPage(slug, chapter);

	const [, cypher] = page.match(/<i id="data" data-data="(.+?)"/) || [null, ''];
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
	// return { ...infos, pages: pages };
}

// async function getChapterPages(slug: string, chapter: string): Promise<ChapterPages> {
// 	const page: string = await fetchFirstPage(slug, chapter);
// 	const decoder: object = isMultiPage(page) ? multiMap : monoMap;

// 	const pages: string[] = [...page.matchAll(rImgUri)].map(([, original]): string => {
// 		const [uri, ext]: string[] = original.replace('https://c.japscan.ws/', '').split('.');
// 		const decoded: string = uri.replace(rDecode(decoder), c => decoder[c]);

// 		// f=auto,w=800/
// 		return `https://cdn.statically.io/img/c.japscan.ws/${decoded}.${ext}`;
// 	});

// 	const [, name]: string[] = page.match(chapterName) || [];

// 	const [, manga]: string[] = page.match(chapterManga(slug)) || [];

// 	const [, next]: string[] = page.match(chapterNext) || [];
// 	const [, previous]: string[] = page.match(chapterPrevious) || [];

// 	const infos = {
// 		name: name?.split('Attention :')[0],
// 		manga,
// 		number: parseFloat(chapter.replace('volume-', '')),
// 		isVolume: chapter.includes('volume') || undefined,
// 		next: next?.replace('/lecture-en-ligne/', '/manga/')?.replace(/\/$/, ''),
// 		previous: previous?.replace('/lecture-en-ligne/', '/manga/')?.replace(/\/$/, '')
// 	};

// 	return { ...infos, pages };
// }

// function isMultiPage(page: string): boolean {
// 	const [option]: string[] = page.match(rImgUri);
// 	const [, first]: string[] = page.match(rFirstUri);

// 	const [fUri]: string[] = first.replace('https://c.japscan.ws/', '').split('.');
// 	const [oUri]: string[] = option.split('https://c.japscan.ws/')[1].split('.');

// 	// if (oUri !== fUri) {
// 	// 	console.log('ORIGINAL ->', oUri, '\n');
// 	// console.log(
// 	// 	'TARGET   ->',
// 	// 	fUri.replace(rDecode(multiMap), c => multiMap[c])
// 	// );
// 	// }

// 	return oUri === fUri;
// }

export default defineEventHandler(async (event): Promise<ChapterPages | undefined> => {
	const slug: string = event.context.params?.slug || '';
	const chapter: string = event.context.params?.chapter || '';

	try {
		return await getChapterPages(slug, chapter);
	} catch (e: any) {
		console.error('error: getChapterPages:', e?.message || e?.stack || e);
	}
});

// getDecodeCypherObject();
