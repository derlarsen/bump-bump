const semver = require('semver');

const bumpChangelog = require('./lib/bump-changelog');
const bumpPackage = require('./lib/bump-package');
const { getNextPackageVersion } = require('./lib/package-version');

const validBumpLevels = ['major', 'minor', 'patch'];

module.exports = (bumpLevelOrVersion, packagePath, changelogPath) => {
  const bumpType = semver.valid(bumpLevelOrVersion) ? 'version' : 'level';

  if (bumpType === 'level' && !validBumpLevels.includes(bumpLevelOrVersion)) {
    throw new Error(`Invalid bump level: ${bumpLevelOrVersion}`);
  }

  const bumpVersion = bumpType === 'version'
    ? bumpLevelOrVersion
    : getNextPackageVersion(bumpLevelOrVersion, packagePath);

  bumpPackage(bumpVersion, packagePath);
  bumpChangelog(bumpVersion, changelogPath);

  return bumpVersion;
};
