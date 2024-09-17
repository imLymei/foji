import { Command } from 'commander';
import {
  Config,
  createConfig,
  error,
  getClosestWord,
  getConfig,
} from '../lib/utils';

const editCommand = new Command('edit')
  .alias('e')
  .description('Edit a foji command')
  .argument('name', 'Command name')
  .argument('command', 'New command')
  .action((name: string, command: string) => {
    const newConfig: Config = getConfig();

    if (!newConfig.commands[name]) {
      const closestWord = getClosestWord(name, Object.keys(newConfig.commands));

      error(
        `Command "${name}" not found`,
        isFinite(closestWord.distance)
          ? `Did you mean: "${closestWord.word}"?`
          : undefined
      );
    }

    newConfig.commands[name] = command;

    createConfig(newConfig);
  });

export default editCommand;
