import cloudscraper from 'cloudflare-scraper';
// import { browser } from '~/server/utils/scraper';

let locked = false;

export default defineEventHandler(async (event): Promise<any> => {
	const url: string = event.context.params?.url || '';

	let tries = 0;
	while (locked) {
		await new Promise(resolve => setTimeout(resolve, 1000));

		tries += 1;

		if (tries > 10) return null;
	}

	locked = true;
	const fixedUrl = url.startsWith('https:') ? url : `https:${url.replace(/^https/, '')}`;
	const response = await cloudscraper.get(fixedUrl, {
		headers: { referer: 'https://www.japscan.lol/' }
	});

	locked = false;

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
