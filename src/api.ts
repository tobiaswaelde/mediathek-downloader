import axios from 'axios';
import { Query } from './types.js';

export const api = axios.create({
	baseURL: 'https://mediathekviewweb.de',
});

export class ApiUtil {
	private static api = axios.create({
		baseURL: 'https://mediathekviewweb.de',
	});

	private static buildQuery = (query: Query, offset = 0, size = 5) => {
		const queries: { fields: string[]; query: string }[] = [];
		if (query.channel) {
			queries.push({ fields: ['channel'], query: query.channel });
		}
		if (query.topic) {
			queries.push({ fields: ['topic'], query: query.topic });
		}
		if (query.title) {
			queries.push({ fields: ['title'], query: query.title });
		}
		if (query.description) {
			queries.push({ fields: ['description'], query: query.description });
		}

		return {
			queries: queries.length > 0 ? queries : undefined,
			sortBy: 'timestamp',
			sortOrder: 'desc',
			future: true,
			offset: offset,
			size: size,
		};
	};

	public static getNumberOfItems = async (query: Query) => {
		try {
			const res = await this.api.post('/api/query', this.buildQuery(query));
		} catch {
			//
		} finally {
			//
		}
	};
}
