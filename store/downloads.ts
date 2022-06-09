import { defineStore, acceptHMRUpdate } from 'pinia';
import { set, get, delMany, entries } from 'idb-keyval';

export const useDownloads = defineStore('downloads-store', {
	state: () => ({
		rmList: new Set() as Set<string>,
		dlList: new Set() as Set<string>,
		downloaded: [] as DlChapter[],
		status: null as string,
		loading: false as boolean,
		refreshing: false as boolean
	}),

	actions: {
		dlClear(): void {
			if (this.loading) return;

			this.dlList = new Set() as Set<string>;
		},

		toggleDl(id: string): void {
			if (this.dlList.has(id)) this.dlList.delete(id);
			else this.dlList.add(id);
		},

		toggleRm(id: string): void {
			if (this.rmList.has(id)) this.rmList.delete(id);
			else this.rmList.add(id);
		},

		rmClear(): void {
			if (this.loading) return;

			this.rmList = new Set() as Set<string>;
		},

		async execDl(): Promise<void> {
			this.loading = true;

			let index = 0;
			for (const chapter of this.dlList as Set<string>) {
				this.status = `${index}/${this.dlList.size}`;
				index += 1;

				const { slug, number } = JSON.parse(chapter) as DlChapterID;

				const { data } = await useFetch<ChapterPages>(`/api/manga/${slug}/${number}`);
				const { pages, ...infos } = data.value;

				await Promise.all(pages.map(uri => this.dlPage(uri)));

				const id: string = `[chapter]:${slug}-${number}`;
				const value: DBChapter = { pages: [...pages], infos: { ...infos } };

				await set(id, value);
				this.downloaded = [...this.downloaded, { ...value, slug, id }];
			}

			this.status = `${this.dlList.size}/${this.dlList.size}`;

			this.loading = false;
			this.status = null;

			this.dlClear();
		},

		async dlPage(uri: string): Promise<void> {
			const page = new Image();
			page.crossOrigin = 'anonymous';

			const promise = new Promise<void>(resolve => {
				page.onerror = () => resolve();

				page.addEventListener('load', async () => {
					const canvas = document.createElement('canvas');
					canvas.width = page.width;
					canvas.height = page.height;

					const ctx = canvas.getContext('2d');
					ctx.drawImage(page, 0, 0);

					const dataURI: DBPage = canvas.toDataURL('image/png');

					await set(`[page]:${uri}`, dataURI);

					resolve();
				});
			});

			page.src = uri;
			return promise;
		},

		get(key: string): DBChapter {
			return this.downloaded.find((e: DlChapter) => e.id === key);
		},

		async refresh(cache?: [string, any][]): Promise<void> {
			if (this.refreshing) return;

			this.refreshing = true;
			const dbEntries = cache || (await entries());

			this.downloaded = dbEntries.reduce((acc, [key, value]): DlChapter[] => {
				if (!key || !value) return acc;

				const [, id]: string[] = key.split('[chapter]:');
				if (!id) return acc;

				const slug: string = id.replace(new RegExp(`-${value.infos.number}$`), '');
				return [...acc, { ...value, slug, id }];
			}, []);

			this.refreshing = false;
		},

		async remove(key: string): Promise<void> {
			const id: string = `[chapter]:${key}`;
			const { pages } = await get<DBChapter>(id);

			await delMany([...pages.map(uri => `[page]:${uri}`), id]);

			this.downloaded = [...this.downloaded].filter(e => e.id !== key);
		},

		async removeAll(): Promise<void> {
			await Promise.all([...this.rmList].map(key => this.remove(key)));
			this.rmClear();
		}
	}
});

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useDownloads, import.meta.hot));
}
