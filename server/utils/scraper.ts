// https://github.com/sarperavci/CloudflareBypassForScraping

type Headers = {
	Accept: '*/*';
	'Accept-Encoding': 'gzip, deflate, br';
	'Accept-Language': 'en-US,en;q=0.9';
	Origin: 'https://www.japscan.lol';
	Referer: 'https://www.japscan.lol/';
	Cookie: string;
	'User-Agent': string;
};

let locked = false;
let HEADERS: Headers | null = null;

export async function fetchWithBypass(url: string) {
	const headers = await getBypassHeaders(url);
	if (!headers) throw 'bypass failed';

	const response = await fetch(url, { headers });
	if (!response.ok) throw 'request failed';

	return response;
}

export async function getBypassHeaders(url: string) {
	let headers = await bypassOptions(url);
	if (headers) return headers;

	headers = await bypassOptions(url, true);
	if (headers) return headers;

	return null;
}

async function bypassOptions(url: string, force = false) {
	let tries = 0;
	while (locked) {
		await new Promise(resolve => setTimeout(resolve, 1000));

		tries += 1;

		if (tries > 10) return null;
	}

	if (HEADERS && !force) return HEADERS;

	try {
		locked = true;

		const params = new URLSearchParams();
		params.append('url', url);

		// const response = await fetch(`http://localhost:8000/cookies?${params.toString()}`);
		const response = await fetch(`http://cloudflare:8000/cookies?${params.toString()}`);

		locked = false;

		if (!response.ok) throw 'unable to solve cloudflare challenge';
		const json = await response.json();

		HEADERS = {
			Accept: '*/*',
			'Accept-Encoding': 'gzip, deflate, br',
			'Accept-Language': 'en-US,en;q=0.9',
			Origin: 'https://www.japscan.lol',
			Referer: 'https://www.japscan.lol/',
			Cookie: Object.entries(json.cookies)
				.map(([name, value]) => `${name}=${value}`)
				.join(';'),
			'User-Agent': json.user_agent
		};

		return HEADERS;
	} catch (e: any) {
		console.log(e);
		locked = false;

		// throw 'unable to solve cloudflare challenge';
	}

	return null;
}

// export async function fetchWithBypass(url: string) {
// 	let tries = 0;
// 	while (locked) {
// 		await new Promise(resolve => setTimeout(resolve, 1000));

// 		tries += 1;

// 		if (tries > 10) return null;
// 	}

// 	try {
// 		locked = true;

// 		const params = new URLSearchParams();
// 		params.append('url', url);

// 		const response = await fetch(`http://localhost:3000?${params.toString()}`);

// 		locked = false;
// 		console.log(await response.text());

// 		return response;
// 	} catch (e: any) {
// 		locked = false;

// 		throw 'unable to solve cloudflare challenge';
// 	}
// }
