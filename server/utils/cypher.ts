// import { rImgUri } from './regex/chapter';
// import { fetchFirstPage } from '../api/manga/[slug]/[chapter]';

const first_key = 'Yb4FAl8CqaKeMc0dIEJG1SpBRDWjvw7LNHomf62Ty3O9ZXzuQtikshnUPVr5gx';
const second_key = 'U73RVdmeJuCPtNBS5n1D48GbxhkavMKOELpzojFcfYQyrTAl0HigwWsZ9qXI62';

export function decodeCypher(cypher: string) {
	// console.log(cypher);

	const b64 = cypher.replace(/[A-Z0-9]/gi, char => first_key[second_key.indexOf(char)]);
	return JSON.parse(Buffer.from(b64, 'base64').toString('ascii')) as { imagesLink: string[] };
}

// export let monoMap: object = {};
// export let multiMap: object = {};

// const MANGA = [
// 	{
// 		slug: 'kingdom',
// 		chapter: '731',
// 		decoded:
// 			'c811f6718134c14435c189a1f7614091a74160d440e4300109a430746971c4311681a90184d119e1a12139d4525/1e851e27194519961b954f2914811a8c106c13254397128715401f42151c434b445b16l51d3e48095c385328599/446m141534476431053n7175748m943815am20e9c118819n00d9111111a5111n305l32fn22c212f5728m32c7423/jc28na0'
// 	},
// 	{
// 		slug: 'isekai-apocalypse-mynoghra-the-conquest-of-the-world-starts-with-the-civilization-of-ruin',
// 		chapter: '16',
// 		decoded:
// 			'260155f804f894c8a1810288e0d8f02167c8582101480688c018f9e137c8a428782843e88818d4a8369821d8b6b1014118282538c838a6f882a88558f418c938e5c8a0b1e92863d85698f2680751c0d1bx88b0c157d2200299023621ey31324114b1188/2fz4822d10562bu215y4706482548bz47a118c6c88z27dyd97439004027005xf701f99zc9ax870y89ezd9f42969c056290u400489cw19f4e931c0a42978294xe78019d3a939902xd7b3b9094014292230cx37a8f089a08750f619c930e8c0axb7e9296w/d95790fz690250cxd7b089b3c959d02x0791093z29ex37394018b01089f04026d00y69bz2958490x472049b349a910cxc78629d7d0733902492z095yf904f09xc9ax870089e8d0f52064c05w2906490889cz19f5e036c9ax27742946e98v19d0a938902/4d9bzb7'
// 	},
// 	{
// 		slug: 'one-punch-man',
// 		chapter: '224',
// 		decoded:
// 			'82c160a4e9d4773143949821d99147815004a9e45231a7b168b1729140f489d1b2d4146159149921c4943601a3d1e254c8b/1f2f4c344436406d147d150a1d39163a4d4648201e1245691617152a1a0c10j813334d0e5f3b5c21539044k04153457c471/a5fl31b5a43kd428b55ke068b148812l20622100b1f0f13l907k3209b28jc26ja0e6d271324k929323d8934j805302ake25/l32alb0'
// 	},
// 	{
// 		slug: 'hajime-no-ippo',
// 		chapter: '1386',
// 		decoded:
// 			'6780778083031040975072d0d37031c054f03253636371008393c730e3d384f0d54071e39160a6f086e096f0d8039840f000f0/c3f6d020a380e30943d230a013c120b8605300908365008680f360c7001rb03283094412a4a1d45883fs335493b68330447t50/b4c3as53a794es09e770c7d00tb9133035d0500048905t19dt416782778286011r499t517sd1dr7932c15rf136516o61780185/91ct39'
// 	},
// 	{
// 		slug: 'tales-of-demons-and-gods',
// 		chapter: '386.5',
// 		decoded:
// 			'03d0f1f0a8c04953a32380c06470d050f0f014b06230d9837520f980250090b05303a37312d099f3c67050b0a08081a326c0f8b073f0e27071405/883d273d0a0e280e213d4e0f630f1e0438331306213aj408293e9a4f27451f4c8c3ck039413a60320e44la0d41327141g136kf9089037f0al89b2/f05k4953e045f000606lf900d2f1f1alc14451aj2981c16k71d851fjf910b26k31dl817j21f28121019jb95301al711jd990f2c2715ib1a88181a/22lc9'
// 	},
// 	{
// 		slug: 'mashle',
// 		chapter: '114',
// 		decoded:
// 			'1196a70396c3b7d359d3a11611f384534223f6c67783f5c3c573a6e3e22673f3d6131576e466f4c30063c136b5/06c21302d671737353c546c21312a681d6f5733803701367e301b3016306e326f658538hf395d642b7d5579427/71b69i7687e6f93683c7djc3a70610f78eb69i82f1b380637j02b4034183f1f3bja26584fgc41894a30591c4bh/d45jd2'
// 	},
// 	{
// 		slug: 'tokyo-revengers',
// 		chapter: '260',
// 		decoded:
// 			'835419246141650199c4e6d182f10034e5b12451f7f1b831a20101942174f94419d488c1d9d198b10374426162816141a04171/a4b1b4a1a4e34122e1f4a1d284e1b1505412e4417182a108e1e13159b48r0183e4d04573e5b205c904dsb4a5e4b744c155atc1/45641875ao54csd0396188716tb0d861b431b0717tb091b320d3835215226s42630294c3e3d280f30r30etb22753fpf2bt32a2/030t90'
// 	}
// ];

// const WEBTOON = [
// 	{
// 		slug: 'solo-max-level-newbie',
// 		chapter: '54',
// 		decoded:
// 			'21662273a123360376e6a5f699434626b23353d691e3417358f3c4b3c983b1a681f3f53327039336595318c3051343a6d0f3d543a9035/763c5135953f44691932843e376e873f5768543e643e7438943clc3551692d7e5973437f1c64m16b7f6d9865337en333756b057ci86cm/52f173e0a3en72640375439nf2d5f4b9e4621427652574am243l027ke4a5f496454524bk345ld298e541745lf4clb2cn84bka48nf4f33/52n02'
// 	},
// 	{
// 		slug: 'return-of-the-female-knight',
// 		chapter: '44',
// 		decoded:
// 			'154192c417811984f5314054a274c7a19094d914c4c47331e8a17651a7910154c4b4b371d3c121f472b4c284a031a8e129f17461314477c13351d/1c153a16051f4612434b121c2643121a1f40021f7c11j417354f095a365d215a9640k849594f714f155fla115c40855eg042kd02901c8917lb012/11b291cl8092037672156217429kc21h821j80f3324i52a972cja29392d412cjc07332e6a27253aj900452clb2bj70dkc220f373b3c283a332a0e/32lf0'
// 	},
// 	{
// 		slug: 'ranker-s-return-remake',
// 		chapter: '37',
// 		decoded:
// 			'b53589b273d5b7322592e9d20432d4455365a4c5a5c523c52435a0c2917231d2f7729495234269a2c92265a2d0e5a75209626065463273/f5f445b932b7b271928575c042f0850862c1a5b8c25502d7928p5264f511e6747643f60095aq351685f8f572562r12962599e62m655q81/d0c239e24r3146c282b2brd104a3bn038073bp3384b371d4bp312q93e1d40434d3445463a1c4apc122c42p31a1c494733nd3fq73909321/446ra1'
// 	},
// 	{
// 		slug: 'gosu',
// 		chapter: '198',
// 		decoded:
// 			'd180f690e850a9f37670997309e341900040b7a056a0b3f3a510504084d036f06263e440745089c3765011d/3b2f3c6601170a79063a345d01323a6401013f10033d07203338069f313008820a87372f32ze072f3e98452/24218468230a83d4f366c310841be064a3a7e4awd3aa392700f7405b79d53056200850fb8912d2f0d2db81f/491eb59'
// 	},
// 	{
// 		slug: 'invincible-at-the-start',
// 		chapter: '10',
// 		decoded:
// 			'79b283a24862b1e59812b2128672e5057315833253b2837222e533a5455281a2d45528f2a7d2c912f3a5e0123235e20236824502b85215c/5b1120192d06260723572837293c2b642a40507b2502282455t721485d1467406331660553u6576c5186542c6dv823635d9d67qb56u11d0/c2f9621v617902f0528v91c3f4d1d4e0b373b482a44t61b4e39713b3148t71e30470138t3154b38s7321e338a342538ua3d85325f4aud3c/813fva1'
// 	},
// 	{
// 		slug: 'library-of-heaven-s-path',
// 		chapter: '60',
// 		decoded:
// 			'4818006825f8662817210628d1412601a9e1c70173e8b2e8316848b834586768d198c3e8077126b80178932835e884c8696176486091c2386/788f07163082888785878d8b148b808a81869e1c008b8418x98e071f7d200c279521611ay3132513411d8c24z688291a532au81ey97a6c8a5/886zd78568b1682zb783690900c68945100x6728f06x271y290029d1402609a0e9c3097xe7b1e93z694xb734506760d699c7e0077924b90w7/99z27'
// 	}
// ];

// function getOriginalURI(page: string) {
// 	const [option]: string[] = page.match(rImgUri);
// 	const [oUri]: string[] = option.split('https://c.japscan.ws/')[1].split('.');

// 	return oUri;
// }

// async function getDecodeCypherObject(list: { slug: string; chapter: string; decoded: string }[]) {
// 	return await Promise.all(
// 		list.map(async ({ slug, chapter, decoded }) => {
// 			const page = await fetchFirstPage(slug, chapter);
// 			const uri = getOriginalURI(page);

// 			return { cypher: uri, decoded };
// 		})
// 	);
// }

// function generateCypherMap(list: { cypher: string; decoded: string }[]) {
// 	return list.reduce((map, { cypher, decoded }) => {
// 		for (const i in cypher as any) {
// 			const input = cypher[i];
// 			const output = decoded[i];

// 			map[input] = output;
// 		}

// 		return map;
// 	}, {});
// }

// const LETTERS = [
// 	'a',
// 	'b',
// 	'c',
// 	'd',
// 	'e',
// 	'f',
// 	'g',
// 	'h',
// 	'i',
// 	'j',
// 	'k',
// 	'l',
// 	'm',
// 	'n',
// 	'o',
// 	'p',
// 	'q',
// 	'r',
// 	's',
// 	't',
// 	'u',
// 	'v',
// 	'w',
// 	'x',
// 	'y',
// 	'z',
// 	'0',
// 	'1',
// 	'2',
// 	'3',
// 	'4',
// 	'5',
// 	'6',
// 	'7',
// 	'8',
// 	'9',
// 	'/'
// ];

// function findMissingKey(cypher: object) {
// 	const remaining_keys = new Set(LETTERS);
// 	const remaining_values = new Set(LETTERS);

// 	for (const [key, value] of Object.entries(cypher)) {
// 		remaining_keys.delete(key);
// 		remaining_values.delete(value);
// 	}

// 	return { [[...remaining_keys][0]]: [...remaining_values][0] };
// }

// async function findCyphers() {
// 	const monoCypher = generateCypherMap(await getDecodeCypherObject(MANGA));
// 	monoMap = { ...monoCypher, ...findMissingKey(monoCypher) };

// 	const multiCypher = generateCypherMap(await getDecodeCypherObject(WEBTOON));
// 	multiMap = { ...multiCypher, ...findMissingKey(multiCypher) };
// }

// const DAY_IN_MS = 1000 * 60 * 60 * 24;
// setInterval(findCyphers, DAY_IN_MS);

// findCyphers();
