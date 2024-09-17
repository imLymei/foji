import { Command } from 'commander';
import { createConfig, error, getClosestWord, getConfig } from '../lib/utils';

const renameCommand = new Command('rename')
  .alias('rn')
  .description('Rename a foji command')
  .argument('name', 'Old command name')
  .argument('new name', 'New command name')
  .action((oldName: string, newName: string) => {
    const config = getConfig();

    if (!config.commands[oldName]) {
      const closestWord = getClosestWord(oldName, Object.keys(config.commands));

      error(
        `Command "${oldName}" not found`,
        isFinite(closestWord.distance)
          ? `Did you mean: "${closestWord.word}"?`
          : undefined
      );
    }

    config.commands[newName] = config.commands[oldName];
    delete config.commands[oldName];

    createConfig(config);
  });

export default renameCommand;
