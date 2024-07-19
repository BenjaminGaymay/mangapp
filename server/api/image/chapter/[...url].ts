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
		let headers = await bypassOptions(fixedUrl);
		if (!headers) throw 'bypass failed 1';

		let response = await fetch(fixedUrl, { headers });
		if (!response.ok) {
			headers = await bypassOptions(fixedUrl, true);
			if (!headers) throw 'bypass failed 2';

			let response = await fetch(fixedUrl, { headers });
			if (!response.ok) throw 'request failed 3';
		}

		locked = false;
		return response.body;
	} catch (e: any) {
		console.error('bypass image:', e);
	}

	locked = false;
	return null;
});
