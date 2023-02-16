export const mangaChapters: RegExp = /<div class=\"chapters_list.*?\">(.+?)<\/div>/g;
export const mangaDate: RegExp = /<span class=\"float-right\">(.+?)<\/span>/;
export const mangaHref: RegExp = new RegExp('<a.*?href="(.+?)".*?>');
export const mangaName: RegExp = new RegExp('VF: (.*)(Attention:)?</a');
export const mangaInfos: RegExp = /<span.*?>(.+?)<\/span>/;

export const rManga = {
	title: new RegExp('<h1>(.+?)</h1>'),
	img: new RegExp('<img style=".+?".*?src="(.+?)" alt="">'),
	date: new RegExp('Date Sortie:</span>(.+?)</p>'),
	status: new RegExp('Statut:</span>(.+?)</p>'),
	type: new RegExp('Type\\(s\\):</span>(.+?)</p>'),
	genre: new RegExp('Genre\\(s\\):</span>(.+?)</p>'),
	author: new RegExp('Auteur\\(s\\):</span>(.+?)</p>'),
	volume: new RegExp('Volumes V.:</span>.*?([0-9]+).*?</p>'),
	isAnime: new RegExp('Adaptation En Animé:</span>(.+?)</p>'),
	synopsis: new RegExp('<p class="list-group-item list-group-item-primary text-justify">(.+?)</p>')
};
