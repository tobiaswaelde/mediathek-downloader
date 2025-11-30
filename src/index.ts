import { ApiUtil } from './api.js';
import { selectQuery } from './steps/query.js';
import { selectMovies } from './steps/select-movies.js';
import { selectFolder } from './steps/select-folder.js';
import { downloadMovies } from './download.js';

async function main() {
	console.log('Willkommen zum Mediathek Downloader!');
	console.log('Bitte geben Sie die Suchkriterien ein:');

	try {
		const q = await selectQuery();
		const items = await ApiUtil.getAllItems(q);

		const selectedItems = await selectMovies(items);
		const downloadDir = await selectFolder();

		await downloadMovies(selectedItems, downloadDir);
		console.log('Downloads abgeschlossen!');
	} catch (err) {
		console.log(err);
		process.exit(0);
	}
}
main();
