import { spawn } from 'node:child_process';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';

type Command = Record<string, string>;
export type Config = { [key: string]: Command };
type CommandArg = {
  name: string;
  isOptional?: boolean;
  defaultValue?: string;
  alternativeValue?: string;
};

export const USER_DIRECTORY = os.homedir();
export const CONFIG_DIRECTORY = path.join(USER_DIRECTORY, '.config');
export const CONFIG_FILE_NAME = 'foji.json';
export const CONFIG_FILE_PATH = path.join(CONFIG_DIRECTORY, CONFIG_FILE_NAME);
export const HAS_CONFIGURATION = fs.existsSync(
  path.join(CONFIG_DIRECTORY, 'foji.json')
);

export function createConfig() {
  fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify({}));
}

export function getConfig(): Config {
  if (!HAS_CONFIGURATION) createConfig();

  const configFile: Config = JSON.parse(
    fs.readFileSync(CONFIG_FILE_PATH, 'utf-8')
  );

  return configFile;
}

export function updateConfig(config: Config) {
  const newConfig: Config = getConfig();

  for (let scope in config) {
    newConfig[scope] = { ...newConfig[scope], ...config[scope] };
  }

  fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify(newConfig, null, 2));
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

export function formatCommand(
  command: string,
  args: string[],
  debug = false
): string | undefined {
  const splitCommand = command.split(/<([^>]+)>/g);

  let commandArgs = splitCommand.filter((_, index) => (index + 1) % 2 === 0);

  let allowRequired = true;

  const commandArguments: CommandArg[] = commandArgs.map((arg) => {
    const object: CommandArg = { name: '' };

    const hasDefaultValue = arg.includes('??');
    const hasElse = !hasDefaultValue && arg.includes(':');
    const isTernary = !hasDefaultValue && hasElse && arg.includes('?');
    const isOptional = !hasDefaultValue && !hasElse && arg.includes('?');

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
    } else {
      if (!allowRequired) {
        throw new Error(
          'You cannot have a required argument after a optional argument'
        );
      }
      object.name = arg.trim();
    }

    return object;
  });

  const necessaryArgs = commandArguments.filter(
    (arg) => !arg.isOptional && !arg.defaultValue
  );

  if (necessaryArgs.length > args.length) {
    console.log(
      `The argument "${commandArguments[args.length].name}" is missing`
    );
    return;
  }

  args = args.map((arg) => (arg === '_' ? undefined : arg));

  if (debug) {
    console.log('Command:', command);
    console.log('Command arguments:', commandArguments);
    console.log('Received arguments:', args);
  }

  for (let index = 0; index < commandArguments.length; index++) {
    const arg = commandArguments[index];
    let argValue = arg.alternativeValue
      ? args[index]
        ? arg.defaultValue
        : arg.alternativeValue
      : args[index] ?? arg.defaultValue ?? '';

    splitCommand[index * 2 + 1] = argValue;
  }

  return splitCommand.join('');
}

export function runUserCommand(
  command: string,
  args: string[],
  debug = false
): void {
  command = formatCommand(command, args, debug);

  if (!command) return;

  const childProcess = spawn(command, {
    shell: true,
    stdio: 'inherit',
  });

  process.on('exit', () => {
    childProcess.kill();
  });
}
