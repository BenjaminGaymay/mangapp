import { fetchFirstPage } from '../api/manga/[slug]/[chapter]';
import { kingdom761 } from './decoded';

let first_key = null as string | null;
let second_key = null as string | null;

let fetchReferenceError = false;

export async function decodeCypher(cypher: string, retry = true) {
	try {

		if (!first_key || !second_key) await findCypher();
		if (!first_key || !second_key) return { imagesLink: [] };

		const b64 = cypher.replace(/[A-Z0-9]/gi, char => first_key![second_key!.indexOf(char)]);
		const ascii = Buffer.from(b64, 'base64')
			.toString('ascii')
			.replace(/[^\w\d :/".,{}\[\]]/g, '');

		const pages = ascii.match(/\[.+\]/);
		if (!pages || !pages?.at(0)) return { imagesLink: [] };

		return { imagesLink: JSON.parse(pages[0]) };
	} catch (e: any) {
		console.error('error: decode:', e);

		if (retry && e.message?.includes('JSON')) {
			first_key = null;
			second_key = null;

			return decodeCypher(cypher, false);
		}

		return { imagesLink: [] };
	}
}

async function getReferencePage() {
	const page: string = await fetchFirstPage('kingdom', '761');
	const [, cypher] = page.match(/<i id="data" data-data="(.+?)"/) || [null, ''];

	return cypher;
}

async function findCypher() {
	if (fetchReferenceError) return;

	try {

		const cypher = await getReferencePage();
		const decoded = kingdom761;

		fetchReferenceError = false

		let first = '';
		let second = '';
		for (let i = cypher.length - 1; i >= 0; i--) {
			if (second.includes(cypher[i])) continue;

			first += decoded[i];
			second += cypher[i];
		}

		first_key = first;
		second_key = second;
	} catch (e) {
		console.error('error: findCypher:', e);
		fetchReferenceError = true
		setTimeout(() => (fetchReferenceError = false), 1000 * 60 * 5);
	}
}
