/**
 * @type {import('semantic-release').GlobalConfig}
 */
export default {
  branches: [
    'master',
    { name: 'next', prerelease: true },
    { name: 'beta', prerelease: true },
  ],
};
