import cloudscraper from 'cloudflare-scraper';

import { decodeCypher } from '~~/server/utils/cypher';
import { rName, rManga, rNext, rPrevious } from '~~/server/utils/regex/chapter';

// import { rDecode, rImgUri, rFirstUri, rName, rManga, rNext, rPrevious } from '~~/server/utils/regex/chapter';
// import { monoMap, multiMap } from '~~/server/utils/cypher';

import { clearString } from '~~/server/utils/string';

export async function fetchFirstPage(slug: string, chapter: string): Promise<string> {
	// const response: Response = await fetch(`https://www.japscan.me/lecture-en-ligne/${slug}/${chapter}/`);
	// const text: string = await response.text();

	// return clearString(text);

	const response = await cloudscraper.get(`https://www.japscan.me/lecture-en-ligne/${slug}/${chapter}/`);
	return clearString(response.body);
}

async function getChapterPages(slug: string, chapter: string): Promise<ChapterPages> {
	const page: string = await fetchFirstPage(slug, chapter);

	const [, cypher] = page.match(/<i id="data" data-data="(.+?)"/);
	const { imagesLink: pages } = decodeCypher(cypher);

	const [, name]: string[] = page.match(rName) || [];

	const [, manga]: string[] = page.match(rManga(slug)) || [];

	const [, next]: string[] = page.match(rNext) || [];
	const [, previous]: string[] = page.match(rPrevious) || [];

	const infos = {
		name: name?.split('Attention :')[0],
		manga,
		number: parseFloat(chapter.replace('volume-', '')),
		isVolume: chapter.includes('volume') || undefined,
		next: next?.replace('/lecture-en-ligne/', '/manga/')?.replace(/\/$/, ''),
		previous: previous?.replace('/lecture-en-ligne/', '/manga/')?.replace(/\/$/, '')
	};

	return { ...infos, pages };
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

// 	const [, name]: string[] = page.match(rName) || [];

// 	const [, manga]: string[] = page.match(rManga(slug)) || [];

// 	const [, next]: string[] = page.match(rNext) || [];
// 	const [, previous]: string[] = page.match(rPrevious) || [];

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

export default defineEventHandler(async (event): Promise<ChapterPages> => {
	const slug: string = event.context.params.slug;
	const chapter: string = event.context.params.chapter;

	return getChapterPages(slug, chapter);
});

// getDecodeCypherObject();
