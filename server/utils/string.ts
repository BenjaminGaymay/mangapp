import { decodeHTML } from 'entities';

export function clearString(string: string): string {
	return decodeHTML(string).replace(/(\n|\t)/g, ' ');
}
