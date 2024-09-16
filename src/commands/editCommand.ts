import { Command } from 'commander';
import { editConfigCommand } from '../lib/utils';

const editCommand = new Command('edit')
  .alias('e')
  .description('Edit a foji command')
  .argument('name', 'Command name')
  .argument('command', 'Command to be added')
  .action((name: string, command: string) => {
    editConfigCommand(name, command);
  });

export default editCommand;
