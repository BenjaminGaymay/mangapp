import { defineStore, acceptHMRUpdate } from 'pinia';
import { entries, set } from 'idb-keyval';

export const useHistory = defineStore('history-store', {
	state: () => ({
		list: {} as Record<string, DBHistory>,
		refreshing: false as boolean
	}),

	actions: {
		async set(key: string, value: DBHistory): Promise<void> {
			this.list = { ...this.list, [`[history]:${key}`]: value };
			return set(`[history]:${key}`, value);
		},

		get(key: string): DBHistory {
			return this.list[`[history]:${key}`];
		},

		async refresh(cache?: [string, any][]): Promise<void> {
			if (this.refreshing) return;

			this.refreshing = true;
			const dbEntries = cache || (await entries());

			this.list = dbEntries.reduce(
				(acc, [key, value]) => {
					if (!key || !value) return acc;

					const [, slug]: string[] = key.split('[history]:');
					if (!slug) return acc;

					acc[key] = value;
					return acc;
				},
				{} as Record<string, DBHistory>
			);

			this.refreshing = false;
		}
	}
});

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useHistory, import.meta.hot));
}
