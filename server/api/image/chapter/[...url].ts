import cloudscraper from 'cloudflare-scraper';

export default defineEventHandler(async (event): Promise<any> => {
	const url: string = event.context.params?.url || '';

	const response = await cloudscraper.get(`https://c.japscan.lol/${url}`, {
		timeout: { request: 60000 }
	});

	if (!response) return null;

	return response.rawBody;
});
