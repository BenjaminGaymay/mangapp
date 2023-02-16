export const chapterImgUri: RegExp = new RegExp('<option.*?data-img="(.+?)"', 'g');
export const chapterFirstUri: RegExp = new RegExp('data-src="(.+?)"');
export const chapterName: RegExp = new RegExp('Titre</span>: (.*?)</p');
export const chapterManga = (slug: string): RegExp => new RegExp(`href="/manga/${slug}/">(.*?)</a`);

export const chapterPrevious: RegExp = new RegExp('Précédent</span>.*?href="(/lecture-en-ligne/.*?)">');
export const chapterNext: RegExp = new RegExp('Suivant</span>.*?href="(/lecture-en-ligne/.*?)">');

export function chapterDecode(cypher: any[]): RegExp {
	return new RegExp(`[${Object.keys(cypher).join('')}]`, 'g');
}
