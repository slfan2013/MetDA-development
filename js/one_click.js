console.log("one_click.js")


$("#upload_a_file").click(function () {

    $("#inputFile").off("change").on("change", function () {
        $(".inputFileHidden").prop("disabled", true);
        $(".inputFile_validating").text("Validating")
        ocpu.call("inputFile", {
            path: $("#inputFile")[0].files[0]
        }, function (session) {
            session.getObject(function (obj) {
                console.log("good")
                oo = obj
                p = oo.p
                project_id = obj.project_id[0]
                $(".inputFileHidden").prop("disabled", false);
                var text = "<p class='text-warning'>" + obj.message.warning_message.join("</p><p class='text-warning'>") + "</p>"
                text = text + "<p class='text-success'>" + obj.message.success_message.join("</p><p class='text-success'>") + "</p>"

                $("#inputFile_success").html("<p><b>" + $("#inputFile")[0].files[0].name + " is validated.</b></p>")
                $(".inputFile_validating").html(text)
            })
        }).fail(function (e) {
            Swal.fire('Oops...', e.responseText, 'error')
            $(".inputFileHidden").prop("disabled", false);
            $(".inputFile_validating").text("Dataset file format is incorrect.")
        })
    })

    document.getElementById('inputFile').click();
})
