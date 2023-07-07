export const homeV1: RegExp[] = [
	new RegExp('id="tab-1".*?>(.+?)<div class="tab-pane container.*" id="tab-2">'),
	new RegExp('id="tab-2".*?>(.+?)<div class="tab-pane container.*" id="tab-3">'),
	new RegExp('id="tab-3".*?>(.+?)<div class="tab-pane container.*" id="tab-4">'),
	new RegExp('id="tab-4".*?>(.+?)<div class="tab-pane container.*" id="tab-5">'),
	new RegExp('id="tab-5".*?>(.+?)<div class="tab-pane container.*" id="tab-6">'),
	new RegExp('id="tab-6".*?>(.+?)<div class="tab-pane container.*" id="tab-7">'),
	new RegExp('id="tab-7".*?>(.+?)<div class="tab-pane container.*" id="tab-8">'),
	new RegExp('id="tab-8".*?>(.+)')
];

export const homeV2: RegExp[] = [
	new RegExp('<span data-id="1".*?>(.+?)<span data-id="2"'),
	new RegExp('<span data-id="2".*?>(.+?)<span data-id="3"'),
	new RegExp('<span data-id="3".*?>(.+?)<span data-id="4"'),
	new RegExp('<span data-id="4".*?>(.+?)<span data-id="5"'),
	new RegExp('<span data-id="5".*?>(.+?)<span data-id="6"'),
	new RegExp('<span data-id="6".*?>(.+?)<span data-id="7"'),
	new RegExp('<span data-id="7".*?>(.+?)<span data-id="8"'),
	new RegExp('<span data-id="8".*?>(.+?)')
];

// export const homeManga: RegExp = new RegExp('href="/manga/(.*?)/" title="(.*?)".+?>', 'g');
export const homeManga: RegExp = new RegExp('<div class="row py-1(.*?)<div class="col-md-2', 'g');

// export const homeChapters: RegExp = new RegExp(
// 	'href="(/lecture.+?)">(.*?)</a>.*?((<span.*?>(.+?)</span>)|(</p>)|(</div))',
// 	'g'
// );
export const homeChapters: RegExp = new RegExp('href="(/lecture.+?)" title="(.+?)"', 'g');
export const homeChapterName: RegExp = new RegExp('VF: (.*)(Attention:)?');
export const homeChapterNumber: RegExp = new RegExp('/((volume-)?([0-9]|\\.)+)/$');

export const homeTrendGroup: RegExp = new RegExp('<ol class="rectangle-list rounded-0 list-group".+?</ol', 'g');
export const homeTrend: RegExp = new RegExp('<a.*?href="/manga/(.+?)/">(.+?)</a>', 'g');
