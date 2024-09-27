import { confirm } from '@inquirer/prompts';
import { spawn, exec } from 'node:child_process';
import levenshtein from 'fast-levenshtein';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';

export type Config = {
  gistUrl?: string;
  lettersSaved?: number;
  commands: { [key: string]: string };
};
type CommandArg = {
  name: string;
  isOptional?: boolean;
  defaultValue?: string;
  alternativeValue?: string;
  isSpread?: boolean;
};

export const USER_DIRECTORY = os.homedir();
export const CONFIG_DIRECTORY = path.join(USER_DIRECTORY, '.config');
export const CONFIG_FILE_NAME = 'foji.json';
export const CONFIG_FILE_PATH = path.join(CONFIG_DIRECTORY, CONFIG_FILE_NAME);
export const HAS_CONFIGURATION = fs.existsSync(
  path.join(CONFIG_DIRECTORY, 'foji.json')
);

export function createConfig(
  newConfig: Config = { commands: {} },
  useLettersSaved = false
): Config {
  if (!HAS_CONFIGURATION) fs.mkdirSync(CONFIG_DIRECTORY, { recursive: true });

  if (!useLettersSaved) newConfig.lettersSaved = getConfig().lettersSaved;

  fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify(newConfig, null, 2));
  return newConfig;
}

export function getConfig(): Config {
  if (!HAS_CONFIGURATION) createConfig();

  const configFile: Config = JSON.parse(
    fs.readFileSync(CONFIG_FILE_PATH, 'utf-8')
  );

  return configFile.commands ? configFile : createConfig();
}

export async function addConfigCommand(key: string, command: string) {
  const newConfig: Config = getConfig();

  if (newConfig.commands[key]) {
    console.log('This command already exists.\n');

    const replace = await confirm({ message: 'Replace it?' });

    if (!replace) return;
  }

  newConfig.commands[key] = command;

  createConfig(newConfig);
}

export function changeGistUrl(newUrl: string) {
  const newConfig: Config = getConfig();

  newConfig.gistUrl = newUrl;

  createConfig(newConfig);
}

export function changeLettersSaved(letters: number) {
  const newConfig: Config = getConfig();

  newConfig.lettersSaved = (newConfig.lettersSaved ?? 0) + letters;

  createConfig(newConfig, true);
}

export function logList(
  listName: string,
  items: { [key: string]: any },
  maxItemNameSize?: number
) {
  const minSpaces = 2;
  const itemNames = Object.keys(items);

  console.log(
    `${listName[0].toUpperCase() + listName.slice(1).toLowerCase()}:`
  );

  if (!maxItemNameSize)
    maxItemNameSize = Math.max(...itemNames.map((itemName) => itemName.length));

  for (let item of itemNames) {
    const spaces = ' '.repeat(maxItemNameSize - item.length + minSpaces);
    console.log(`  ${item}${spaces}${items[item] ?? ''}`);
  }
}

export function formatCommand(
  command: string,
  args: string[],
  debug = false
): string | undefined {
  const splitCommand = command.split(/<([^>]+)>/g);

  let commandArgs = splitCommand.filter((_, index) => (index + 1) % 2 === 0);

  let allowRequired = true;

  const commandArguments: CommandArg[] = commandArgs.map((arg, index) => {
    const object: CommandArg = { name: '' };

    const hasDefaultValue = arg.includes('??');
    const hasElse = !hasDefaultValue && arg.includes(':');
    const isTernary = !hasDefaultValue && hasElse && arg.includes('?');
    const isOptional = !hasDefaultValue && !hasElse && arg.includes('?');
    const isSpread = arg.includes('...');

    // TODO - make linting function

    if (hasDefaultValue) {
      const [name, defaultValue] = arg.split('??');
      object.name = name.trim();
      object.defaultValue = defaultValue.trim();

      allowRequired = false;
    } else if (isTernary) {
      const [name, values] = arg.split('?');
      object.name = name.trim();

      const [defaultValue, alternativeValue] = values.split(':');
      object.defaultValue = defaultValue.trim();
      object.alternativeValue = alternativeValue.trim();

      allowRequired = false;
    } else if (isOptional) {
      const name = arg.replace('?', '').trim();
      object.name = name;
      object.isOptional = true;

      allowRequired = false;
    } else if (isSpread) {
      if (index !== commandArgs.length - 1)
        error('You can only use a spread argument at the last position');

      const name = arg.replace('...', '').trim();
      object.name = name;
      object.isOptional = true;
      object.isSpread = true;

      allowRequired = false;
    } else {
      if (!allowRequired)
        error('You cannot have a required argument after a optional argument');

      object.name = arg.trim();
    }

    return object;
  });

  const necessaryArgs = commandArguments.filter(
    (arg) => !arg.isOptional && !arg.defaultValue
  );

  if (necessaryArgs.length > args.length) {
    error(`The argument "${commandArguments[args.length].name}" is missing`);
  }

  args = args.map((arg) => (arg === '_' ? undefined : arg));

  for (let index = 0; index < commandArguments.length; index++) {
    const arg = commandArguments[index];

    let argValue = arg.isSpread
      ? args.slice(index).join(' ')
      : arg.alternativeValue
      ? args[index]
        ? arg.defaultValue
        : arg.alternativeValue
      : args[index] ?? arg.defaultValue ?? '';

    splitCommand[index * 2 + 1] = argValue;
  }

  const finalCommand = splitCommand.join('');

  if (debug) {
    console.log('Command:', command);
    console.log('Command arguments:', commandArguments);
    console.log('Received arguments:', args);
    console.log(`Formatted command: ${finalCommand}`);
    console.log();
    console.log('Running command...');
    console.log();
  }

  return finalCommand;
}

export function runUserCommand(command: string): void {
  const childProcess = spawn(command, {
    shell: true,
    stdio: 'inherit',
  });

  process.on('exit', () => {
    childProcess.kill();
  });
}

export function openDirectory(path: string) {
  let command = '';
  switch (process.platform) {
    case 'darwin':
      command = 'open';
      break;
    case 'win32':
      command = 'explorer';
      break;
    default:
      command = 'xdg-open';
      break;
  }

  exec(`${command} "${path}"`);
}

export function getClosestWord(
  searchWord: string,
  words: string[],
  defaultWord?: ''
): { distance: number; word: string } {
  return words.reduce(
    (data, word) => {
      const distance = levenshtein.get(searchWord, word);

      if (distance < data.distance) return { distance, word };
      return data;
    },
    { distance: Infinity, word: defaultWord }
  );
}

export function error(error: string, optionalMessage?: string) {
  console.error(error);
  if (optionalMessage) console.log(optionalMessage);
  process.exit(1);
}
