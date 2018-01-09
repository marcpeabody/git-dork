// const { ipcRenderer } = require("electron");
const caller = require( "./caller" );

document.addEventListener("DOMContentLoaded", () => {
    repoScanButtonListener();
});

const repoScanButtonListener = () => {
    const btn = document.getElementById("repoScanButton");
    const status = document.getElementById("status");
    btn.addEventListener("click", e => {
        status.innerText = "waiting";
        let waiting = true;
        //ipcRenderer.send("do-caller", { message: "The button was clicked" });
        caller.doCaller((output) => {
            if ( waiting ) {
                waiting = false;
                status.innerText = '';
            }
            status.innerHTML = status.innerHTML + output + '<br>';
        });
    });
};