const semver = require('semver');
const versiony = require('versiony');

const getLatestPackageVersion =  (packagePath) => {
  return versiony.from(packagePath).get();
};

const getNextPackageVersion = (incrementLevel, packagePath) => {
  const latestVersion = getLatestPackageVersion(packagePath) || '0.0.0';
  return semver.inc(latestVersion, incrementLevel);
};


module.exports = {
  getLatestPackageVersion,
  getNextPackageVersion,
};
