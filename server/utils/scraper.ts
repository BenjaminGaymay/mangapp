let locked = false;
let HEADERS = null;

export async function bypassOptions(url: string, force = false) {
	let tries = 0;
	while (locked) {
		await new Promise(resolve => setTimeout(resolve, 1000));

		tries += 1;

		if (tries > 10) return null;
	}

	if (HEADERS && !force) return HEADERS;

	try {
		locked = true;

		// const response = await fetch('http://localhost:3000/cf-clearance-scraper', {
		const response = await fetch('http://cloudflare:3000/cf-clearance-scraper', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ url, mode: 'waf' })
		});

		locked = false;

		const json = await response.json();
		HEADERS = json.headers;

		return HEADERS;
	} catch (e: any) {
		locked = false;

		throw 'unable to solve cloudflare challenge';
	}
}
