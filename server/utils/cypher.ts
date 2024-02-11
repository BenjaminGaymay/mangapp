import { fetchFirstPage } from '../api/manga/[slug]/[chapter]';
import { isValid, BASE, b64 } from './decoded';

let first_key = null as string | null;
let second_key = null as string | null;

let fetchReferenceError = false;

export async function decodeCypher(cypher: string, retry = true) {
	try {
		if (!first_key || !second_key) await findCypher();
		if (!first_key || !second_key) return { imagesLink: [] as string[] };

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

async function findCypher() {
	if (fetchReferenceError) return;

	try {
		const cypher = await getReferencePage();
		if (!cypher) throw new Error('No cypher found');

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

		const combinations = permutations(missing_first).filter(order => isValid(cypher, first + order, second_key!));

		if (combinations.length > 0) {
			first_key = first + combinations[0];
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

function permutations(array: string) {
	const n = array.length;
	let r = n;

	let indices = [];
	for (let i = 0; i < n; i++) indices.push(i);

	const cycles = [];
	for (let i = n; i > n - r; i--) cycles.push(i);

	const results = [];
	let res = [];
	for (let k = 0; k < r; k++) res.push(array[indices[k]]);

	results.push(res);

	let broken = false;
	while (n > 0) {
		for (let i = r - 1; i >= 0; i--) {
			cycles[i]--;

			if (cycles[i] === 0) {
				indices = indices.slice(0, i).concat(indices.slice(i + 1).concat(indices.slice(i, i + 1)));
				cycles[i] = n - i;
				broken = false;
			} else {
				const j = cycles[i];
				const x = indices[i];

				indices[i] = indices[n - j];
				indices[n - j] = x;

				let res = [];
				for (let k = 0; k < r; k++) res.push(array[indices[k]]);

				results.push(res);
				broken = true;
				break;
			}
		}

		if (broken === false) break;
	}

	return results.map(e => e.join(''));
}
