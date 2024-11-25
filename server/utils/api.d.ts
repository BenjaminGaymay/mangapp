declare module 'cloudflare-scraper';

interface HomeManga {
	slug: string;
	name: string;
	isHot?: boolean;
	chapters: Chapter[];
}

interface Chapter {
	href: string;
	name?: string;
	number: number;
	infos?: string;
	isVolume?: boolean;
	date?: string;
}

interface MangaData {
	title?: string;
	img?: string;
	date?: string;
	status?: string;
	type?: string;
	genre?: string[];
	author?: string;
	volume?: number;
	isAnime?: boolean;
	synopsis?: string;
}

interface Manga extends MangaData {
	chapters: Chapter[];
}

interface QueryResult {
	name: string;
	url: string;
	slug: string;
}

interface Trends {
	slug: string;
	name: string;
}

interface ChapterPagesInfos {
	name: string;
	manga: string;
	number: number;
	isVolume: boolean;
	next: string;
	previous: string;
}

interface ChapterPages extends ChapterPagesInfos {
	pages: string[];
}

interface DBHistory {
	read: boolean;
	page: number;
}

interface DBChapter {
	pages: string[];
	infos: ChapterPagesInfos;
}

interface DlChapter extends DBChapter {
	slug: string;
	id: string;
}

type DBPage = string;
type DBFavorite = string;

interface DlChapterID {
	slug: string;
	number: number;
}

interface Favorite {
	slug: string;
	name: string;
}
