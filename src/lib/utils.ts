import { spawn } from 'node:child_process';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';

type Command = Record<string, string>;
type Config = { [key: string]: Command };

const USER_DIRECTORY = os.homedir();
const CONFIG_DIRECTORY = path.join(USER_DIRECTORY, '.config');
const CONFIG_FILE_NAME = 'foji.json';
const CONFIG_FILE_PATH = path.join(CONFIG_DIRECTORY, CONFIG_FILE_NAME);
const HAS_CONFIGURATION = fs.existsSync(
  path.join(CONFIG_DIRECTORY, 'foji.json')
);

export function getConfig(): Config {
  if (!HAS_CONFIGURATION)
    fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify({}));

  const configFile: Config = JSON.parse(
    fs.readFileSync(CONFIG_FILE_PATH, 'utf-8')
  );

  return configFile;
}

export function logList(
  listName: string,
  itemsObject: { [key: string]: any }
): void;
export function logList(
  listName: string,
  itemNames: string[],
  itemsValues?: string[]
): void;
export function logList(
  listName: string,
  items: string[] | Record<string, string>,
  itemsValues?: string[]
): void {
  const minSpaces = 2;
  const isItemsArray = Array.isArray(items);
  const itemNames = isItemsArray ? items : Object.keys(items);

  console.log(
    `${listName[0].toUpperCase() + listName.slice(1).toLowerCase()}:`
  );

  const maxItemNameSize = Math.max(
    ...itemNames.map((itemName) => itemName.length)
  );

  for (let item of itemNames) {
    const spaces = ' '.repeat(maxItemNameSize - item.length + minSpaces);
    console.log(
      `  ${item}${spaces}${
        (isItemsArray ? (itemsValues ? itemsValues[item] : '') : items[item]) ??
        ''
      }`
    );
  }
}

export function runCommand(command: string): void {
  const childProcess = spawn(command, { shell: true, stdio: 'inherit' });

  // Handle the close event of the child process
  childProcess.on('close', (code: number) => {
    console.log(`Child process exited with code ${code}`);
  });

  // Handle the exit event of the main process
  process.on('exit', () => {
    childProcess.kill();
  });
}
