/*parameter = {}
parameter.fun_name = 'principal_component_analysis'
parameter.project_id = localStorage.activate_project_id

if (localStorage['activate_data_id'] !== undefined && localStorage.big_category === 'project') {
    parameter.activate_data_id = localStorage['activate_data_id']
} else {
    parameter.activate_data_id = 'e.csv'
}
parameter.scaling_method = "standard"
ocpu.call("call_fun", { parameter: parameter }, function (session) {
    session.getObject(function (obj) {})
})*/







console.log("template.js")
loadjscssfile("js/" + window.location.href.split("#")[1] + ".js", "js")
if (localStorage['big_category'] === 'project') {
    $("#templates_icon_text").html("Projects")
    $("#templates_icon").html("library_books")
    $("#templates_input_file_from_upload").hide()
    $("#volcano_plot_input_from_file").hide()
    $("#templates_input_file_from_project").hide()
    $("#volcano_plot_p_value_div").hide()
    $("#volcano_plot_fold_change_div").hide()

    if (window.location.href.split("#")[1] === 'volcano') {
        $("#volcano_plot_p_value_div").show()
        $("#volcano_plot_fold_change_div").show()
    } else {
        $("#templates_input_file_from_project").show()
    }

} else if (localStorage['big_category'] === 'in_and_out') {
    $("#templates_icon_text").html("In & Out")
    $("#templates_icon").html("transform")
    $("#templates_input_file_from_upload").show()
    $("#templates_input_file_from_project").hide()

    $("#volcano_plot_p_value_div").hide()
    $("#volcano_plot_fold_change_div").hide()

    if (window.location.href.split("#")[1] === 'volcano') {
        $("#templates_input_file_from_upload").hide()
        $("#volcano_plot_input_from_file").show()
    } else {
        $("#volcano_plot_input_from_file").hide()
    }
}


if (window.location.href.split("#")[1] === 'project_overview') {

    $("#other_than_template_overview_div").hide()
    $("#template_overview_div").show()

    $("#template_overview_div").load("project_overview.html")

} else {
    $("#other_than_template_overview_div").show()
    $("#template_overview_div").hide()


    ocpu.call("call_fun", {parameter:{
        id: window.location.href.split("#")[1],
        fun_name:"templates_contents"
    }}, function (session) {
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
        ocpu.call("call_fun", {parameter:{
            project_id: localStorage['activate_project_id'],
            selected_data: localStorage['activate_data_id'],
            fun_name:"open_project_structure_to_select_dataset"
        }}, function (session) {

            console.log(session)
            session.getObject(function (obj) {
                ooo = obj
                p = ooo.p
                f = ooo.f
                $("#project_structure_with_dataset_only").jstree("destroy");
                $("#project_structure_with_dataset_only").jstree({
                    'core': {
                        'data': obj.result_project_structure,
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
    if (localStorage.big_category === 'project') {

        if(window.location.href.split("#")[1] === 'volcano'){
            
            ocpu.call("call_fun",{parameter:{
                project_id: localStorage['activate_project_id'],
                fun_name:"open_project_structure_to_select_p_value_and_fold_change"
            }}, function(session){
                console.log(session)
                session.getObject(function(obj){
                    ooo = obj
                    
                    var volcano_plot_p_value = false;
                    var volcano_plot_fold_change = false;

                    $("#volcano_plot_p_value").jstree("destroy");
                    $("#volcano_plot_fold_change").jstree("destroy");
                    $("#volcano_plot_p_value").jstree({
                        'core': {
                            'data': obj.p_val_project_structure,
                            'multiple': false, // cannot select multiple nodes.
                            'expand_selected_onload': true,
                            'check_callback': true
                        }
                    }).bind('loaded.jstree', function(e, data) {
                        if(obj.p_val_project_structure.length===3){
                            $('#volcano_plot_p_value').jstree('select_node', obj.p_val_project_structure[2].id[0]);
                        }
                    })

                    $('#volcano_plot_p_value').on("select_node.jstree", function (e, data) {
                        volcano_plot_p_value = true
                        p_value_data_id = data.node.original.id[0]
                        p_value_data_treatment =  $("#volcano_plot_p_value").jstree(true).get_node(data.node.parent).original.parameter.treatment_group[0]
                        if(volcano_plot_p_value && volcano_plot_fold_change){
                            $("#parameter_settings_card").show()
                            get_parameter_settings()
                        }                        
                    })



                    $("#volcano_plot_fold_change").jstree({
                        'core': {
                            'data': obj.fold_change_project_structure,
                            'multiple': false, // cannot select multiple nodes.
                            'expand_selected_onload': true,
                            'check_callback': true
                        }
                    }).bind('loaded.jstree', function(e, data) {
                        if(obj.p_val_project_structure.length===3){
                            $('#volcano_plot_fold_change').jstree('select_node', obj.fold_change_project_structure[2].id[0]);
                        }
                    })

                    $('#volcano_plot_fold_change').on("select_node.jstree", function (e, data) {
                        volcano_plot_fold_change = true
                        fold_change_data_id = data.node.original.id[0]
                        fold_change_data_treatment = $("#volcano_plot_fold_change").jstree(true).get_node(data.node.parent).original.parameter.treatment_group[0]
                        if(volcano_plot_p_value && volcano_plot_fold_change){
                            $("#parameter_settings_card").show()
                            get_parameter_settings()
                        }
                    })
                })
            })



        }else{
            open_project_structure_to_select_dataset()
        }

        
    }

    get_parameter_settings = function () {
        $("#parameter_settings").load(window.location.href.split("#")[1] + "_parameter_settings.html", init_selectpicker)
        $("#parameter_settings_description").html('loaded')
    }

    project_id = localStorage["activate_project_id"] // this will be erased by project_id = obj.project_id[0]
    check_input_format = function (inputFile) {
        $('#parameter_settings_card').hide();
        $(".inputFileHidden").prop("disabled", true);
        $(".inputFile_validating").text("Validating")
        ocpu.call("inputFile", {
            path: $("#" + inputFile)[0].files[0]
        }, function (session) {
            session.getObject(function (obj) {
                oo = obj
                p = oo.p
                f = oo.f
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


    check_input_format_volcano_input_file = function (volcano_input_file) { // this is specifically for input of the volcano plot.
        $('#parameter_settings_card').hide();
        $(".inputFileHidden").prop("disabled", true);
        $(".volcano_input_file_validating").text("Validating")


        ocpu.call("check_input_format_volcano_input_file", {
            path: $("#" + volcano_input_file)[0].files[0]
        }, function (session) {
            console.log(session)
            session.getObject(function (obj) {
                oo = obj
                project_id = obj.project_id[0]
                $(".inputFileHidden").prop("disabled", false);
                var text = "<p class='text-warning'>" + obj.message.warning_message.join("</p><p class='text-warning'>") + "</p>"
                text = text + "<p class='text-success'>" + obj.message.success_message.join("</p><p class='text-success'>") + "</p>"

                $(".volcano_input_file_validating").html(text)
                $('#parameter_settings_card').show();

                get_parameter_settings()
                loadjscssfile("js/" + window.location.href.split("#")[1] + ".js", 'js')
            })
        }).fail(function (e) {
            Swal.fire('Oops...', e.responseText, 'error')
            $(".inputFileHidden").prop("disabled", false);
            $(".volcano_input_file_validating").text("Dataset file format is incorrect.")
        })
    }






    results_card_body_load = function (page, obj, session) {//multiple pages may use one page style.
        if (['missing_value_imputation', 'student_t_test', 'fold_change'].includes(page)) {
            $("#results_card_body").load("one_top_description_bottom_table.html", function () {
                init_selectpicker()

                if (localStorage['big_category'] === 'project') {
                    $("#save_results").show();
                    $("#only_download_result_dataset").hide();
                    $("#download_results").removeClass("btn-primary")
                    $("#download_results").addClass("btn-default")
                    $("#save_results").addClass("btn-primary")
                    $("#save_results").removeClass("btn-default")
                } else if (localStorage['big_category'] === 'in_and_out') {
                    $("#save_results").hide();
                    $("#only_download_result_dataset").show();
                    $("#download_results").addClass("btn-primary")
                    $("#download_results").removeClass("btn-default")
                    $("#save_results").removeClass("btn-primary")
                    $("#save_results").addClass("btn-default")
                }
                var append_results_fun = window[window.location.href.split("#")[1] + "_append_results"];
                append_results_fun(obj, session)
            })
        } else if (['pca','plsda'].includes(page)) {
            obj_score_loading_plot = obj
            obj_scree_plot = obj
            obj_loading_plot = obj


            $("#results_card_body").append('<div id="score_loading_plot_div"></div>')
            $("#results_card_body").append('<div id="loading_plot_div"></div>')
            $("#results_card_body").append('<div id="scree_plot_div"></div>')

            $("#score_loading_plot_div").load("score_loading_plot.html", function () {
                init_selectpicker()
                $("#loading_plot_div").load("loading_plot.html", function () {
                    init_selectpicker()
                    $("#scree_plot_div").load("scree_plot.html", function () {
                        init_selectpicker()
                        if (localStorage['big_category'] === 'project') {
                            $("#save_results").show();
                            $("#only_download_result_dataset").hide();
                            $("#download_results").removeClass("btn-primary")
                            $("#download_results").addClass("btn-default")
                            $("#save_results").addClass("btn-primary")
                            $("#save_results").removeClass("btn-default")
                        } else if (localStorage['big_category'] === 'in_and_out') {
                            $("#save_results").hide();
                            $("#only_download_result_dataset").show();
                            $("#download_results").addClass("btn-primary")
                            $("#download_results").removeClass("btn-default")
                            $("#save_results").removeClass("btn-primary")
                            $("#save_results").addClass("btn-default")
                        }
                        var append_results_fun = window[window.location.href.split("#")[1] + "_append_results"];
                        append_results_fun(obj, session)
                    })
                })
            })
        } else if (['ssize'].includes(page)) {
            obj_ssize_plot = obj
            obj_power_plot = obj
            $("#results_card_body").append('<div id="ssize_plot_div"></div>')
            $("#results_card_body").append('<div id="power_plot_div"></div>')




            $("#ssize_plot_div").load("ssize_plot.html", function () {
                init_selectpicker()
                $("#power_plot_div").load("power_plot.html", function () {
                    init_selectpicker()
                    if (localStorage['big_category'] === 'project') {
                        $("#save_results").show();
                        $("#only_download_result_dataset").hide();
                        $("#download_results").removeClass("btn-primary")
                        $("#download_results").addClass("btn-default")
                        $("#save_results").addClass("btn-primary")
                        $("#save_results").removeClass("btn-default")
                    } else if (localStorage['big_category'] === 'in_and_out') {
                        $("#save_results").hide();
                        $("#only_download_result_dataset").show();
                        $("#download_results").addClass("btn-primary")
                        $("#download_results").removeClass("btn-default")
                        $("#save_results").removeClass("btn-primary")
                        $("#save_results").addClass("btn-default")
                    }
                    var append_results_fun = window[window.location.href.split("#")[1] + "_append_results"];
                    append_results_fun(obj, session)
                })
                
            })
        } else if (['heatmap'].includes(page)) {
            obj_heatmap_plot = obj
            $("#results_card_body").append('<div id="heatmap_plot_div"></div>')
            $("#heatmap_plot_div").load("heatmap_plot.html", function () {
                init_selectpicker()
                if (localStorage['big_category'] === 'project') {
                    $("#save_results").show();
                    $("#only_download_result_dataset").hide();
                    $("#download_results").removeClass("btn-primary")
                    $("#download_results").addClass("btn-default")
                    $("#save_results").addClass("btn-primary")
                    $("#save_results").removeClass("btn-default")
                } else if (localStorage['big_category'] === 'in_and_out') {
                    $("#save_results").hide();
                    $("#only_download_result_dataset").show();
                    $("#download_results").addClass("btn-primary")
                    $("#download_results").removeClass("btn-default")
                    $("#save_results").removeClass("btn-primary")
                    $("#save_results").addClass("btn-default")
                }
                var append_results_fun = window[window.location.href.split("#")[1] + "_append_results"];
                append_results_fun(obj, session)
            })
        } else if (['boxplot'].includes(page)) {
            obj_boxplot_plot = obj
            $("#results_card_body").append('<div id="boxplot_plot_div"></div>')
            $("#boxplot_plot_div").load("boxplot_plot.html", function () {
                init_selectpicker()
                if (localStorage['big_category'] === 'project') {
                    $("#save_results").show();
                    $("#only_download_result_dataset").hide();
                    $("#download_results").removeClass("btn-primary")
                    $("#download_results").addClass("btn-default")
                    $("#save_results").addClass("btn-primary")
                    $("#save_results").removeClass("btn-default")
                } else if (localStorage['big_category'] === 'in_and_out') {
                    $("#save_results").hide();
                    $("#only_download_result_dataset").show();
                    $("#download_results").addClass("btn-primary")
                    $("#download_results").removeClass("btn-default")
                    $("#save_results").removeClass("btn-primary")
                    $("#save_results").addClass("btn-default")
                }
                var append_results_fun = window[window.location.href.split("#")[1] + "_append_results"];
                append_results_fun(obj, session)
            })
        } else if (['volcano'].includes(page)) {
            obj_volcano_plot = obj
            $("#results_card_body").append('<div id="volcano_plot_div"></div>')
            $("#volcano_plot_div").load("volcano_plot.html", function () {
                init_selectpicker()
                if (localStorage['big_category'] === 'project') {
                    $("#save_results").show();
                    $("#only_download_result_dataset").hide();
                    $("#download_results").removeClass("btn-primary")
                    $("#download_results").addClass("btn-default")
                    $("#save_results").addClass("btn-primary")
                    $("#save_results").removeClass("btn-default")
                } else if (localStorage['big_category'] === 'in_and_out') {
                    $("#save_results").hide();
                    $("#only_download_result_dataset").show();
                    $("#download_results").addClass("btn-primary")
                    $("#download_results").removeClass("btn-default")
                    $("#save_results").removeClass("btn-primary")
                    $("#save_results").addClass("btn-default")
                }
                var append_results_fun = window[window.location.href.split("#")[1] + "_append_results"];
                append_results_fun(obj, session)
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
                if ($(this).attr('type') !== "checkbox") { // this means that it is a select.
                    parameter[this.id] = $(this).val()
                } else { // this means that it is a checkbox
                    parameter[this.id] = $(this).prop("checked")
                }
            }
        })
        parameter.project_id = project_id
            
        parameter.fun_name = window.location.href.split("#")[1]
        if(parameter.fun_name === 'volcano'){
            if(localStorage.big_category === 'in_and_out'){
                parameter.activate_data_id = $("#" + 'volcano_input_file')[0].files[0].name
            }else{
                parameter.activate_data_id = [p_value_data_id, fold_change_data_id] // sequence matters. See volcano.R
                parameter.p_value_data_treatment = p_value_data_treatment
                parameter.fold_change_data_treatment = fold_change_data_treatment
            }
        }else{
            if(['t-test','ANOVA'].includes(parameter.test_type)){
                delete parameter.sample_id;
            }
            if (localStorage['activate_data_id'] !== undefined && localStorage.big_category === 'project') {
                parameter.activate_data_id = localStorage['activate_data_id']
            } else {
                parameter.activate_data_id = 'e.csv'
            }
    
        }





        console.log(parameter)

        ocpu.call("call_fun", { parameter: parameter }, function (session) {
            sss = session
            console.log(session)
            session.getObject(function (obj) {
                o = obj
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
