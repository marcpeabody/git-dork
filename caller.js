const { spawn, exec } = require('child_process');

let todoGitOutdatedCheck = `brew outdated --verbose | grep '^git '`

let whoami = 'loading';
let homeDir = '';
exec('whoami', (error, stdout, stderr) => {
    whoami = stdout.trim();
    homeDir = `/Users/${ whoami }`;
});

function executeSpawn(command, outputHandler){
    const args = command.split(' ');
    command = args.shift();
    const s = spawn(command, args);

    s.stdout.on('data', data => {
        data = data.toString().trim().replace(homeDir, '')
        //console.log(data);
        outputHandler.call(this, data);
    });

    s.stderr.on('data', data => {
        console.log('stderr: ' + data.toString());
    });

    s.on('exit', code => {
        // console.log('exited with code: ' + code.toString());
    });
};

const doCaller = (outputHandler) => {
    const command = `find ${ homeDir } -name .git -type d -exec dirname {} \;`;
    executeSpawn(command, outputHandler);
};

module.exports = {
    doCaller
};