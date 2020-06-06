function sendAminInformation(id) {
    document.getElementById(id).contentWindow.postMessage(`${admin}`, "*");
}

function sendInformationLogout(e) {
    e.preventDefault()

    document.getElementById("f").contentWindow.postMessage("false", "*");
    document.getElementById("f1").contentWindow.postMessage("false", "*");

    postWithToast(`${APP_ORIGIN}/logout`, {}, `${APP_ORIGIN}/`)
}

$("#N611").on("click", () => { sendAminInformation("f") })
$("#N611").on("touchstart", () => { sendAminInformation("f") })

$("#Others").on("click", () => { sendAminInformation("f1") })
$("#Others").on("touchstart", () => { sendAminInformation("f1") })

$("#logout").on("click", e => { sendInformationLogout(e) })
$("#logout").on("touchstart", e => { sendInformationLogout(e) })



