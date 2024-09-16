import { Command } from 'commander';
import {
  uploadConfiguration,
  updateCloudConfiguration,
  basicGithubVerifications,
} from '../lib/github';
import { changeGistUrl, error, getConfig } from '../lib/utils';

const uploadConfig = new Command('upload')
  .alias('u')
  .description('Upload your foji configuration to github gist')
  .action(async () => {
    await basicGithubVerifications();

    const config = getConfig();

    if (!config.gistUrl) {
      console.log('Creating new Gist...');

      const gistUrl = uploadConfiguration();

      if (!gistUrl) error('Something went wrong...');

      changeGistUrl(gistUrl);
    }

    if (!updateCloudConfiguration()) error('Something went wrong...');

    console.log('Configuration uploaded!');
  });

export default uploadConfig;
