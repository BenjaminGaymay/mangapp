import { defineStore, acceptHMRUpdate } from 'pinia';
import { entries, set } from 'idb-keyval';

export const useHistory = defineStore('history-store', {
	state: () => ({
		list: {},
		loading: false as boolean,
		refreshing: false as boolean
	}),

	actions: {
		async set(key: string, value: DBHistory): Promise<void> {
			this.list[key] = value;
			return set(`[history]:${key}`, value);
		},

		async refresh(cache?: [string, any][]): Promise<void> {
			if (this.refreshing) return;

			this.refreshing = true;
			const dbEntries = cache || (await entries());

			this.list = dbEntries.reduce((acc, [key, value]) => {
				if (!key || !value) return acc;

				const [, slug]: string[] = key.split('[history]:');
				if (!slug) return acc;

				acc[key] = value;
				return acc;
			}, {});

			this.refreshing = false;
		}
	}
});

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useHistory, import.meta.hot));
}
