const { exec } = require('child_process');

const brewOutdated = (formulaName, dataHandler) => {
    exec(`brew outdated --verbose | grep '^${ formulaName } '`, (e, out, err) => {
        // line returned should look like the following
        // pcre (8.40) < 8.41
        const line = out.trim();
        const outdated = line.length > 0 
        if ( outdated ) {
            const tokens = line.split(' ');
            const myVersion = tokens[1].replace(/[\(\)]/g, '');
            const latestVersion = tokens[tokens.length-1];
            console.log('outdated', out, formulaName, myVersion, latestVersion);
            dataHandler({ project: formulaName, myVersion, latestVersion, outdated: flag });
        } else {
            versionCheck('git', (version) => {
                dataHandler({ project: formulaName, myVersion: version, latestVersion: version, outdated: outdated })
            });
        }
    });
}
const versionCheck = (formulaName, versionHandler) => {
    exec(`${ formulaName } --version`, (e, out, err) => {
        const tokens = out.trim().split(' ');
        const version = tokens[tokens.length - 1];
        versionHandler(version);
    });
};

const brewUpgrade = (formulaName, callback) => {
    exec(`brew upgrade ${formulaName}`, callback);
}

module.exports = {
    brewOutdated, brewUpgrade
};