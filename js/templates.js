ocpu.call("get_test_data", {

}, function (session) {
    session.getObject(function (obj) {
        $("#score_plot_layout_font, #score_plot_layout_title_font, #score_plot_layout_xaxis_title_font, #score_plot_layout_xaxis_tickfont").load("fonts_select.html", init_selectpicker)
        setTimeout(function () {
            $(".pickr-container").each(function () {
                console.log(this.id)
                new Pickr(Object.assign({
                    el: this, theme: 'classic',
                    default: '#42445A'
                }, {
                        swatches: [
                            'rgba(244, 67, 54, 1)',
                            'rgba(233, 30, 99, 0.95)',
                            'rgba(156, 39, 176, 0.9)',
                            'rgba(103, 58, 183, 0.85)',
                            'rgba(63, 81, 181, 0.8)',
                            'rgba(33, 150, 243, 0.75)',
                            'rgba(3, 169, 244, 0.7)',
                            'rgba(0, 188, 212, 0.7)',
                            'rgba(0, 150, 136, 0.75)',
                            'rgba(76, 175, 80, 0.8)',
                            'rgba(139, 195, 74, 0.85)',
                            'rgba(205, 220, 57, 0.9)',
                            'rgba(255, 235, 59, 0.95)',
                            'rgba(255, 193, 7, 1)'
                        ],
                        components: {
                            preview: true, opacity: true, hue: true,
                            interaction: {
                                hex: true, rgba: true, input: true, clear: true, save: true
                            }
                        }
                    }));
            })
        }, 100)


        o = obj
        data = o

        x = unpack(data, 'count')
        y = unpack(data, 'count11')
        type = unpack(data, 'type')
        sex = unpack(data, 'sex')
        citizen = unpack(data, 'citizen')


        color_by = type
        color_levels = type.filter(unique)
        color_values = ['red', 'green', 'azure', 'rebeccapurple', 'burlywood', 'mediumseagreen'].map(x => colourNameToHex(x)).map(x => hexToRgb(x, 1))
        shape_by = sex
        shape_levels = sex.filter(unique)
        shape_values = ["circle", "square"]
        size_by = citizen
        size_levels = citizen.filter(unique)
        size_values = [2, 6]
        ellipse_group = ['color']

        labels = new Array(x.length).fill(1).map((_, i) => i + 1)
        layout = {
            plot_bgcolor: "#ffffff",
            paper_bgcolor: "#ffffff",
            font: {
                family: "Arial",
                size: 12,
                color: "#000000"
            },
            title: {
                text: "plot title",
                font: {
                    family: "Arial",
                    size: 12,
                    color: "#000000"
                },
                x: 0.5,
                y: 1
            },
            autosize: false,
            width: 1000,
            height: 1000,
            margin: {
                l: 80,
                r: 80,
                t: 100,
                b: 80,
                pad: 0,
                autoexpand: true
            },
            xaxis: {
                title: {
                    text: "X axis title",
                    font: {
                        family: "Arial",
                        size: 12,
                        color: "#000000"
                    },
                },
                ticklen: 5,
                tickwidth: 1,
                tickcolor: "#000000",
                tickfont: {
                    family: "Arial",
                    size: 12,
                    color: "#000000"
                },
                tickangle: 0,
                showline: true,
                linecolor: "#000000",
                linewidth: 1,
                showgrid: true,
                gridcolor: "#eeeeee",
                gridwidth: 1,
                gridcolor: "#eeeeee",
                zeroline: true,
                zerolinecolor: "#444444",
                zerolinewidth: 1
            },
            yaxis: {
                title: {
                    text: "Y axis title",
                    font: {
                        family: "Arial",
                        size: 12,
                        color: "#000000"
                    },
                },
                ticklen: 5,
                tickwidth: 100,
                tickcolor: "#000000",
                tickfont: {
                    family: "Arial",
                    size: 12,
                    color: "#000000"
                },
                tickangle: 0,
                showline: true,
                linecolor: "#000000",
                linewidth: 1,
                showgrid: true,
                gridcolor: "#eeeeee",
                gridwidth: 1,
                gridcolor: "#eeeeee",
                zeroline: true,
                zerolinecolor: "#444444",
                zerolinewidth: 1
            },
            hovermode: "closest"
        }
        plot_id = "testing_pca"




        scatter_by_group = function ({ x = undefined, y = undefined, color_by = undefined, color_values = undefined, color_levels = undefined,
            shape_by = undefined, shape_values = undefined, shape_levels = undefined,
            size_by = undefined, size_values = undefined, size_levels = undefined,
            ellipse_group = ['color', 'shape', 'size'],
            labels = undefined,
            layout = undefined,
            plot_id = undefined } = {}
        ) {
            var myPlot = document.getElementById(plot_id)
            if (color_by === undefined) {
                color_by = Array(x.length).fill("")
                if (color_values === undefined) {
                    color_values = "black"
                }
                color_levels = ""
            }

            if (shape_by === undefined) {
                shape_by = Array(x.length).fill("")
                if (shape_values === undefined) {
                    shape_values = "circle"
                }
                shape_levels = ""
            }
            if (size_by === undefined) {
                size_by = Array(x.length).fill("")
                if (size_values === undefined) {
                    size_values = 2
                }
                size_levels = ""
            }

            if (typeof color_values === 'string') {
                color_values = [color_values]
            }
            if (typeof color_levels === 'string') {
                color_levels = [color_levels]
            }
            if (typeof shape_values === 'string') {
                shape_values = [shape_values]
            }
            if (typeof shape_levels === 'string') {
                shape_levels = [shape_levels]
            }
            if (typeof size_values === "number") {
                size_values = [size_values]
            }
            if (typeof size_levels === 'string') {
                size_levels = [size_levels]
            }


            color_by_revalue = revalue(color_by, color_levels, color_values)
            shape_by_revalue = revalue(shape_by, shape_levels, shape_values)
            size_by_revalue = revalue(size_by, size_levels, size_values)

            // split the x and y to data traces according to split_by_revalue.
            split_by = color_by.map((x, i) => x + "+" + shape_by[i] + "+" + size_by[i])
            split_by_revalue = color_by_revalue.map((x, i) => x + "+" + shape_by_revalue[i] + "+" + size_by_revalue[i])




            xs = groupData(split_by_revalue, x)
            ys = groupData(split_by_revalue, y)
            trace_keys = Object.keys(xs)
            names = revalue(trace_keys, split_by_revalue.filter(unique), split_by.filter(unique))
            texts = groupData(split_by_revalue, labels)


            data = []
            for (var i = 0; i < trace_keys.length; i++) {
                data.push({
                    mode: 'markers',
                    x: xs[trace_keys[i]],
                    y: ys[trace_keys[i]],
                    name: names[i],
                    text: texts[trace_keys[i]],
                    marker: {
                        color: trace_keys[i].split("+")[0],
                        symbol: trace_keys[i].split("+")[1],
                        size: trace_keys[i].split("+")[2],
                    }
                })
            }

            // add ellipse.
            ellipse_split_by = Array(x.length).fill("")
            if (ellipse_group.length > 0) {
                for (var i = 0; i < ellipse_group.length; i++) {
                    temp_split = eval(ellipse_group[i] + "_by")
                    ellipse_split_by = ellipse_split_by.map((x, j) => x + "+" + temp_split[j])
                }
            }
            ellipse_split_by = ellipse_split_by.map(x => x.slice(1))
            ellipse_split_by_revalue = Array(x.length).fill("")
            if (ellipse_group.length > 0) {
                for (var i = 0; i < ellipse_group.length; i++) {
                    temp_split = eval(ellipse_group[i] + "_by_revalue")
                    ellipse_split_by_revalue = ellipse_split_by_revalue.map((x, j) => x + "+" + temp_split[j])
                }
            }
            ellipse_split_by_revalue = ellipse_split_by_revalue.map(x => x.slice(1))
            ellipse_xs_from = groupData(ellipse_split_by_revalue, x)
            ellipse_ys_from = groupData(ellipse_split_by_revalue, y)

            ellipse_xs_ys = {}
            ellipse_trace_keys = Object.keys(ellipse_xs_from)
            for (var i = 0; i < ellipse_trace_keys.length; i++) {
                ellipse_xs_ys[ellipse_trace_keys[i]] = ellipse(ellipse_xs_from[ellipse_trace_keys[i]],
                    ellipse_ys_from[ellipse_trace_keys[i]], 0.95)
            }

            ellipse_names = revalue(ellipse_trace_keys, ellipse_split_by_revalue.filter(unique), ellipse_split_by.filter(unique))
            for (var i = 0; i < ellipse_trace_keys.length; i++) {
                data.push({
                    mode: 'lines',
                    x: ellipse_xs_ys[ellipse_trace_keys[i]][0],
                    y: ellipse_xs_ys[ellipse_trace_keys[i]][1],
                    text: null,
                    line: {
                        width: 1.889764,
                        color: transparent_rgba(ellipse_trace_keys[i].split("+")[0], 0.1),
                        dash: "solid"
                    },
                    fill: "toself",
                    fillcolor: transparent_rgba(ellipse_trace_keys[i].split("+")[0], 0.1),
                    name: ellipse_trace_keys[i],
                    showlegend: false,
                    hoverinfo: "skip"
                })
            }






            Plotly.newPlot(plot_id, data, layout, { editable: false })


                .then(gd => {
                    gd.on('plotly_clickannotation', (x) => {
                        console.log(x)
                        console.log('annotation clicked !!!');
                    })
                })
                ;

            myPlot.on('plotly_click', function (data, event) {//https://plot.ly/javascript/text-and-annotations/
                console.log(event)
                ddd = data
                console.log(ddd)
                point = data.points[0]
                newAnnotation = {
                    x: point.xaxis.d2l(point.x),
                    y: point.yaxis.d2l(point.y),
                    arrowhead: 6,
                    ax: 0,
                    ay: -80,
                    bgcolor: 'rgba(255, 255, 255, 0.9)',
                    arrowcolor: point.fullData.marker.color,
                    font: { size: 12 },
                    text: point.text,
                    captureevents: true
                },
                    divid = document.getElementById(plot_id)
                newIndex = (divid.layout.annotations || []).length;
                if (newIndex) {
                    var foundCopy = false;
                    divid.layout.annotations.forEach(function (ann, sameIndex) {
                        if (ann.text === newAnnotation.text) {
                            Plotly.relayout(plot_id, 'annotations[' + sameIndex + ']', 'remove');
                            foundCopy = true;
                        }
                    });
                    if (foundCopy) return;
                }
                Plotly.relayout(plot_id, 'annotations[' + newIndex + ']', newAnnotation);
            })







        }

        scatter_by_group({
            x: x, y: y, color_by: color_by, color_values: color_values, color_levels: color_levels,
            shape_by: shape_by, shape_values: shape_values, shape_levels: shape_levels,
            size_by: size_by, size_values: size_values, size_levels: size_levels,
            ellipse_group: ellipse_group,
            labels: labels,
            layout: layout,
            plot_id: plot_id
        })



    })
})






































console.log("template.js")
loadjscssfile("js/" + window.location.href.split("#")[1] + ".js", "js")
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

    results_card_body_load = function (page, obj, session) {//multiple pages may use one page style.
        if (['pca', 'missing_value_imputation'].includes(page)) {
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

        if (localStorage['activate_data_id'] !== undefined && localStorage.big_category === 'project') {
            parameter.activate_data_id = localStorage['activate_data_id']
        } else {
            parameter.activate_data_id = 'e.csv'
        }









        parameter.fun_name = window.location.href.split("#")[1]
        ocpu.call("call_fun", { parameter: parameter }, function (session) {
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
