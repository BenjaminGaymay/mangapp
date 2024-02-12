const CYPHER =
	'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';

const BASE =
	'eyJudW1iZXIiOjE3LCJ1cmkiOiJcL2xlY3R1cmUtZW4tbGlnbmVcLzEwMC0wMDAtbGV2ZWxzLW9mLWJvZHktcmVmaW5pbmctYWxsLXRoZS1kb2dzLWktcmFpc2UtYXJlLXRoZS1lbXBlcm9yXC8xN1wvIiwibWFuZ2FTbHVnIjoiMTAwLTAwMC1sZXZlbHMtb2YtYm9keS1yZWZpbmluZy1hbGwtdGhlLWRvZ3MtaS1yYWlzZS1hcmUtdGhlLWVtcGVyb3IiLCJpbWFnZXNMaW5rIjpb';

const b64 = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

function findCypher() {
	let first = '';
	let second = '';

	const cypher = CYPHER.slice(0, BASE.length);
	// console.log('cypher:', cypher);
	for (let i = cypher.length - 1; i >= 0; i--) {
		if (second.includes(cypher[i])) continue;

		first += BASE[i];
		second += cypher[i];
	}

	const missing_first = findMissing(first);
	const second_key = second + findMissing(second);
	// console.log('first:', first, 'missing:', missing_first);
	// console.log('second:', second, 'missing:', findMissing(second));

	console.log(permutations(missing_first).length);

	const combinations = permutations(missing_first)
		.map(e => e.join(''))
		.filter(order => isValid(first + order, second_key));
	console.log('combinations:', combinations.length);

	// for (const try_order of combinaisons) {
	// 	if (!isValid(first + try_order, second_key)) continue;

	// 	console.log('Found', first + try_order, second_key);
	// 	return { first_key: first + try_order, second_key };
	// }

	return { first_key: first + combinations.at(0), second_key };
}

function findMissing(str) {
	let missing = '';
	for (let i = 0; i < b64.length; i++) {
		if (!str.includes(b64[i])) missing += b64[i];
	}

	return missing;
}

const isb64 = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;

// const valid = /(https:?\/\/\w+\.\w+\.\w+\/)((\w|\/)+)(\.\w+)/;

const images = [
	'https://c4.japscan.lol/c841b5c1d381153179e181e4c2c12174104431749491542121e4d441e92108c1e914a771c6b117c13701d02101a4e261b0f4464189e1707199c151e18094d3747641713450915711e641029473e494d16nb173d4f0/d54335a2e519e4ao24653487c4c1f54p51756458657kc43o0099510p80a5e1a901dp20c023ap2220734342c843bnc2d3821n3073e286e2c2c32n701342307399925n2023e2d143e72209c2e013an70c7b21nc03103/d5220pa2e262bnf0434286e272739nc05me28m92d9727n4075325o925712eo42079274e293d260b37nd0f7d34232ape210e2an2064328pc2cnf041537m62536274c333029m520n80a8e1a801d821cn20a821287149/41cp40.jpg',
	'https://c4.japscan.lol/48c14581a341158169613174f2f141a4e014e194041194c121a4441149e14861d9144771e64147e1f7f1606181440241d084c6311941d041a941f111f034b3c4f691316460e1f7111651226493f4e4416nc133e4b0/d523c5d2d5c9948o44b5a4d7e4c185dpc175b4c8753k140o0030a19p80f51129918p4030931pe2e033a3d248c34n82a3421n8063623672f2f34na0e312e09309129nc023a2411347e24962d0134n70e7424ne0f1f3/65628p420242dn80c3321642d243an40fm12fm32b9c2fn9035626oe2f7121o52276294f2e34260c33ne0b7d322c2dpd2c0928n40b4a2dpe2cn80d1c37mb2c372341303023ma29n80f811289188413n9018e1e831a9/d14pc0.jpg',
	'https://c4.japscan.lol/479034d05280646018f0e093b160d0e329837093d3f06380a0c363b0c8d0e720c8c37620f520a650e6d0b97040e3016089332560f8d0e99088d05020497392431520f0d37970a62085b091a3b26393201n00723319/04c29491449833do73c483a6b330d45p40e4831714ck13dob9a060fp69c4e0b8808pb9f9a27p717972f2b147923nd152816n6912f1e591b162dne922817992d8f16n89a2c160b2c6d1e821c9c27n29f621an59e0d2/b4714pe101618n392261f5d1e1928nd95m214m7198411n29f4d17o71a6218ob196a1b361922119027n391602c1919p419931dn79c381apb13nd95042em811211c312d2b1am61fn69c7e0b78087b0fna977707770f8/b04p99.jpg',
	'https://c4.japscan.lol/9689e339218973e9c7f9098260292992d8b2c9621239b2b919f222c9f739a6f977c2a589a4f9550955c9a809f942708988229459b7d9c8e937c95949f8824102d47989f2d80995c924296022f1e29259cn39b14278/3381d3e03377224oe2238205d279538pd90322e663bk72eoc870e90p78b3299709bpf8f8415pd0881191509681en3021807ne8c1f0048060212n98d1b0c8611730bnb811f029c1f530a7f078c1an88a5f05n0859c1/a300fp4070808n289150b4d0c0e13nc85m40fm804700dn7883f0do0095c02o206520f2e09150c831bn48753180d0ep3078204ne822800pd07n5889d10m20e160b271e1c07me00n78b6299609b6f9fn4856d9861997/599p88.jpg',
	'https://c4.japscan.lol/30632783a563a783519323e6d4d373b6825653a67643a643c3c6d6235173b023d1062953a8a3e953493392c3f3d634c3b2d668f3919392537103131392a615f668c333d6b28309238853e496754696b32n63f526a2/e7c547d46771168o460756a9463327dp039736d0a78k164o925583bp2247635113fpb242b55pa44245150430652n84a564an82559428e4d4d57nb2855452a57144an42c5c4d3255974b124d2052n52a9a4en524335/97c4fpd434c4bnd265f4989494557n021m149ma411f46nc237d4bo8409248o54e994764495b42265fn22a9e5c444dp6472148n420654ap443n22d3059m34d5a4861545945m84bn2240635013f0b34nb250a3404311/033p62.jpg',
	'https://c4.japscan.lol/a00357d3f543a773a1e313060473a3263246b3565613165353965623716360c311c679f32813d953e9b392f373d65403020678b321c3f273b193d373f26645665883d3761263f95398030456557616931n43c5d672/67454714f7c106fo26c7f64906a3075p437766d0b77kd6co3246c34p22878301530p92d245cp046215b5f4a0055nd4f544an72a5e418040475an223544b25551141n5255945325796461c412c57nf22914dn52e3b5/97f47pd454040n0275b428c4f475bn92dm74fm6441645n82d7741o64f9549o040954567415941245cnd2796544441pf4c204fn22c6f44p04an0253457m64d5b476d5c5344mc44n22808300530093dn42c0036013b1/f3ap02.jpg',
	'https://c4.japscan.lol/860923493149832907e9b9c2f05919025842f9c22259027979e232392719b6d9b762d5196409256935498819e9825089b8b244997719a819e7d9790988f291d2a4e9a9a2c8f9a5f984f96072a18282e90n49617208/236123d0b357426o826312b5621943fp79d34296f3ck322o2823c9fpc8a34907097p483801dp808841a12086012n4031408n2801e0b4c0f0511n085140f8c127500n7871e039312510b7d0b861dn1865002n683941/8310ep805080bnb841907410a011end87m008mf097d0ane8a3a0cof0a5f08of06570a28081e008416n7805216020dpb058406n886210bp601n48f971dm4091f0c23121202mc0fnc8a649060976493n08d6898649a7/298p08.jpg',
	'https://c4.japscan.lol/1598624810f812688658c84109c868a127e1c8018118e118b851015866e85598d69154c8032844d8c41847c82871a9f887e113b8d678078826781848574120a1e3383831a7b8e4981398294160014168an98b08157/72c08279e256b18o712271d461f8422p48d261b5820k71bo67a3e87p47f2f88608dp67e7a07p9997f010f915906n4910f91n678059c34909c06na720e9c7008619en17b059085064e95699d7905nc704294nd7c810/42c92p79a9f98ne710b9d37909802n771m495m4926a9en373239aob9e4991o99244961094069a790bn875470c9897pe957b98n772179dp69fn472840dm69b0890170b069ame97n47f5f88508d568ena7759895f816/f81p97.jpg'
];
function isValid(first_key, second_key) {
	const b64 = CYPHER.replace(/[A-Z0-9]/gi, char => first_key[second_key.indexOf(char)]);

	if (!isb64.exec(b64)?.at(0)) return false;

	const ascii = Buffer.from(b64, 'base64').toString('ascii');
	// .replace(/[^\w\d :/".,{}\[\]]/g, '');

	if (!ascii.endsWith('"],"allInOne":true}')) return false;

	const pages = ascii.match(/\[.+\]/);
	if (!pages || !pages?.at(0)) return false;

	try {
		const parsed = JSON.parse(pages[0]);

		const pagesAreValid = images.every(image => parsed.includes(image));
		if (!pagesAreValid) return false;

		return true;
	} catch (e) {
		return false;
	}
}

// function listPossibilities(first) {
// 	const possibilities = [];
// 	// shuffle string with all different orders

// 	return possibilities;
// }

const { first_key, second_key } = findCypher();
const decoded = CYPHER.replace(/[A-Z0-9]/gi, char => first_key[second_key.indexOf(char)]);
// console.log(Buffer.from(decoded, 'base64').toString('ascii'));

// bpjIr5WaMNXZnFJCLi3yVGctlhdUm1SzYvRwuek92HsATox8BD0E4OgfqKPQ67;
// aCpcmySkfGOjLFRBJqHYEIhZ58QT9W7x63KeAzsV0DNguon2rUXvbPdiltwM14;

function permutations(array, r = undefined) {
	const n = array.length;
	if (r === undefined) r = n;

	if (r > n) return;

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

	return results;
}
