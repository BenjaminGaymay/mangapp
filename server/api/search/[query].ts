import { getBypassHeaders } from '~/server/utils/scraper';

async function searchManga(query: string): Promise<QueryResult[]> {
	const uri = 'https://www.japscan.lol/live-search/';

	const params: URLSearchParams = new URLSearchParams();
	params.append('search', query);

	// const headers = (await getBypassHeaders(uri)) || {};

	const response = await fetch(uri, {
		method: 'POST',
		body: params.toString(),
		headers: {
			'X-Requested-With': 'XMLHttpRequest',
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	});

	if (!response.ok) return [];

	const data: QueryResult[] = await response.json();

	return data.map(({ name, url }) => ({ name, url, slug: url.split('/')[2] }));
}

export default defineEventHandler(async (event): Promise<QueryResult[] | undefined> => {
	const query: string = event.context.params?.query || '';
	const normalized: string = query.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

	try {
		return await searchManga(normalized);
	} catch (e: any) {
		console.error('error: searchManga:', e?.message || e?.stack || e);
	}
});
