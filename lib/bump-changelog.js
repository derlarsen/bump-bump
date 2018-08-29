const moment = require('moment');
const fs = require('fs');

/**
 * Add a new line for the new version right below the [Unreleased] tag
 *
 * @param {string[]} lines Changelog lines list
 * @param {string} version
 * @returns {string[]}
 */
const addNewVersion = (lines, version) => {
  const adjustedLines = [...lines];
  const idx = adjustedLines.indexOf('## [Unreleased]');
  if (idx >= 0) {
    adjustedLines.splice(
      idx + 1,
      ...['', '', `##[${version}] - ${moment().format('YYYY-MM-DD')}`]
    );
  }

  return adjustedLines;
};

/**
 * Add repository diff links for new version
 *
 * @param {string[]} lines Changelog lines list
 * @param {string} version
 * @returns {string[]}
 */
const addChangelogReleaseVersionLink = (lines, version) => {
  return lines.reduce((adjustedLines, currLine) => {
    if (currLine.indexOf('[Unreleased]: ') === 0) {
      // Extract repo url and last version
      const [unreleased, repoUrl] = currLine.split(': ').map(s => s.trim());
      const repoUrlPrefix = repoUrl.slice(0, repoUrl.lastIndexOf('/'));
      const versionDiff = repoUrl.slice(repoUrl.lastIndexOf('/') + 1);
      const [lastVersion, head] = versionDiff.split('...');

      // Create new [Unreleased] line
      const unreleasedVersionDiff = [version, head].join('...');
      const unreleasedVersionRepoUrl = `${repoUrlPrefix}/${unreleasedVersionDiff}`;
      const unreleasedLine = [unreleased, unreleasedVersionRepoUrl].join(': ');
      adjustedLines.push(unreleasedLine);

      // Create diff line for lastVersion...version
      const currVersionDiff = [lastVersion, version].join('...');
      const currVersionRepoUrl = `${repoUrlPrefix}/${currVersionDiff}`;
      const currVersionLine = [`[${version}]`, currVersionRepoUrl].join(': ');
      adjustedLines.push(currVersionLine);
    } else {
      adjustedLines.push(currLine);
    }

    return adjustedLines;
  }, []);
};

module.exports = async (version, changelogPath) => {
  const changelogData = fs.readFileSync(changelogPath).toString();
  let changelogLines = changelogData.split("\n");

  changelogLines = addNewVersion(changelogLines, version);
  changelogLines = addChangelogReleaseVersionLink(changelogLines, version);

  fs.writeFileSync(changelogPath, changelogLines.join("\n"));
};
