console.log("one_click.js")



update_projects_table_one_click = function (id = "projects_table", select_call_back = "when_projects_table_clicked", rename_call_back = false, delete_call_back = false) {

    //Papa.parse("https://metda.fiehnlab.ucdavis.edu/db/metda_userinfo/" + localStorage['user_id'] + "/metda_userinfo_" + localStorage['user_id'] + ".csv", {
    //download: true,
    //complete: function (results) {


    ocpu.call("call_fun", {
        parameter: {
            user_id: localStorage['user_id'],
            fun_name: "get_userinfo"
        }
    }, function (session) {
        console.log(session)
        session.getObject(function (obj) {
            var results = obj
            rrr = results
            project_name_index = results.data[0].indexOf("project_name")

            project_names = results.data.map(x => x[project_name_index])
            project_names.shift()
            project_names.pop()


            if (results.data.length === 1) {
                table_html = "<small>You don't have any project yet. Create One!</small>"
            } else {
                var table_html = "<thead><tr>"
                for (var i = -1; i < results.data[0].length + 1; i++) {
                    if (i === -1) {
                        table_html = table_html + "<th class='text-center'>" + "#" + "</th>"
                    } else if (i === results.data[0].length) {
                        table_html = table_html + "<th class='disabled-sorting text-right'>" + "Actions" + "</th>"
                    } else {
                        table_html = table_html + "<th>" + results.data[0][i] + "</th>"
                    }

                }
                table_html = table_html + "</tr></thead>"
                table_html = table_html + "<tfoot><tr>"
                for (var i = -1; i < results.data[0].length + 1; i++) {
                    if (i === -1) {
                        table_html = table_html + "<th class='text-center'>" + "#" + "</th>"
                    } else if (i === results.data[0].length) {
                        table_html = table_html + "<th class='disabled-sorting text-right'>" + "Actions" + "</th>"
                    } else {
                        table_html = table_html + "<th>" + results.data[0][i] + "</th>"
                    }

                }
                table_html = table_html + "</tr></tfoot>"


                table_html = table_html + "<tbody>"
                for (var i = 1; i < results.data.length; i++) {
                    var current_project_id = results.data[i][0]
                    console.log(current_project_id)


                    table_html = table_html + "<tr>"
                    for (var j = -1; j < results.data[i].length + 1; j++) {
                        if (j === -1) {
                            table_html = table_html + "<td class='text-center'>" + (j + 2) + "</td>"
                        } else if (j === results.data[i].length) {
                            table_html = table_html + "<td class='text-right'>"
                            if (!select_call_back === false) {
                                table_html = table_html + '<button class="btn btn-just-icon btn-link" title="Select This Project" onclick="' + select_call_back + '(\'' + current_project_id + '\')"> <i class="material-icons" style="color:green">check</i> </button>'
                            }
                            if (!rename_call_back === false) {
                                table_html = table_html + '<button class="btn btn-just-icon btn-link" title="Rename This Project" onclick="' + rename_call_back + '(\'' + current_project_id + '\')"> <i class="material-icons" style="color:orange">edit</i> </button>'
                            }
                            if (!delete_call_back === false) {
                                table_html = table_html + '<button class="btn btn-just-icon btn-link" title="Delete This Project" onclick="' + delete_call_back + '(\'' + current_project_id + '\')"> <i class="material-icons" style="color:red">close</i> </button>'
                            }

                            table_html = table_html + "</td>"
                        } else {
                            table_html = table_html + "<td>" + results.data[i][j] + "</td>"
                        }

                    }
                    table_html = table_html + "</tr>"
                }
                table_html = table_html + "</tbody>"
                //console.log(table_html)
            }

            $("#" + id).html(table_html)
            //$("#" + id + " tr").click(call_back);


            if ($.fn.dataTable.isDataTable('#' + id)) {

                if (results.data[1][0] === "") {
                    $("#" + id).DataTable().destroy();
                    $("#" + id).html(table_html)
                }

            } else {
                $("#" + id).DataTable({
                    "pagingType": "full_numbers",
                    "lengthMenu": [
                        [10, 25, 50, -1],
                        [10, 25, 50, "All"]
                    ],
                    responsive: true,
                    language: {
                        search: "_INPUT_",
                        searchPlaceholder: "Search records",
                    }
                });
            }
        })
    })





    //}
    //});
}




$("#upload_a_file").click(function () {
    $("#inputFile").off("change").on("change", function () {
        $(".inputFileHidden").prop("disabled", true);
        $(".inputFile_validating").text("Validating")
        ocpu.call("inputFile", {
            path: $("#inputFile")[0].files[0]
        }, function (session) {
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



var selected_data;
var selected_data2;
when_projects_table_clicked = function (project_id) {
    selected_data = "e.csv"
    window['project_id'] = project_id
    ocpu.call("call_fun", {
        parameter: {
            project_id: project_id,
            selected_data: selected_data,
            fun_name: "open_project_structure_to_select_dataset"
        }
    }, function (session) {
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

            $('#selected_project_structure').on("select_node.jstree", function (e, data) {
                ddd = data
                selected_data = ddd.node.original.id[0]

                ocpu.call('call_fun', {
                    parameter: {
                        project_id: project_id,
                        activate_data_id: selected_data,
                        fun_name: "get_p_and_f"
                    }
                }, function (session) {
                    console.log(session)
                    session.getObject(function (obj) {
                        p = obj.p
                        f = obj.f

                        ocpu.call('call_fun', {
                            parameter: {
                                project_id: project_id,
                                file_id: selected_data,
                                fun_name: "get_fold_seq"
                            }
                        }, function (session) {
                            console.log(session)
                            session.getObject(function (obj) {
                                $("#data_selected_information").text("The above dataset " + obj + " is selected successfully.")
                            })
                        })

                    })
                })

            })


            update_projects_table_one_click("projects_table2", "when_projects_table_clicked2", false, false)
            $("#select_from_projects_collapse2").collapse("show")




        })
    }).fail(function (e) {
        Swal.fire('Oops...', e.responseText, 'error')
    })



}



update_projects_table_one_click("projects_table")


when_projects_table_clicked2 = function (project_id2) {

    window['project_id2'] = project_id2
    //$(this).addClass('selected').siblings().removeClass('selected');
    //project_id2 = $(this).find('td:first').html();
    selected_data2 = "e.csv"
    console.log(selected_data2)
    console.log(project_id2)


    ocpu.call("call_fun", {
        parameter: {
            project_id: project_id2,
            selected_data: selected_data2,
            fun_name: "open_project_structure"
        }
    }, function (session) {
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

            $('#selected_project_structure2').on("select_node.jstree", function (e, data) {

                selected_data2 = data.node.original.id[0]

                // ocpu.call('call_fun',{
                //  parameter:{
                //    project_id:project_id2,
                //     activate_data_id: selected_data2,
                //     fun_name:"get_p_and_f"
                //   }
                // },function(session){
                //  console.log(session)
                //  session.getObject(function(obj){
                //   p2 = obj.p
                // f2 = obj.f

                ocpu.call('call_fun', {
                    parameter: {
                        project_id: project_id2,
                        file_id: selected_data2,
                        fun_name: "get_fold_seq"
                    }
                }, function (session) {
                    console.log(session)
                    session.getObject(function (obj) {
                        $("#data_selected_information2").text("The above dataset " + obj + " is selected successfully.")
                    })
                })



                //})
                //})

            })



            $("#select_from_projects_collapse2").collapse("hide")
            $("#data_selected_information2").text("The above dataset " + selected_data2 + " is selected successfully.")


        })
    }).fail(function (e) {
        Swal.fire('Oops...', e.responseText, 'error')
    })

}


$("#confirm_selected_project").click(function () {

    console.log("The selected data is " + selected_data + " in project " + project_id +
        " and the targeted dataset is " + selected_data2 + " in the project " + project_id2 + ".")



    // 1. Mimic the result stucture.
    ocpu.call("call_fun", {
        parameter: {
            project_id: project_id,
            selected_data: selected_data,
            project_id2: project_id2,
            selected_data2: selected_data2,
            fun_name: "preview_result_structure"
        }
    }, function (session) {
        //window.open(session.loc + "files/call_fun.RData")
        console.log(session)
        
        session.getObject(function (obj) {
            console.log("Good")
            console.log(obj)
            ob = obj
            p1 = obj.p1
            f1 = obj.f1
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
            sample_para_index = 0
            sample_para = obj.to_be_specified["sample_info"]
            sample_para_keys = Object.keys(sample_para)
            if (sample_para_keys[0] === '0') {
                sample_para_keys = []
            }
            interval_sample = setInterval(function () {
                if (sample_para_index === sample_para_keys.length) {
                    clearInterval(interval_sample)
                } else {
                    $('#parameters_to_be_specified').append(sample_parameters_global_index + '. Select the Sample Info corresponding to <b>' + sample_para_keys[sample_para_index] + '</b> for <span style="color:blue;text-decoration:underline;cursor:pointer" id="sample_parameters_global_span' + sample_parameters_global_index + '">these nodes</span>.' + '<div id="sample_parameters_global_id_' + sample_para_keys[sample_para_index] + '">' + '</div>');

                    sample_parameters_global_nodes[sample_parameters_global_index] = sample_para[sample_para_keys[sample_para_index]]
                    //!!! currently, cannot subset by sample or compound info.
                    div_id = "sample_parameters_global_id_" + sample_para_keys[sample_para_index]
                    id = "sample_parameters_global_id_" + sample_para_keys[sample_para_index]
                    $("#" + div_id).load("sample_information_non_changing_levels_select.html", init_selectpicker)


                    $("#sample_parameters_global_span" + sample_parameters_global_index).hover(function () {
                        sample_parameters_global_span_hovered = this
                        $('#preview_result_structure a').filter(function () {
                            return sample_parameters_global_nodes[sample_parameters_global_span_hovered.id.replace("sample_parameters_global_span", "")].includes(this.id.replace("_anchor", ""))
                        }).css('background-color', "yellow");
                    }, function () {
                        $('#preview_result_structure a').removeAttr('style')


                    })
                    sample_parameters_global_index++;
                    sample_para_index++
                }
            }, 1000)


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

    ocpu.call("call_fun", {
        parameter: {
            project_id: project_id,
            selected_data: selected_data,
            project_id2: project_id2,
            selected_data2: selected_data2,
            parameters: parameter,
            fun_name: "perform_quick_analysis"
        }
    }, function (session) {
        //window.open(session.loc + "files/call_fun.RData")
        console.log(session)
        session.getObject(function (obj) {
            console.log(obj)
            oooo = obj
            /*
                        structure_to_be_added_ids = oooo.structure_to_be_added_ids
                        structure_to_be_added_folders_only = oooo.structure_to_be_added_folders_only
                        structure_to_be_added = oooo.structure_to_be_added
                        old_id_to_new_id_matches = oooo.old_id_to_new_id_matches
            */
            plot_base64 = {}
            number_of_plots = 0

            perform_quick_analysis_step_by_step_js = function (obj) {
                finished = false
                ocpu.call("call_fun", {
                    parameter: {
                        json: obj,
                        fun_name: "perform_quick_analysis_step_by_step"
                    }
                }, function (session) {
                    console.log(session)
                    //window.open(session.loc + "files/call_fun.RData")
                    session.getObject(function (obj) {

                        oo = obj
                        obj_json = JSON.parse(oo)
                        console.log(obj_json.ii)

                        console.log(obj_json.results)
                        if(false){
                            if (obj_json.results.length === undefined) {// this means we have a plot to draw.
                                console.log("going to draw plot")
    
                                var obj_json_plot = obj_json.results
                                var project_times = Object.keys(obj_json_plot)
                                var plots = Object.values(obj_json_plot)
                                var i = 0
                                plot_base64[project_times[i]] = {}
                                var current_plot = JSON.parse(plots[i])
    
                                var individual_plot_names = Object.keys(current_plot)
                                var individual_plot_paramters = Object.values(current_plot)
    
                                for (var j = 0; j < individual_plot_names.length; j++) {
    
                                    current_plot_name = individual_plot_names[j].split(".")[0]
                                    plot_fun = window[current_plot_name + "_fun"]
                                    current_parameter = individual_plot_paramters[j]
    
                                    current_parameter.plot_id = "temp_id_" + project_times[i] + current_plot_name
    
                                    current_parameter.quick_analysis = true
                                    current_parameter.quick_analysis_project_time = project_times[i]
                                    current_parameter.quick_analysis_plot_name = individual_plot_names[j]
    
    
                                    $('#for_temp_plots').append('<div id="' + current_parameter.plot_id + '"></div>')
    
                                    if (current_plot_name === 'boxplot_plot') {
                                        // not done.
                                    } else {
                                        console.log("making plot")
                                        plot_fun(current_parameter)
                                        setTimeout(() => {
    
                                            if (obj_json.ii == 'done.') { // this means everything is done.
                                                console.log("FINISHED")
    
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
                                                        finished = true
                                                        
                                                        ocpu.call("call_fun", { parameter: { plot_base64: plot_base64, project_id: project_id, fun_name: "save_plots" } }, function (session) {
                                                            console.log(session)
                                                            session.getObject(function (obj) {
                                                                console.log(obj)
                                                            })
                                                        })
                                                    }
                                                }, 200)
                                            } else {
                                                perform_quick_analysis_step_by_step_js(obj)
                                            }
                                        }, 200);
                                    }
                                    number_of_plots++;
                                }
                            } else {
    
                                if (obj_json.ii == 'done.') { // this means everything is done.
                                    console.log("FINISHED")
    
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
                                            ocpu.call("call_fun", { parameter: { plot_base64: plot_base64, project_id: project_id, fun_name: "save_plots" } }, function (session) {
                                                console.log(session)
                                                session.getObject(function (obj) {
                                                    console.log(obj)
                                                })
                                            })
                                        }
                                    }, 200)
                                } else {
                                    perform_quick_analysis_step_by_step_js(obj)
                                }
    
                            }
                        }
                        

                    })
                })
            }


            perform_quick_analysis_step_by_step_js_temp = function (obj) {
                ocpu.call("call_fun_temp", {
                    parameter: {
                        json: obj,
                        fun_name: "perform_quick_analysis_step_by_step"
                    }
                }, function (session) {
                    console.log(session)
                    window.open(session.loc + "files/call_fun.RData")
                })
            }


            perform_quick_analysis_step_by_step_js(oooo)


            /*if (obj.length>0 || obj.length === undefined) {
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
                        ocpu.call("call_fun", {parameter:{ plot_base64: plot_base64, project_id: project_id, fun_name:"save_plots" }}, function (session) {
                            console.log(session)
                            session.getObject(function (obj) {
                                console.log(obj)
                            })
                        })
                    }
                }, 200)






            }*/
        })
    }).fail(function (e) {
        Swal.fire('Oops...', e.responseText, 'error')
    })

})