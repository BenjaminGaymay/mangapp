import { promisify } from 'node:util';
import zlib from 'node:zlib';

import { getRequestHeader, send, setResponseHeader } from 'h3';

function getCompressionMethod(encoding: string) {
	if (encoding?.includes('br')) return 'br';
	if (encoding?.includes('gzip')) return 'gzip';
	if (encoding?.includes('deflate')) return 'deflate';

	return undefined;
}

export default defineNitroPlugin(nitro => {
	nitro.hooks.hook('render:response', async (response, { event }) => {
		const contentType = response.headers?.['content-type'];
		if (!contentType?.startsWith('text/html')) return;

		if (typeof response.body !== 'string') return;

		const encoding = getRequestHeader(event, 'accept-encoding');
		if (!encoding) return;

		const method = getCompressionMethod(encoding);
		if (!method) return;

		const encoded = await promisify(zlib[method === 'br' ? 'brotliCompress' : method])(response.body);
		if (!encoded) return;

		setResponseHeader(event, 'Content-Encoding', method);
		setResponseHeader(event, 'Content-Length', encoded.length);

		send(event, encoded);
	});
});
