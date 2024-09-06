import { Command } from 'commander';
import { createConfig, getConfig } from '../../lib/utils';

const configRemoveCommand = new Command('remove')
  .alias('r')
  .description('Remove a command from foji')
  .argument('name', 'Command name')
  .action((name: string) => {
    const config = getConfig();

    delete config.commands[name];

    createConfig(config);
  });

export default configRemoveCommand;
