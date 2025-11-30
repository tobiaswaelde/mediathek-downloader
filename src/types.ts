export type Query = {
	channel?: string;
	topic?: string;
	title?: string;
	description?: string;
	durationMin?: number;
	durationMax?: number;
};

export type QueryItem = {
	channel: string;
	description: string;
	duration: number;
	filmlisteTimestamp: number;
	id: string;
	size: number;
	timestamp: number;
	title: string;
	topic: string;
	url_subtitle: string;
	url_video: string;
	url_video_hd: string;
	url_video_low: string;
	url_website: string;
};

export type QueryResult<T> = {
	err: any;
	result: {
		results: T[];
		queryInfo: {
			filmlisteTimestamp: number;
			resultCount: number;
			searchEngineTime: string;
			totalEntries: number;
			totalRelation: string;
			totalResults: number;
		};
	};
};
