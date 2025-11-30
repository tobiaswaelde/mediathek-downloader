import inquirer from 'inquirer';
import { Query } from '../types.js';
import { ApiUtil } from '../api.js';

export async function selectQuery(): Promise<Query> {
	return new Promise<Query>(async (resolve, reject) => {
		let nextStep = 'change-query';
		let query: Query = {};

		while (nextStep === 'change-query') {
			query = await inquirer.prompt([
				{ type: 'input', name: 'channel', message: 'Sender:', optional: true },
				{ type: 'input', name: 'topic', message: 'Thema:', optional: true },
				{ type: 'input', name: 'title', message: 'Titel:', optional: true },
				{ type: 'input', name: 'description', message: 'Beschreibung:', optional: true },
				{ type: 'number', name: 'durationMin', message: 'min. Dauer (Minuten):', optional: true },
				{ type: 'number', name: 'durationMax', message: 'max. Dauer (Minuten):', optional: true },
			]);

			// load preview items
			const previewRes = await ApiUtil.getPreviewItems(query);
			if (previewRes) {
				if (previewRes.result.queryInfo.totalResults === 0) {
					console.log('Keine Ergebnisse gefunden.');
				} else {
					console.log(`Es wurden ${previewRes.result.queryInfo.totalResults} Ergebnisse gefunden.`);
					previewRes.result.results.forEach((item, i) => {
						console.log(`${i + 1}. ${item.topic} - ${item.title}`);
					});
					console.log(
						`${
							previewRes.result.queryInfo.totalResults - previewRes.result.results.length
						} weitere Ergebnisse...`
					);
				}
			} else {
				console.log('Fehler beim Laden der Vorschauergebnisse.');
			}

			const nextStepRes = await inquirer.prompt([
				{
					type: 'select',
					name: 'continue',
					message: 'Wie möchten Sie fortfahren?',
					choices: [
						{ value: 'change-query', name: 'Suchkriterien ändern' },
						{ value: 'load-movies', name: 'Alle Filme mit Suchkriterien laden' },
						{ value: 'exit', name: 'Beenden' },
					],
				},
			]);
			nextStep = nextStepRes.continue;
		}

		if (nextStep === 'exit') {
			reject();
		}

		// if (nextStep === 'select-items') {
		// }
		resolve(query);
	});
}
