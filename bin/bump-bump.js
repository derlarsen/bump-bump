#!/usr/bin/env node
const argv = require('yargs').argv;
const fs = require('fs');
const bump = require('../');

/**
 * @param {string[]} argNames
 * @return {*}
 */
const extractFromArgs = (argNames) => {
  let val;
  argNames.reverse().forEach((name) => {
    if (typeof argv[name] !== 'undefined') val = argv[name];
  });
  return val;
};

const validBumpLevels = ['major', 'minor', 'patch'];

const printUsage = () => {
  const script = argv.$0.split('/').slice(-1);
  console.log(`Usage: ${script} [options] <${validBumpLevels.join('|')}|<semver version>>

Bump the version of an app to the next major|minor|fix or a specific semver version. Adjusts
package.json and changelog. The changelog has to follow the keep-a-changelog-format.

Options:
 -c, --changelog  Path to the changelog file. Defaults to CHANGELOG.md.
 -p, --package    Path to the packacke.json file. Defaults to package.json.
`);
};


const ensureFileIsThere = (path) => {
  try {
    fs.readFileSync(path);
  } catch (e) {
    throw new Error(`Could not read file ${path}`);
  }
};


const main = () => {
  if (extractFromArgs(['h', 'help']) === true) {
    printUsage();
    process.exit();
  }

  try {
    const bumpLevelOrVersion = argv._[0];

    if (!bumpLevelOrVersion) {
      throw new Error('No bump level or version given');
    }

    const changelogPath = extractFromArgs(['c', 'changelog']) || './CHANGELOG.md';
    ensureFileIsThere(changelogPath);

    const packagePath = extractFromArgs(['p', 'package']) || './package.json';
    ensureFileIsThere(packagePath);

    const bumpedVersion = bump(bumpLevelOrVersion, packagePath, changelogPath);

    console.log(`Bumped version to ${bumpedVersion}`);
    process.exit();
  } catch (e) {
    console.error(`Error: ${e.message}`, "\n", "\n");
    printUsage();
    process.exit(1);
  }
};

main();
