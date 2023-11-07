import cloudscraper from 'cloudflare-scraper';

export default defineEventHandler(async (event): Promise<any> => {
	const slug: string = event.context.params?.slug || '';

	try {
		const response = await cloudscraper.get(`https://japscan.lol/imgs/mangas/${slug}.jpg`);

		if (!response) return null;
		return response.rawBody;
	} catch (e: any) {
		console.error('error: getImage:', e?.message || e?.stack || e);
		return null;
	}
});
