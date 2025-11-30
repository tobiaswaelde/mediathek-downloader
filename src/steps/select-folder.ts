import inquirer from 'inquirer';
import os from 'node:os';
import path from 'node:path';
import fs from 'node:fs';

export async function selectFolder(): Promise<string> {
	const res = await inquirer.prompt({
		type: 'input',
		name: 'folder',
		message: `Ordnername zum Speichern der Downloads: (Wird in '${os.homedir()}' erstellt)`,
	});

	const dir = path.resolve(os.homedir(), res.folder);

	fs.mkdirSync(dir, { recursive: true });

	return dir;
}
