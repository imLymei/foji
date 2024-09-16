/**
 * @type {import('semantic-release').GlobalConfig}
 */
export default {
  branches: ['master', 'next', { name: 'beta', prerelease: true }],
};
