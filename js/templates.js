
/*ocpu.call("save_iris_as_csv",{},function(session){
    console.log("save_iris_as_csv is good.")
    console.log(session)
    console.log("trying to call catch_url_and_download.")
    ocpu.call("catch_url_and_download",{
        url:session.loc + "files/iris.csv"
    },function(session2){
        console.log(session2)
    }).fail(function(e){
        console.log("catch_url_and_download failed. Cannot open URL xxx.")
        alert(e.responseText)
    })
})*/




console.log("template.js")
loadjscssfile("js/"+window.location.href.split("#")[1] +".js","js")
if (localStorage['big_category'] === 'project') {
    $("#templates_icon_text").html("Projects")
    $("#templates_icon").html("library_books")


    $("#templates_input_file_from_upload").hide()
    $("#templates_input_file_from_project").show()


} else if (localStorage['big_category'] === 'in_and_out') {
    $("#templates_icon_text").html("In & Out")
    $("#templates_icon").html("transform")


    $("#templates_input_file_from_upload").show()
    $("#templates_input_file_from_project").hide()
}


if (window.location.href.split("#")[1] === 'project_overview') {

    $("#other_than_template_overview_div").hide()
    $("#template_overview_div").show()

    $("#template_overview_div").load("project_overview.html")

} else {
    $("#other_than_template_overview_div").show()
    $("#template_overview_div").hide()


    ocpu.call("templates_contents", {
        id: window.location.href.split("#")[1]
    }, function (session) {
        session.getObject(function (obj) {
            ooo = obj
            $("#method_name").text(obj.method_name)
            $("#method_description").html(obj.method_description)
        })
    }).fail(function (e) {
        Swal.fire('Oops...', e.responseText, 'error')
    })

    open_project_structure_to_select_dataset = function () {
        // open the data select collapse.
        // id：project_structure_with_dataset_only
        ocpu.call("open_project_structure_to_select_dataset", {
            project_id: localStorage['activate_project_id'],
            selected_data: localStorage['activate_data_id']
        }, function (session) {
            session.getObject(function (obj) {
                ooo = obj
                $("#project_structure_with_dataset_only").jstree("destroy");
                $("#project_structure_with_dataset_only").jstree({
                    'core': {
                        'data': obj,
                        'multiple': false, // cannot select multiple nodes.
                        'expand_selected_onload': true,
                        'check_callback': true
                    }
                })
                $('#project_structure_with_dataset_only').on("select_node.jstree", function (e, data) {
                    ddd = data
                    localStorage['activate_data_id'] = ddd.node.original.id[0]
                    $("#parameter_settings_card").show()
                    get_parameter_settings()
                })
                if (localStorage['activate_data_id'] !== undefined && localStorage.big_category === 'project') {
                    $("#parameter_settings_card").show()
                    get_parameter_settings()
                }



            })
        }).fail(function (e) {
            Swal.fire('Oops...', e.responseText, 'error')
        })


    }
    open_project_structure_to_select_dataset()

    get_parameter_settings = function () {
        $("#parameter_settings").load(window.location.href.split("#")[1] + "_parameter_settings.html", init_selectpicker)
        $("#parameter_settings_description").html('loaded')
    }

    project_id = localStorage["activate_project_id"]
    check_input_format = function (inputFile) {
        $('#parameter_settings_card').hide();
        $(".inputFileHidden").prop("disabled", true);
        $(".inputFile_validating").text("Validating")
        ocpu.call("inputFile", {
            path: $("#" + inputFile)[0].files[0]
        }, function (session) {
            session.getObject(function (obj) {
                oo = obj
                project_id = obj.project_id[0]
                $(".inputFileHidden").prop("disabled", false);
                var text = "<p class='text-warning'>" + obj.message.warning_message.join("</p><p class='text-warning'>") + "</p>"
                text = text + "<p class='text-success'>" + obj.message.success_message.join("</p><p class='text-success'>") + "</p>"

                $(".inputFile_validating").html(text)
                $('#parameter_settings_card').show();

                get_parameter_settings()
                loadjscssfile("js/" + window.location.href.split("#")[1] + ".js", 'js')
            })
        }).fail(function (e) {
            Swal.fire('Oops...', e.responseText, 'error')
            $(".inputFileHidden").prop("disabled", false);
            $(".inputFile_validating").text("Dataset file format is incorrect.")
        })
    }

    results_card_body_load = function (page, obj,session) {//multiple pages may use one page style.
        if (['pca','missing_value_imputation'].includes(page)) {
          $("#results_card_body").load("one_top_description_bottom_table.html", function () {
            init_selectpicker()

            if(localStorage['big_category'] === 'project'){
                $("#save_results").show();
                $("#only_download_result_dataset").hide();
                $("#download_results").removeClass("btn-primary")
                $("#download_results").addClass("btn-default")
                $("#save_results").addClass("btn-primary")
                $("#save_results").removeClass("btn-default")
            }else if(localStorage['big_category'] === 'in_and_out'){
                $("#save_results").hide();
                $("#only_download_result_dataset").show();
                $("#download_results").addClass("btn-primary")
                $("#download_results").removeClass("btn-default")
                $("#save_results").removeClass("btn-primary")
                $("#save_results").addClass("btn-default")
            }

            

            
            var append_results_fun = window[window.location.href.split("#")[1] + "_append_results"];
            
            append_results_fun(obj,session)
          })
        }
      }
      
    Submit = function () {
        $("#submit").text("Calculating...")
        $("#submit").prop('disabled', true);
        $("#results_card").hide();

        parameter = {}

        $(".parameter").each(function () {
            if (this.id !== '') {
                //parameters.push({:$(this).val()})
                parameter[this.id] = $(this).val()
            }
        })
        parameter.project_id = project_id
        parameter.fun_name = window.location.href.split("#")[1]
        var req = ocpu.call("call_fun", { parameter: parameter }, function (session) {
            sss = session
            console.log(session)
            session.getObject(function (obj) {
                ooo = obj
                $("#submit").text("Submit")
                $("#submit").prop('disabled', false);

                $("#results_card").show();
                results_card_body_load(window.location.href.split("#")[1], obj, session)

                localStorage.setItem('parameter', JSON.stringify(parameter))


            })
        }).fail(function (e) {
            Swal.fire('Oops...', e.responseText, 'error')
            $("#submit").text("Submit")
            $("#submit").prop('disabled', false);
        })


    }





}


$("#sidebar").load("sidebar.html")
