import inquirer from 'inquirer';
import { api } from './api.js';

async function main() {
	console.log('Willkommen zum Mediathek Downloader!');
	console.log('Bitte geben Sie die Suchkriterien ein:');
	const query = await inquirer.prompt([
		{ type: 'input', name: 'channel', message: 'Sender:', optional: true },
		{ type: 'input', name: 'topic', message: 'Thema:', optional: true },
		{ type: 'input', name: 'title', message: 'Titel:', optional: true },
		{ type: 'input', name: 'description', message: 'Beschreibung:', optional: true },
		{ type: 'number', name: 'durationMin', message: 'min. Dauer (Minuten):', optional: true },
		{ type: 'number', name: 'durationMax', message: 'max. Dauer (Minuten):', optional: true },
	]);

	const res = await api.post('/api/query', {
		queries: [
			{ fields: ['channel'], query: query.channel },
			{ fields: ['topic'], query: query.topic },
			{ fields: ['title'], query: query.title },
			{ fields: ['description'], query: query.description },
		],
		sortBy: 'timestamp',
		sortOrder: 'desc',
		future: true,
		duration_min: query.durationMin ? query.durationMin * 60 : undefined,
		duration_max: query.durationMax ? query.durationMax * 60 : undefined,
		offset: 0,
		size: 5,
	});

	const selected = await inquirer.prompt([
		{
			type: 'checkbox',
			name: 'items',
			message: 'Filme auswählen',
			choices: ['Film 1', 'Film 2', 'Film 3'],
			loop: false,
		},
	]);

	console.log(res);
	console.log(selected);
}
main();
