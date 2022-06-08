import { defineStore, acceptHMRUpdate } from 'pinia';
import { del, entries, set } from 'idb-keyval';

export const useFavorites = defineStore('favorites-store', {
	state: () => ({
		list: [] as Favorite[],
		loading: false as boolean,
		rClearName: new RegExp(`(${['manga', 'manhua', 'manhwa', 'bande dessinée'].join('|')})`, 'i') as RegExp,
		refreshing: false as boolean
	}),

	actions: {
		clear(): void {
			if (this.loading) return;
			this.favorites = [];
		},

		find(key: string): boolean {
			return this.list.find(({ slug }) => slug === key);
		},

		toggle(slug: string, title: string): void {
			if (this.find(slug)) {
				del(`[favorite]:${slug}`);
				this.list = this.list.filter(({ slug: key }) => key !== slug);
			} else {
				set(`[favorite]:${slug}`, title);

				const name: string = title.replace(this.rClearName, '');
				this.list.push({ slug, name });
			}
		},

		async refresh(cache?: [string, any][]): Promise<void> {
			if (this.refreshing) return;

			this.refreshing = true;
			const dbEntries = cache || (await entries());

			this.list = dbEntries.reduce((acc, [key, raw]): Favorite[] => {
				if (!key || !raw) return acc;

				const [, slug]: string[] = key.split('[favorite]:');
				if (!slug) return acc;

				const name: string = raw.replace(this.rClearName, '');
				return [...acc, { slug, name }];
			}, []);

			this.refreshing = false;
		}
	}
});

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useFavorites, import.meta.hot));
}
