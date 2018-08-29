const versiony = require('versiony');

module.exports = async (version, packagePath) => {
  versiony
    .from(packagePath)
    .version(version)
    .to(packagePath);
};
