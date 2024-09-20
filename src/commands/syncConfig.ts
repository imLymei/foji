import { Command } from 'commander';
import {
  uploadConfiguration,
  updateCloudConfiguration,
  getConfiguration,
  basicGithubVerifications,
} from '../lib/github';
import {
  changeGistUrl,
  Config,
  createConfig,
  error,
  getConfig,
} from '../lib/utils';

const syncConfig = new Command('sync')
  .alias('s')
  .description("Sync your local foji configuration with it's github gist")
  .action(async () => {
    await basicGithubVerifications();

    const config = getConfig();
    let gistUrl = config.gistUrl;

    if (!gistUrl) {
      console.log('Creating new Gist...');

      gistUrl = uploadConfiguration();

      if (!gistUrl) error('Something went wrong...');

      changeGistUrl(gistUrl);

      if (!updateCloudConfiguration()) error('Something went wrong...');
    }

    const newGist = getConfiguration(gistUrl);

    if (!newGist)
      error('Something went wrong fetching you cloud configuration...');

    try {
      const newConfig: Config = JSON.parse(newGist);

      delete newConfig.lettersSaved;

      createConfig(newConfig);
      console.log('Configuration synced!');
    } catch {
      error('Something went wrong');
    }
  });

export default syncConfig;
