import inquirer from 'inquirer';
import { QueryItem } from '../types.js';

export async function selectMovies(items: QueryItem[]): Promise<QueryItem[]> {
	const selected = await inquirer.prompt([
		{
			type: 'checkbox',
			name: 'items',
			message: 'Filme zum Download auswählen',
			choices: [
				...items.map((item) => ({ value: item.id, name: `${item.topic} - ${item.title}` })),
				new inquirer.Separator(),
			],
			loop: true,
		},
	]);

	return items.filter((item) => selected.items.includes(item.id));
}
