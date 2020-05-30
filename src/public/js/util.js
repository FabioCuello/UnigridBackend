async function postWithToast(url, data = {}, urlTo = "") {
    const { success, message } = await $.post(`${url}`, data)

    if (success && !urlTo == "") return window.location.replace(`${urlTo}`)

    const toastHTML = `<span>${message}</span>`
    return M.toast({ html: toastHTML });
}

function requestAdmin(e) {
    e.preventDefault()

    postWithToast(`${APP_ORIGIN}/config/user/request/admin`)
}