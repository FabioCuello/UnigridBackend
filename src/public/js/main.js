$("#formUser").on("submit", async e => {
    e.preventDefault()

    const alert = $("#alert").prop("checked")

    const newsletter = $("#newsletter").prop("checked")

    const response = await $.ajax({
        url: `${APP_ORIGIN}/config/user/set/`,
        type: 'PATCH',
        data: `alert=${alert}&newsletter=${newsletter}`,
    });

    const toastHTML = `<span>${response.message}</span>`
    M.toast({ html: toastHTML });
})


$("#formLogin").on("submit", e => {
    e.preventDefault()

    const data = {
        email: $("#email").val(),
        password: $("#password").val()
    }

    postWithToast(`${APP_ORIGIN}/login`, data, `${APP_ORIGIN}`)
})

$("#formRegister").on("submit", e => {
    e.preventDefault()

    const data = {
        firstName: $("#firstName").val(),
        lastName: $("#lastName").val(),
        email: $("#email").val(),
        password: $("#password").val(),
        re_pass: $("#re_pass").val(),
        alerts: $("#alerts").prop("checked"),
        newsletter: $("#newsletter").prop("checked")
    }

    postWithToast(`${APP_ORIGIN}/register`, data, `${APP_ORIGIN}/message`)
})

$("#buttonAdm").on("click", requestAdmin)
$("#buttonAdm").on("touchstart", requestAdmin)

$("#resetForm").on("submit", e => {
    e.preventDefault()

    const data = {
        email: $("#email").val()
    }

    postWithToast(`${APP_ORIGIN}/password/email`, data, `${APP_ORIGIN}/message`)
})

$("#resetPasswordForm").on("submit", e => {
    e.preventDefault()

    const data = {
        password: $("#password").val(),
        re_pass: $("#re_pass").val()
    }

    postWithToast(`${APP_ORIGIN}/password/reset`, data, `${APP_ORIGIN}/message`)
})