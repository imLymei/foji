import { Command } from 'commander';
import { basicGithubVerifications, getConfiguration } from '../lib/github';
import { confirm } from '@inquirer/prompts';
import { Config, createConfig, error } from '../lib/utils';

const downloadConfig = new Command('download')
  .alias('d')
  .argument('gistUrl', 'Url/id from the configuration gist')
  .description('Download a foji configuration from github gist')
  .action(async (gistUrl: string) => {
    await basicGithubVerifications();

    console.log('Downloading configuration...');

    const gist = getConfiguration(gistUrl);

    if (!gist) error('Something went wrong...');

    const update = await confirm({
      message: `Do you want to make this your new configuration?\n\n${gist}\n`,
    });

    if (!update) process.exit(0);

    try {
      const newConfig: Config = JSON.parse(gist);

      delete newConfig.lettersSaved;

      createConfig(newConfig);
    } catch {
      error('Something went wrong...');
    }
  });

export default downloadConfig;
