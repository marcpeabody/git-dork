// const { ipcRenderer } = require("electron");
const { scanRepos } = require('./repoFinder');
const { brewOutdated, brewUpgrade } = require('./brewOutdated');

document.addEventListener("DOMContentLoaded", () => {
    gitVersionChecker();
    repoScanButtonListener();
});

const gitVersionChecker = () => {
    const gitEnv = document.getElementById("gitEnv");
    brewOutdated('git', (data) => {
        if ( data.outdated ) {
            gitEnv.innerHTML = `${data.project} out of date yours:${data.myVersion} latest:${data.latestVersion} <a id="updateGitLink" href="#">upgrade</a>`
            const updateGitLink = document.getElementById("updateGitLink");
            updateGitLink.addEventListener("click", e => {
                console.log('clicked update')
                e.preventDefault();
                updateGitLink.style.display = 'none';
                gitEnv.innerHTML = `${ gitEnv.innerHTML } upgrading ${data.project}`
                brewUpgrade(data.project, () => {
                    console.log('upgrading git')
                    gitVersionChecker(); // after upgrading, refresh this whole thing
                });
            });
        } else {
            gitEnv.innerHTML = `${data.project} is up to date (${data.myVersion})`
        }
    });
};

const repoScanButtonListener = () => {
    const btn = document.getElementById("repoScanButton");
    const status = document.getElementById("status");
    btn.addEventListener("click", e => {
        status.innerText = "waiting";
        let waiting = true;
        //ipcRenderer.send("do-caller", { message: "The button was clicked" });
        scanRepos((output) => {
            if ( waiting ) {
                waiting = false;
                status.innerText = '';
            }
            status.innerHTML = status.innerHTML + output + '<br>';
        });
    });
};