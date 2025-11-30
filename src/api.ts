import axios from 'axios';
import { Query, QueryItem, QueryResult } from './types.js';

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

	public static getPreviewItems = async (
		query: Query
	): Promise<QueryResult<QueryItem> | undefined> => {
		try {
			const res = await this.api.post<QueryResult<QueryItem>>(
				'/api/query',
				this.buildQuery(query, 0, 5)
			);

			return res.data;
		} catch (err) {
			return undefined;
		}
	};

	public static getAllItems = async (query: Query): Promise<QueryItem[]> => {
		try {
			let items: QueryItem[] = [];
			let offset = 0;
			let totalResults = 0;
			const size = 15;

			do {
				const res = await this.api.post<QueryResult<QueryItem>>(
					'/api/query',
					this.buildQuery(query, offset, size)
				);

				items.push(...res.data.result.results);
				totalResults = res.data.result.queryInfo.totalResults;
				offset += size;
			} while (items.length < totalResults);

			return items;
		} catch (err) {
			return [];
		}
	};
}
