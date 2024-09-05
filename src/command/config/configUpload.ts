import { Command } from 'commander';
import { githubLogin, hasGithubCli, isGithubLogged } from '../../lib/github';
import { confirm } from '@inquirer/prompts';

const configUpload = new Command('upload')
  .alias('upld')
  .alias('up')
  .description('Remove a command from foji')
  .action(async () => {
    if (!hasGithubCli()) {
      console.error('You do not have github cli installed');
      process.exit(1);
    }

    if (!isGithubLogged()) {
      console.log('Your are not logged on github cli.\n');

      const answer = await confirm({ message: 'Log you in?', default: true });

      if (!answer) process.exit(0);

      console.log();

      if (!githubLogin()) {
        console.error('Something went wrong...');
        process.exit(1);
      }
    }

    console.log('You are logged');
  });

export default configUpload;
