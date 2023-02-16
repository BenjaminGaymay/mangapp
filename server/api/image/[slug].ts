import cloudscraper from 'cloudflare-scraper';

// import { writeFileSync, existsSync } from 'fs';

export default defineEventHandler(async (event): Promise<any> => {
	const slug: string = event.context.params?.slug || '';
	// const name = `manga/${slug}.jpg`;

	// if (existsSync(`./public/${name}`)) return name;

	const response = await cloudscraper.get(`https://japscan.lol/imgs/mangas/${slug}.jpg`, {
		timeout: { request: 60000 }
	});

	if (!response) return null;

	// writeFileSync(name, response.rawBody);

	return response.rawBody;
});
