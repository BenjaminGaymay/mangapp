import { fetchFirstPage } from '../api/manga/[slug]/[chapter]';
import { isValid, BASE, b64 } from './decoded';

let first_key = null as string | null;
let second_key = null as string | null;

let fetchReferenceError = false;
let errors = 0;

export async function decodeCypher(cypher: string, retry = true) {
	console.log('decodeCypher: start');
	try {
		//? on garde ?
		if (errors > 5) {
			await findCypher();
			errors = 0;
		}

		if (!first_key || !second_key) await findCypher();
		if (!first_key || !second_key) return { imagesLink: [] as string[] };

		const b64 = cypher.replace(/[A-Z0-9]/gi, char => first_key![second_key!.indexOf(char)]);
		const ascii = Buffer.from(b64, 'base64')
			.toString('ascii')
			.replace(/[^\w\d :/".,{}\[\]]/g, '');

		const pages = ascii.match(/\[.+\]/);
		if (!pages || !pages?.at(0)) return { imagesLink: [] as string[] };

		console.log('decodeCypher: ok');

		return { imagesLink: JSON.parse(pages[0]) as string[] };
	} catch (e: any) {
		console.error('error: decode:', e);
		errors += 1;

		if (retry && e.message?.includes('JSON')) {
			first_key = null;
			second_key = null;

			return decodeCypher(cypher, false);
		}

		return { imagesLink: [] as string[] };
	}
}

async function getReferencesPage() {
	const page: string = await fetchFirstPage(
		'100-000-levels-of-body-refining-all-the-dogs-i-raise-are-the-emperor',
		'17'
	);
	const [, cypher] = page.match(/<i.+?data-atad="(.+?)"/) || [null, ''];

	const page2: string = await fetchFirstPage('one-piece', '1094');
	const [, cypher2] = page2.match(/<i.+?data-atad="(.+?)"/) || [null, ''];

	return { '100-000-levels': cypher, 'one-piece': cypher2 };
}

async function findCypher() {
	if (fetchReferenceError) return;

	console.log('findCypher: start');

	try {
		const cyphers = await getReferencesPage();
		if (!cyphers) throw new Error('No cypher found');

		fetchReferenceError = false;

		let first = '';
		let second = '';

		const slice = cyphers['100-000-levels'].slice(0, BASE['100-000-levels'].length);
		for (let i = slice.length - 1; i >= 0; i--) {
			if (second.includes(slice[i])) continue;

			first += BASE['100-000-levels'][i];
			second += slice[i];
		}

		const slice2 = cyphers['one-piece'].slice(0, BASE['one-piece'].length);
		for (let i = slice2.length - 1; i >= 0; i--) {
			if (second.includes(slice2[i])) continue;

			first += BASE['one-piece'][i];
			second += slice2[i];
		}

		console.log('find missing');
		const missing_first = findMissing(first);
		second_key = second + findMissing(second);

		console.log('permutations');
		const combination = findFirstValidPermutations(missing_first, cyphers, first, second, second_key);

		// .filter(order => {
		// 	if (!isValid(cyphers['100-000-levels'], '100-000-levels', first + order, second_key!)) return false;
		// 	if (!isValid(cyphers['one-piece'], 'one-piece', first + order, second_key!)) return false;

		// 	return true;
		// });

		console.log('permutations: ok');

		if (combinations) {
			first_key = first + combinations;
			return;
		}

		throw new Error('No valid combination found');
	} catch (e) {
		console.error('error: findCypher:', e);
		fetchReferenceError = true;
		setTimeout(() => (fetchReferenceError = false), 1000 * 60 * 5);
	}
}

function checkIfPermutationIsValid(cyphers: object, permutation: string) {
	if (!isValid(cyphers['100-000-levels'], '100-000-levels', permutation, second_key!)) return false;
	if (!isValid(cyphers['one-piece'], 'one-piece', permutation, second_key!)) return false;

	return true;
}

function findMissing(str: string) {
	let missing = '';
	for (let i = 0; i < b64.length; i++) {
		if (!str.includes(b64[i])) missing += b64[i];
	}

	return missing;
}

function findFirstValidPermutations(array: string, cyphers: object, first: string, second: string, second_key: string) {
	const n = array.length;
	let r = n;

	let indices = [];
	for (let i = 0; i < n; i++) indices.push(i);

	const cycles = [];
	for (let i = n; i > n - r; i--) cycles.push(i);

	// const results = [];
	const res = [];
	for (let k = 0; k < r; k++) res.push(array[indices[k]]);

	if (checkIfPermutationIsValid(cyphers, first + res.join(''), second_key)) return res.join('');

	// results.push(res.join(''));

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

				// results.push(res.join(''));
				if (checkIfPermutationIsValid(cyphers, first + res.join(''), second_key)) return res.join('');

				broken = true;
				break;
			}
		}

		if (broken === false) break;
	}

	return null;
}
