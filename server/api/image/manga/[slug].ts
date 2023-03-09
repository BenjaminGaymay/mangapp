import cloudscraper from 'cloudflare-scraper';

export default defineEventHandler(async (event): Promise<any> => {
	const slug: string = event.context.params?.slug || '';

	const response = await cloudscraper.get(`https://japscan.lol/imgs/mangas/${slug}.jpg`, {
		timeout: { request: 60000 }
	});

	if (!response) return null;

	return response.rawBody;
});
