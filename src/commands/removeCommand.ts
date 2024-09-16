import { Command } from 'commander';
import { createConfig, getConfig } from '../lib/utils';

const removeCommand = new Command('remove')
  .alias('r')
  .description('Remove a command from foji')
  .argument('name', 'Command name')
  .action((name: string) => {
    const config = getConfig();

    if (!config.commands[name]) {
      console.error('Command not found');
      process.exit(0);
    }

    delete config.commands[name];

    createConfig(config);
  });

export default removeCommand;
