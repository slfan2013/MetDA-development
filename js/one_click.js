console.log("one_click.js")


$("#upload_a_file").click(function () {
    $("#inputFile").off("change").on("change", function () {
        $(".inputFileHidden").prop("disabled", true);
        $(".inputFile_validating").text("Validating")
        ocpu.call("call_fun", {parameter:{
            path: $("#inputFile")[0].files[0],
            fun_name:"inputFile"
        }}, function (session) {
            session.getObject(function (obj) {
                oo = obj
                p = oo.p
                f = oo.f
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




when_projects_table_clicked = function () {
    $(this).addClass('selected').siblings().removeClass('selected');
    project_id = $(this).find('td:first').html();
    selected_data = "e.csv"
    console.log(project_id)
    /*localStorage['activate_project_id'] = project_id
     localStorage['activate_data_id']='e.csv'*/
    // when the project_id is selected. We need to display the project tree so that the user could select dataset.

    ocpu.call("call_fun", {parameter:{
        project_id: project_id,
        selected_data: selected_data,
        fun_name:"open_project_structure_to_select_dataset"
    }}, function (session) {
        console.log(session)
        session.getObject(function (obj) {
            ooo = obj
            p = ooo.p
            f = ooo.f
            $("#selected_project_structure").jstree("destroy");
            $("#selected_project_structure").jstree({
                'core': {
                    'data': obj.result_project_structure,
                    'multiple': false, // cannot select multiple nodes.
                    'expand_selected_onload': true,
                    'check_callback': true
                }
            })
            $('#select_from_projects_collapse').collapse("hide")
            $("#data_selected_information").text("The above dataset " + selected_data + " is selected successfully.")


            update_projects_table("projects_table2", when_projects_table_clicked2)
            $("#select_from_projects_collapse2").collapse("show")

            $('#selected_project_structure').on("select_node.jstree", function (e, data) {
                ddd = data
                selected_data = ddd.node.id
                $("#data_selected_information").text("The above dataset " + ddd.node.text[0] + " is selected successfully.")
            })



        })
    }).fail(function (e) {
        Swal.fire('Oops...', e.responseText, 'error')
    })


  
}
update_projects_table()



when_projects_table_clicked2 = function () {
    $(this).addClass('selected').siblings().removeClass('selected');
    project_id2 = $(this).find('td:first').html();
    selected_data2 = "e.csv"
    console.log(project_id2)


    ocpu.call("call_fun", {parameter:{
        project_id: project_id2,
        selected_data: 'e.csv',
        fun_name:"open_project_structure"
    }}, function (session) {
        console.log(session)
        session.getObject(function (obj) {
            $("#selected_project_structure2").jstree("destroy");
            $("#selected_project_structure2").jstree({
                'core': {
                    'data': obj,
                    'multiple': false, // cannot select multiple nodes.
                    'expand_selected_onload': true,
                    'check_callback': true
                }
            })
            $("#select_from_projects_collapse2").collapse("hide")
            $("#data_selected_information").text("The above dataset " + selected_data2 + " is selected successfully.")

            update_projects_table("projects_table2")
            $("#projects_table2 tr").click(when_projects_table_clicked2);
            $('#selected_project_structure2').on("select_node.jstree", function (e, data) {
                ddd2 = data
                selected_data2 = ddd2.node.id
                $("#data_selected_information2").text("The above dataset " + ddd2.node.text[0] + " is selected successfully.")
            })
        })
    }).fail(function (e) {
        Swal.fire('Oops...', e.responseText, 'error')
    })

}


$("#confirm_selected_project").click(function () {

    console.log("The selected data is " + selected_data + " in project " + project_id +
        " and the targeted dataset is " + selected_data2 + " in the project " + project_id2 + ".")



    // 1. Mimic the result stucture.
    ocpu.call("preview_result_structure", {
        project_id: project_id,
        selected_data: selected_data,
        project_id2: project_id2,
        selected_data2: selected_data2
    }, function (session) {
        console.log(session)
        session.getObject(function (obj) {
            console.log("Good")
            console.log(obj)
            ooo = obj
            $("#preview_result_structure").jstree("destroy");
            $("#preview_result_structure").jstree({
                'core': {
                    'data': obj.result_project_structure,
                    'multiple': false, // cannot select multiple nodes.
                    'expand_selected_onload': true,
                    'check_callback': true
                }
            })
            $("#preview_result_structure_information").html("<p class='text-success'>The above <span class='text-danger'>red text</span> highlighted are to be added to the project.</p>")


            sample_parameters_global_index = 1
            sample_parameters_global_nodes = []
            // now we need to ask the users to specified some parameters. 
            para_index = 0
            sample_para = obj.to_be_specified["sample_info"]
            sample_para_keys = Object.keys(sample_para)
            if (sample_para_keys[0] === '0') {
                sample_para_keys = []
            }
            interval_sample = setInterval(function () {
                if (para_index === sample_para_keys.length) {
                    clearInterval(interval_sample)
                } else {
                    $('#parameters_to_be_specified').append(sample_parameters_global_index + '. Select the Sample Info corresponding to <b>' + sample_para_keys[para_index] + '</b> for <span style="color:blue;text-decoration:underline;cursor:pointer" id="sample_parameters_global_span' + sample_parameters_global_index + '">these nodes</span>.' + '<div id="sample_parameters_global_id_' + sample_para_keys[para_index] + '">' + '</div>');

                    div_id = "sample_parameters_global_id_" + sample_para_keys[para_index]
                    id = "sample_parameters_global_id_" + sample_para_keys[para_index]
                    $("#" + div_id).load("sample_information_non_changing_levels_select.html", init_selectpicker)
                    sample_parameters_global_nodes[sample_parameters_global_index] = sample_para[sample_para_keys[para_index]]

                    $("#sample_parameters_global_span" + sample_parameters_global_index).hover(function () {
                        sample_parameters_global_span_hovered = this
                        $('#preview_result_structure a').filter(function () {
                            return sample_parameters_global_nodes[sample_parameters_global_span_hovered.id.replace("sample_parameters_global_span", "")].includes(this.id.replace("_anchor", ""))
                        }).css('background-color', "yellow");
                    }, function () {
                        $('#preview_result_structure a').removeAttr('style')
                    })
                    sample_parameters_global_index++;
                    para_index++
                }
            }, 100)


            compound_parameters_global_index = 1
            compound_parameters_global_nodes = []
            // now we need to ask the users to specified some parameters. 
            compound_para_index = 0
            compound_para = obj.to_be_specified["compound_info"]
            compound_para_keys = Object.keys(compound_para)
            if (compound_para_keys[0] === '0') {
                compound_para_keys = []
            }
            interval_compound = setInterval(function () {
                if (compound_para_index === compound_para_keys.length) {
                    clearInterval(interval_compound)
                } else {
                    $('#parameters_to_be_specified').append(compound_parameters_global_index + '. Select the Compound Info corresponding to <b>' + compound_para_keys[compound_para_index] + '</b> for <span style="color:blue;text-decoration:underline;cursor:pointer" id="compound_parameters_global_span' + compound_parameters_global_index + '">these nodes</span>.' + '<div id="compound_parameters_global_id_' + compound_para_keys[compound_para_index] + '">' + '</div>');

                    div_id = "compound_parameters_global_id_" + compound_para_keys[compound_para_index]
                    id = "compound_parameters_global_id_" + compound_para_keys[compound_para_index]
                    $("#" + div_id).load("compound_information_non_changing_levels_select.html", init_selectpicker)
                    compound_parameters_global_nodes[compound_parameters_global_index] = compound_para[compound_para_keys[compound_para_index]]

                    $("#compound_parameters_global_span" + compound_parameters_global_index).hover(function () {
                        compound_parameters_global_span_hovered = this
                        $('#preview_result_structure a').filter(function () {
                            return compound_parameters_global_nodes[compound_parameters_global_span_hovered.id.replace("compound_parameters_global_span", "")].includes(this.id.replace("_anchor", ""))
                        }).css('background-color', "yellow");
                    }, function () {
                        $('#preview_result_structure a').removeAttr('style')
                    })
                    compound_parameters_global_index++;
                    compound_para_index++
                }
            }, 1000)



        })
    }).fail(function (e) {
        Swal.fire('Oops...', e.responseText, 'error')
    })



})

$("#submit").click(function () {
    parameter = {}
    // here perform the statistical analysis pipeline. Now collect all the parameters.
    $(".parameter").each(function () {

        if (this.id !== '') {
            //parameters.push({:$(this).val()})
            if ($(this).prop("checked") === undefined) { // this means that it is a select.
                parameter[this.id] = $(this).val()
            } else { // this means that it is a checkbox
                parameter[this.id] = $(this).prop("checked")
            }
        }
    })
    console.log(parameter)

    ocpu.call("call_fun", {parameter:{
        project_id: project_id,
        selected_data: selected_data,
        project_id2: project_id2,
        selected_data2: selected_data2,
        parameters: parameter,
        fun_name:"perform_quick_analysis"
    }}, function (session) {
        console.log(session)
        session.getObject(function (obj) {
            console.log(obj)
            oooo = obj

            if (obj.length>0 || obj.length === undefined) {
                //obj.length>0 || obj.length === undefined
                plot_base64 = {}
                number_of_plots = 0
                console.log("GOOD JOB!")


                project_times = Object.keys(obj)
                plots = Object.values(obj)



                for (var i = 0; i < plots.length; i++) {
                    plot_base64[project_times[i]] = {}
                    current_plot = JSON.parse(plots[i][0])

                    individual_plot_names = Object.keys(current_plot)
                    individual_plot_paramters = Object.values(current_plot)

                    for (var j = 0; j < individual_plot_names.length; j++) {

                        current_plot_name = individual_plot_names[j].split(".")[0]


                        plot_fun = window[current_plot_name + "_fun"]


                        current_parameter = individual_plot_paramters[j]


                        plot_base64[project_times[i]][individual_plot_names[j]] = {}


                        current_parameter.plot_id = "temp_id_" + project_times[i] + current_plot_name
                        current_parameter.quick_analysis = true
                        current_parameter.quick_analysis_project_time = project_times[i]
                        current_parameter.quick_analysis_plot_name = individual_plot_names[j]


                        $('#for_temp_plots').append('<div id="' + current_parameter.plot_id + '"></div>')
                        if (current_plot_name === 'boxplot_plot') {
                            var temp_current_parameter =current_parameter

                            plot_fun(temp_current_parameter)

                            var quick_analysis_project_time = temp_current_parameter.quick_analysis_project_time
                            var quick_analysis_plot_name = temp_current_parameter.quick_analysis_plot_name

                            var temp_plot_url = []
                            var main_group_values = temp_current_parameter.main_group_values
                            var main_group_levels = temp_current_parameter.main_group_levels
                            var e = temp_current_parameter.e
                            var f_label = unpack(f, 'label')


                            var plotting_compound_index = 0;
                            var plot_loop = setInterval(function () {
                                var zip = new JSZip();
                                if (plotting_compound_index === e.length) {
                                    console.log("Quick Analysis Boxplots Generated")
                                    clearInterval(plot_loop);

                                    for (var k = 0; k < temp_plot_url.length; k++) {
                                        zip.file((k + 1) + "th " + f_label[k].replace(/[^0-9a-zA-Z _().]/g, "_") + ".svg", btoa(unescape(temp_plot_url[k].replace("data:image/svg+xml,", ""))), { base64: true });
                                    }


                                    zip.generateAsync({ type: "base64" }).then(function (base64) {
                                        bbb = base64
                                        console.log("quick analysis boxplot done")
                                        plot_base64[quick_analysis_project_time][quick_analysis_plot_name] = base64
                                    })



                                } else {
                                    var y = e[plotting_compound_index]
                                    var ys = array_split_by_one_factor(y, main_group_values, main_group_levels)
                                    var update_data = {
                                        y: ys
                                    }
                                    temp_current_parameter.layout.title.text = f_label[plotting_compound_index]
                                    Plotly.relayout(temp_current_parameter.plot_id, temp_current_parameter.layout)

                                    Plotly.restyle(temp_current_parameter.plot_id, update_data).then(function (gd) {
                                        Plotly.toImage(gd, { format: 'svg' })
                                            .then(
                                                function (url) {
                                                    var uuuu = url
                                                    var uuu = uuuu.replace(/^data:image\/svg\+xml,/, '');
                                                    uuu = decodeURIComponent(uuu);
                                                    if (false) {
                                                        //plot_url.boxplot_plot = btoa(unescape(encodeURIComponent(uuu)))
                                                        //files_sources[2] = plot_url.boxplot_plot
                                                        //console.log(plotting_compound_index)
                                                        //plot_url.push(url)
                                                    } else {
                                                        //plot_base64[quick_analysis_project_time][quick_analysis_plot_name] = btoa(unescape(encodeURIComponent(uuu)))
                                                        temp_plot_url.push(url)
                                                    }
                                                }
                                            )
                                    })
                                }
                                plotting_compound_index++;
                            }, 1)
                        } else {
                            plot_fun(current_parameter)

                        }





                        /*current_parameter_keys = Object.keys(current_parameter)
                        current_parameter_values = Object.values(current_parameter)

                        for(var k=0; k<current_parameter_keys.length; k++){
                            window[current_parameter_keys[k]] = current_parameter_values[k]
                        }*/
                        number_of_plots++;
                    }
                }

                console.log(number_of_plots)




                function getValuesFromNestedObject(obj) {
                    for (var key in obj) {
                        if (typeof obj[key] === "object") {
                            getValuesFromNestedObject(obj[key]);
                        } else {
                            getValuesFromNestedObject_result.push(obj[key])
                        }
                    }
                }
                var myVar = setInterval(function () {

                    getValuesFromNestedObject_result = []
                    getValuesFromNestedObject(plot_base64)
                    if (getValuesFromNestedObject_result.length < number_of_plots) {

                        //console.log("waiting")


                    } else {
                        clearInterval(myVar)
                        ocpu.call("save_plots", { plot_base64: plot_base64, project_id: project_id }, function (session) {
                            console.log(session)
                            session.getObject(function (obj) {
                                console.log(obj)
                            })
                        })
                    }
                }, 200)






            }
        })
    }).fail(function (e) {
        Swal.fire('Oops...', e.responseText, 'error')
    })

})