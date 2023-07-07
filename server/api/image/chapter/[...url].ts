import cloudscraper from 'cloudflare-scraper';
// import { browser } from '~/server/utils/scraper';

export default defineEventHandler(async (event): Promise<any> => {
	const url: string = event.context.params?.url || '';

	const response = await cloudscraper.get(`https://c2.japscan.lol/${url}`, {
		timeout: { request: 60000 },
		headers: { referer: 'https://www.japscan.lol/' }
	});
	// const userAgent = await browser.getUserAgent();
	// const clearance = (await browser.getCookies()).find(e => e.name === 'cf_clearance');

	// console.log(userAgent);

	// const response = await fetch(`https://c2.japscan.lol/${url}`, {
	// 	// const response = await fetchURL(url, {
	// 	headers: {
	// 		'user-agent': userAgent,
	// 		referer: 'https://www.japscan.lol/',
	// 		cookie: `cf_clearance=${clearance.value}`
	// 	}
	// });

	if (!response) return null;

	return response.rawBody;
});
