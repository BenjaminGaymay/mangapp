import cloudscraper from 'cloudflare-scraper';

async function searchManga(query): Promise<QueryResult[]> {
	const params: URLSearchParams = new URLSearchParams();
	params.append('search', query);

	const response = await cloudscraper.post('https://www.japscan.me/live-search/', {
		body: params.toString(),
		headers: {
			'X-Requested-With': 'XMLHttpRequest',
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	});

	const data: QueryResult[] = JSON.parse(response.body);

	return data.map(({ name, url }) => ({ name, url, slug: url.split('/')[2] }));
}

export default defineEventHandler(async (event): Promise<QueryResult[]> => {
	const query: string = event.context.params.query;
	const normalized: string = query.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

	return searchManga(normalized);
});
