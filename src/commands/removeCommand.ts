import { Command } from 'commander';
import { createConfig, error, getConfig } from '../lib/utils';

const removeCommand = new Command('remove')
  .alias('rm')
  .description('Remove a command from foji')
  .argument('name', 'Command name')
  .action((name: string) => {
    const config = getConfig();

    if (!config.commands[name]) error(`Command "${name}" not found`);

    delete config.commands[name];

    createConfig(config);
  });

export default removeCommand;
