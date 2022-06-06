export const rImgUri: RegExp = new RegExp('<option.*?data-img="(.+?)"', 'g');
export const rFirstUri: RegExp = new RegExp('data-src="(.+?)"');
export const rName: RegExp = new RegExp('Titre</span>: (.*)(Attention:)?</p');
export const rManga = (slug: string): RegExp => new RegExp(`href="/manga/${slug}/">(.*?)</a`);

export const rPrevious: RegExp = new RegExp('Précédent</span>.*?href="(/lecture-en-ligne/.*?)">');
export const rNext: RegExp = new RegExp('Suivant</span>.*?href="(/lecture-en-ligne/.*?)">');

export function rDecode(cypher): RegExp {
	return new RegExp(`[${Object.keys(cypher).join('')}]`, 'g');
}
