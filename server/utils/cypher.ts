import { fetchFirstPage } from '../api/manga/[slug]/[chapter]';

let first_key = null as string | null;
let second_key = null as string | null;

let fetchReferenceError = false;

export async function decodeCypher(cypher: string, retry = true) {
	try {
		if (!first_key || !second_key) await findCypher();
		if (!first_key || !second_key) return { imagesLink: [] as string[] };

		console.log('first_key:', first_key);
		console.log('second_key:', second_key);

		const b64 = cypher.replace(/[A-Z0-9]/gi, char => first_key![second_key!.indexOf(char)]);
		const ascii = Buffer.from(b64, 'base64')
			.toString('ascii')
			.replace(/[^\w\d :/".,{}\[\]]/g, '');

		const pages = ascii.match(/\[.+\]/);
		if (!pages || !pages?.at(0)) return { imagesLink: [] as string[] };

		return { imagesLink: JSON.parse(pages[0]) as string[] };
	} catch (e: any) {
		console.error('error: decode:', e);

		if (retry && e.message?.includes('JSON')) {
			first_key = null;
			second_key = null;

			return decodeCypher(cypher, false);
		}

		return { imagesLink: [] as string[] };
	}
}

async function getReferencePage() {
	const page: string = await fetchFirstPage(
		'100-000-levels-of-body-refining-all-the-dogs-i-raise-are-the-emperor',
		'17'
	);
	const [, cypher] = page.match(/<i id="data" data-data="(.+?)"/) || [null, ''];

	return cypher;
}

const BASE =
	'eyJudW1iZXIiOjE3LCJ1cmkiOiJcL2xlY3R1cmUtZW4tbGlnbmVcLzEwMC0wMDAtbGV2ZWxzLW9mLWJvZHktcmVmaW5pbmctYWxsLXRoZS1kb2dzLWktcmFpc2UtYXJlLXRoZS1lbXBlcm9yXC8xN1wvIiwibWFuZ2FTbHVnIjoiMTAwLTAwMC1sZXZlbHMtb2YtYm9keS1yZWZpbmluZy1hbGwtdGhlLWRvZ3MtaS1yYWlzZS1hcmUtdGhlLWVtcGVyb3IiLCJpbWFnZXNMaW5rIjpb';

const b64 = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

async function findCypher() {
	if (fetchReferenceError) return;

	try {
		const cypher = await getReferencePage();
		if (!cypher) throw new Error('No cypher found');
		console.log('cypher:', cypher);

		fetchReferenceError = false;

		let first = '';
		let second = '';

		const slice = cypher.slice(0, BASE.length);
		for (let i = slice.length - 1; i >= 0; i--) {
			if (second.includes(slice[i])) continue;

			first += BASE[i];
			second += slice[i];
		}

		const missing_first = findMissing(first);
		second_key = second + findMissing(second);

		const combinations = listPossibilities(missing_first);
		for (const try_order of combinations) {
			if (!isValid(cypher, first + try_order, second_key)) continue;

			first_key = first + try_order;
			return;
		}

		throw new Error('No valid combination found');
	} catch (e) {
		console.error('error: findCypher:', e);
		fetchReferenceError = true;
		setTimeout(() => (fetchReferenceError = false), 1000 * 60 * 5);
	}
}

function findMissing(str: string) {
	let missing = '';
	for (let i = 0; i < b64.length; i++) {
		if (!str.includes(b64[i])) missing += b64[i];
	}

	return missing;
}

function isValid(cypher: string, first_key: string, second_key: string) {
	const b64 = cypher.replace(/[A-Z0-9]/gi, char => first_key[second_key.indexOf(char)]);
	const ascii = Buffer.from(b64, 'base64')
		.toString('ascii')
		.replace(/[^\w\d :/".,{}\[\]]/g, '');

	const pages = ascii.match(/\[.+\]/);
	if (!pages || !pages?.at(0)) return false;

	try {
		const _ = JSON.parse(pages[0]);
		return true;
	} catch (e) {
		return false;
	}
}

function listPossibilities(missing: string) {
	const possibilities = [];
	for (let i = 0; i < missing.length; i++) {
		for (let j = i + 1; j < missing.length; j++) {
			const temp = missing.split('');
			[temp[i], temp[j]] = [temp[j], temp[i]];

			possibilities.push(temp.join(''));
		}
	}

	return possibilities;
}
