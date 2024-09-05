import { Command } from 'commander';
import { addConfigCommand } from '../../lib/utils';

const configAddCommand = new Command('add')
  .alias('a')
  .description('Add a new command to foji')
  .argument('name', 'Command name')
  .argument('command', 'Command to be added')
  .action((name: string, command: string) => {
    addConfigCommand(name, command);
  });

export default configAddCommand;
