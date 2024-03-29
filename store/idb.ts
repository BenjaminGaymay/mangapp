import { defineStore, acceptHMRUpdate } from 'pinia';
import { entries } from 'idb-keyval';
import { useDownloads } from './downloads';
import { useFavorites } from './favorites';
import { useHistory } from './history';

export const useIdb = defineStore('idb-store', {
	state: () => ({
		called: 0 as number,
		loaded: false as boolean,
		loading: false as boolean
	}),

	actions: {
		async refreshAll(): Promise<void> {
			this.called += 1;

			if (this.loading || this.loaded) return;
			this.loading = true;

			const { refresh: rDownloads } = useDownloads();
			const { refresh: rFavorites } = useFavorites();
			const { refresh: rHistory } = useHistory();

			const cache: [string, any][] = await entries();

			rDownloads(cache);
			rFavorites(cache);
			rHistory(cache);

			this.loading = false;
			this.loaded = true;
		}
	}
});

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useIdb, import.meta.hot));
}
