import { Command } from 'commander';
import { createConfig, getConfig } from '../../lib/utils';

const configRemoveCommand = new Command('remove')
  .alias('rm')
  .description('Remove a command from foji')
  .argument('scope', 'Scope of the command')
  .argument('name', 'Command name')
  .action((scope: string, name: string) => {
    const config = getConfig();

    delete config[scope][name];

    createConfig(config);
  });

export default configRemoveCommand;
