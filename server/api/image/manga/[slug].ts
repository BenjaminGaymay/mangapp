export default defineEventHandler(async (event): Promise<any> => {
	const slug: string = event.context.params?.slug || '';

	try {
		const response = await fetch(`https://japscan.lol/imgs/mangas/${slug}.jpg`);
		if (!response.ok) return null;

		return response.body;
	} catch (e: any) {
		console.error('error: getImage:', e?.message || e?.stack || e);
		return null;
	}
});
