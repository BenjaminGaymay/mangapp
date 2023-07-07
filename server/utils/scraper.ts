// import cloudscraper from 'cloudflare-scraper';
// import makeFetchCookie from 'fetch-cookie';

// let headers = {
// 	'User-Agent': '',
// 	Cookie: ''
// };

// export async function fetchURL(url: string, options: any) {
// 	if (!headers['User-Agent'] || !headers['Cookie']) {
// 		const firstTry = await refreshCookies(url, options);
// 		if (firstTry) return firstTry;
// 	}

// 	let lHeaders = options && options.headers ? { ...options.headers, ...headers } : headers;
// 	console.log('fetching url:', url);

// 	const response = await fetch(url, { ...options, headers: lHeaders });
// 	if (response.status !== 403) return response;

// 	const secondTry = await refreshCookies(url, options);
// 	if (secondTry) return secondTry;

// 	console.log('fetching url2:', url);
// 	lHeaders = options && options.headers ? { ...options.headers, ...headers } : headers;
// 	return await fetch(url, { ...options, headers: lHeaders });
// }

// async function refreshCookies(url: string, options: {}) {
// 	console.log('refreshing cookies');

// 	try {
// 		const response = await cloudscraper.get(url, options);
// 		return response;
// 	} catch (e) {
// 		headers['User-Agent'] = e.options.headers['user-agent'];
// 		headers['Cookie'] = await e.options.cookieJar.getCookieString(url);
// 	}
// // }

// import ChromeLauncher from 'chrome-launcher';
// import chromium from 'chromium';
// import CDP from 'chrome-remote-interface';
// import Xvfb from 'xvfb';
// import fs from 'fs';

// class Browser {
// 	static async create() {
// 		const browser = new Browser();
// 		await browser.init();
// 		return browser;
// 	}

// 	async init() {
// 		try {
// 			const { CHROME_EXECUTABLE_PATH, CF_SCRAPER_HEADLESS, HTTP_PROXY, HTTPS_PROXY } = process.env;
// 			if (process.platform === 'linux' && CF_SCRAPER_HEADLESS !== 'false') {
// 				this.xvfb = new Xvfb({
// 					silent: true,
// 					xvfb_args: ['-screen', '0', '1280x720x24', '-ac']
// 				});
// 				this.xvfb.startSync();
// 			}

// 			let chromePath = chromium.path;
// 			if (CHROME_EXECUTABLE_PATH) {
// 				chromePath = CHROME_EXECUTABLE_PATH;
// 			}
// 			const chromeFlags = ['--no-sandbox'];
// 			const proxy = HTTPS_PROXY ? HTTPS_PROXY : HTTP_PROXY;
// 			if (proxy) {
// 				chromeFlags.push(`--proxy-server="${proxy}"`);
// 			}

// 			this.chrome = await ChromeLauncher.launch({
// 				chromePath,
// 				chromeFlags
// 			});
// 			this.cdpSession = await CDP({ port: this.chrome.port });

// 			const { Network, Page, Runtime } = this.cdpSession;

// 			await Runtime.enable();
// 			await Network.enable();
// 			await Page.enable();
// 			await Page.setLifecycleEventsEnabled({ enabled: true });
// 		} catch (e) {
// 			await this.close();
// 			throw e;
// 		}
// 	}

// 	async close() {
// 		if (this.cdpSession) {
// 			await this.cdpSession.close();
// 			this.cdpSession = null;
// 		}
// 		if (this.chrome) {
// 			await this.chrome.kill();
// 			this.chrome = null;
// 		}
// 		if (this.xvfb) {
// 			this.xvfb.stopSync();
// 			this.xvfb = null;
// 		}
// 	}

// 	get cdp() {
// 		if (!this.cdpSession) {
// 			throw new Error('browser not initialised');
// 		}
// 		return this.cdpSession;
// 	}

// 	async waitUntil(eventName, timeout) {
// 		const { Page } = this.cdp;

// 		let timeoutId;
// 		const timeoutPromise = new Promise((resolve, reject) => {
// 			timeoutId = setTimeout(() => reject('timeout'), timeout);
// 		});
// 		const eventPromise = new Promise(resolve => {
// 			Page.lifecycleEvent(args => {
// 				if (args.name === eventName) {
// 					if (timeoutId) {
// 						clearTimeout(timeoutId);
// 					}
// 					resolve();
// 				}
// 			});
// 		});
// 		return Promise.race([eventPromise, timeoutPromise]);
// 	}

// 	async getPageHtml() {
// 		const { DOM } = this.cdp;
// 		const rootNode = await DOM.getDocument({ depth: -1 });
// 		const pageSource = await DOM.getOuterHTML({
// 			nodeId: rootNode.root.nodeId
// 		});
// 		return pageSource.outerHTML;
// 	}

// 	async getUserAgent() {
// 		const { Runtime } = this.cdp;
// 		const evaluation = await Runtime.evaluate({ expression: 'window.navigator.userAgent' });
// 		return evaluation.result.value;
// 	}

// 	async navigate(url) {
// 		const { Page } = this.cdp;
// 		await Page.navigate({ url });
// 	}

// 	async getCookies() {
// 		const { Network } = this.cdp;
// 		const { cookies } = await Network.getCookies();
// 		return cookies;
// 	}

// 	async takeScreenshot(filepath) {
// 		const { Page } = this.cdp;
// 		const { data } = await Page.captureScreenshot();
// 		fs.writeFileSync(filepath, Buffer.from(data, 'base64'));
// 	}
// }

// function isCloudflareJSChallenge(content) {
// 	return content.includes('_cf_chl_opt');
// }

// export let browser;
// export async function fetchURL(url) {
// 	try {
// 		if (!browser) browser = await Browser.create();
// 		await browser.navigate(url);

// 		const timeoutInMs = 16000;

// 		let count = 1;
// 		let content = '';
// 		while (content == '' || isCloudflareJSChallenge(content)) {
// 			await browser.waitUntil('networkAlmostIdle', timeoutInMs);
// 			content = await browser.getPageHtml();
// 			if (count++ > 10) {
// 				throw new Error('stuck');
// 			}
// 		}
// 		// if (browser) await browser.close();

// 		return content;
// 	} catch (e) {
// 		// if (browser) {
// 		// 	await browser.close();
// 		// }
// 		// throw e;
// 	}
// }
