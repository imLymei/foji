import { Command } from 'commander';
import { createConfig, getConfig } from '../lib/utils';

const renameCommand = new Command('rename')
  .alias('rn')
  .description('Rename a foji command')
  .argument('name', 'Old command name')
  .argument('new name', 'New command name')
  .action((oldName: string, newName: string) => {
    const config = getConfig();

    config.commands[newName] = config.commands[oldName];
    delete config.commands[oldName];

    createConfig(config);
  });

export default renameCommand;
