import { Command } from 'commander';
import { createConfig, error, getClosestWord, getConfig } from '../lib/utils';

const removeCommand = new Command('remove')
  .alias('rm')
  .description('Remove a command from foji')
  .argument('name', 'Command name')
  .action((name: string) => {
    const config = getConfig();

    if (!config.commands[name]) {
      const closestWord = getClosestWord(name, Object.keys(config.commands));

      error(
        `Command "${name}" not found`,
        isFinite(closestWord.distance)
          ? `Did you mean: "${closestWord.word}"?`
          : undefined
      );
    }

    delete config.commands[name];

    createConfig(config);
  });

export default removeCommand;
