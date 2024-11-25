import { fetchWithBypass } from '~/server/utils/scraper';

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

	try {
		const response = await fetchWithBypass(fixedUrl);

		locked = false;
		return response.body;
	} catch (e: any) {
		console.error('bypass image:', e);
	}

	locked = false;
	return null;
});
