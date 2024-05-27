import { Command } from 'commander';
import { Config, updateConfig } from '../lib/utils';

const configCommand = new Command('add')
  .alias('a')
  .description('Add a new command to foji')
  .argument('scope', 'Scope of the command')
  .argument('name', 'Command name')
  .argument('command', 'Command to be added')
  .action((scope: string, name: string, command: string) => {
    const newConfig: Config = { [scope]: { [name]: command } };

    updateConfig(newConfig);
  });

export default configCommand;
