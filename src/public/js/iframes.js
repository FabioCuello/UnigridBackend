function sendAminInformation() {
    document.getElementById("f").contentWindow.postMessage(`${admin}`, "*");
}

$("#N611").on("click", sendAminInformation)
$("#N611").on("touchstart", sendAminInformation)
