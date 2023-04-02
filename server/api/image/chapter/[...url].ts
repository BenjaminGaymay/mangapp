import cloudscraper from 'cloudflare-scraper';

export default defineEventHandler(async (event): Promise<any> => {
	const url: string = event.context.params?.url || '';

	const response = await cloudscraper.get(`https://c.japscan.lol/${url}`, {
		timeout: { request: 60000 },
		headers: { referer: 'https://www.japscan.lol/' }
	});

	if (!response) return null;

	return response.rawBody;
});
