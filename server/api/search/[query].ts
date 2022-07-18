async function searchManga(query): Promise<QueryResult[]> {
	const params: URLSearchParams = new URLSearchParams();
	params.append('search', query);

	const response: Response = await fetch('https://www.japscan.me/live-search/', {
		method: 'POST',
		headers: { 'X-Requested-With': 'XMLHttpRequest' },
		body: params
	});

	const data: QueryResult[] = await response.json();
	return data.map(({ name, url }) => ({ name, url, slug: url.split('/')[2] }));
}

export default defineEventHandler(async (event): Promise<QueryResult[]> => {
	const query: string = event.context.params.query;
	const normalized: string = query.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

	return searchManga(normalized);
});
