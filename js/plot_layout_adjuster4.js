ocpu.call("call_fun", {parameter:{
                        method: window.location.href.split("#")[1],
                        style: PLOT_NAME_layout,
                        user_id: localStorage.user_id,
                        fun_name:"save_PLOT_NAME_style"
                    }}, function (session) {
                        console.log(session)
                        console.log("good.")
                    }).fail(function (e2) {
                        Swal.fire('Oops...', e2.responseText, 'error')
                    })