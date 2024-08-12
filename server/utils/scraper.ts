// https://github.com/sarperavci/CloudflareBypassForScraping

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

		const params = new URLSearchParams();
		params.append('url', url);

		const response = await fetch('http://localhost:8000/');
		// const response = await fetch('http://cloudflare:8000/');

		locked = false;

		if (!response.ok) throw 'unable to solve cloudflare challenge';
		const json = await response.json();

		HEADERS = {
			Accept: '*/*',
			'Accept-Encoding': 'gzip, deflate, br, zstd',
			'Accept-Language': 'en-US,en;q=0.9',
			Origin: 'https://www.japscan.lol',
			Referer: 'https://www.japscan.lol/',
			Cookie: json.cookies.map(({ name, value }) => `${name}=${value}`).join(';'),
			'User-Agent': json.agent
		};

		return HEADERS;
	} catch (e: any) {
		locked = false;

		throw 'unable to solve cloudflare challenge';
	}
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
