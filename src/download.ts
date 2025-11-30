import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import https from 'node:https';
import { URL } from 'node:url';
import { MultiBar, Presets } from 'cli-progress';
import { QueryItem } from './types.js';

export async function downloadMovies(items: QueryItem[], folder: string) {
	const multiBar = new MultiBar(
		{
			clearOnComplete: false,
			hideCursor: true,
			format: '{item} von {items}: {name} |{bar}| {percentage}% | {value}/{total} bytes',
		},
		Presets.shades_grey
	);

	for (let i = 0; i < items.length; i++) {
		const item = items[i];
		const url = item.url_video_hd;
		const size = await getContentLength(item.url_video_hd);

		const filename = path.basename(
			`${item.topic} - ${item.title}`.replace(/[\/\\?%*:|"<>]/g, '_') + path.extname(url)
		);
		const filePath = path.join(folder, filename);

		const fileBar = multiBar.create(size, 0, { item: i + 1, items: items.length, name: filename });

		await downloadFile(url, filePath, (chunkSize) => {
			fileBar.increment(chunkSize);
		});

		fileBar.stop();
	}

	multiBar.stop();
}

/**
 * Get content-length header
 */
async function getContentLength(urlStr: string): Promise<number> {
	const url = new URL(urlStr);

	return new Promise((resolve, reject) => {
		const lib = url.protocol === 'https:' ? https : http;
		const req = lib.request(url, { method: 'HEAD' }, (res) => {
			const len = parseInt(res.headers['content-length'] || '0', 10);
			resolve(len);
		});

		req.on('error', reject);
		req.end();
	});
}

/**
 * Stream download a file
 */
async function downloadFile(
	urlStr: string,
	destPath: string,
	onProgress?: (chunkSize: number) => void
): Promise<void> {
	const url = new URL(urlStr);

	return new Promise((resolve, reject) => {
		const lib = url.protocol === 'https:' ? https : http;

		const file = fs.createWriteStream(destPath);

		lib
			.get(url, (res) => {
				if (res.statusCode && res.statusCode >= 400) {
					reject(new Error(`Download error: ${res.statusCode} for ${urlStr}`));
					return;
				}

				res.on('data', (chunk) => {
					file.write(chunk);
					onProgress?.(chunk.length);
				});

				res.on('end', () => {
					file.end();
					resolve();
				});

				res.on('error', reject);
			})
			.on('error', reject);
	});
}
