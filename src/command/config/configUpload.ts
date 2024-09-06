import { Command } from 'commander';
import {
  githubCreateGist,
  githubLogin,
  githubUpdateGist,
  hasGithubCli,
  isGithubLogged,
} from '../../lib/github';
import { confirm } from '@inquirer/prompts';
import { changeGistUrl, getConfig } from '../../lib/utils';

const configUpload = new Command('upload')
  .alias('u')
  .description('Upload your foji configuration to github gist')
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

    const config = getConfig();

    if (!config.gistUrl) {
      console.log('Creating new Gist...');

      const gistUrl = githubCreateGist();

      if (!gistUrl) {
        console.log('Something went wrong...');
        process.exit(1);
      }

      changeGistUrl(gistUrl);
    }

    if (!githubUpdateGist()) {
      console.log('Something went wrong...');
      process.exit(1);
    }

    console.log('configuration uploaded!');
  });

export default configUpload;
