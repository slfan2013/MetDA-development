console.log("pca.js")


$("#scaling_method_div").load("scaling_method.html", init_selectpicker)




var defination_of_missing_value_onchange = function () {
    selected_values = $("#defination_of_missing_value").val()

    if (selected_values.includes("values less than ...")) {
        $("#defination_of_missing_value_values_less_than_form_group").show()
    } else {
        $("#defination_of_missing_value_values_less_than_form_group").hide()
    }
    if (selected_values.includes("other")) {
        $("#defination_of_missing_other_than_form_group").show()
    } else {
        $("#defination_of_missing_other_than_form_group").hide()
    }
}

pca_append_results = function (obj, session) {
    $("#results_description").html(obj.results_description)
    ooo = obj
    sss = session

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




        xs = groupData(split_by, x)
        ys = groupData(split_by, y)
        trace_keys = Object.keys(xs)
        //names = revalue(trace_keys, split_by_revalue.filter(unique), split_by.filter(unique))
        names = trace_keys
        texts = groupData(split_by, labels)


        data = []
        for (var i = 0; i < trace_keys.length; i++) {
            data.push({
                mode: 'markers',
                x: xs[trace_keys[i]],
                y: ys[trace_keys[i]],
                name: names[i].replaceAll("+", " "),
                text: texts[trace_keys[i]],
                marker: {
                    color: revalue([trace_keys[i].split("+")[0]], color_levels, color_values)[0],
                    symbol: revalue([trace_keys[i].split("+")[1]], shape_levels, shape_values)[0],
                    size: revalue([trace_keys[i].split("+")[2]], size_levels, size_values)[0],
                },
                legendgroup: trace_keys[i]
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
        ellipse_xs_from = groupData(ellipse_split_by, x)
        ellipse_ys_from = groupData(ellipse_split_by, y)

        ellipse_xs_ys = {}
        ellipse_trace_keys = Object.keys(ellipse_xs_from)
        for (var i = 0; i < ellipse_trace_keys.length; i++) {
            ellipse_xs_ys[ellipse_trace_keys[i]] = ellipse(ellipse_xs_from[ellipse_trace_keys[i]],
                ellipse_ys_from[ellipse_trace_keys[i]], 0.95)
        }

        //ellipse_names = revalue(ellipse_trace_keys, ellipse_split_by_revalue.filter(unique), ellipse_split_by.filter(unique))
        ellipse_names = ellipse_trace_keys
        for (var i = 0; i < ellipse_trace_keys.length; i++) {
            data.push({
                mode: 'lines',
                x: ellipse_xs_ys[ellipse_trace_keys[i]][0],
                y: ellipse_xs_ys[ellipse_trace_keys[i]][1],
                text: null,
                line: {
                    width: 1.889764,
                    color: transparent_rgba(revalue([ellipse_trace_keys[i].split("+")[0]], color_levels, color_values)[0], 0.1),
                    dash: "solid"
                },
                fill: "toself",
                fillcolor: transparent_rgba(revalue([ellipse_trace_keys[i].split("+")[0]], color_levels, color_values)[0], 0.1),
                name: ellipse_trace_keys[i],
                showlegend: false,
                hoverinfo: "skip",
                legendgroup: trace_keys[i]
            })
        }



        if (names == "++") {
            layout.showlegend = false
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
    gather_page_information_to_score_plot = function () {

        x = unpack(obj.sample_scores, "PC1")
        y = unpack(obj.sample_scores, "PC2")


        if (!$("#score_plot_traces_color_by_info").is(":checked")) {
            score_plot_color_values = [$("#score_plot_color_option .pickr .pcr-button").css('color')]
            score_plot_color_by = undefined
        } else {
            score_plot_color_values = score_plot_color_levels.map(function (x, i) {
                return ($("#score_plot_color_options" + i + " .pickr .pcr-button").css('color'))
            })
        }

        if (!$("#score_plot_traces_shape_by_info").is(":checked")) {
            score_plot_shape_values = [$("#score_plot_shape_option .selectpicker").val()]
            score_plot_shape_by = undefined
        } else {
            score_plot_shape_values = score_plot_shape_levels.map(function (x, i) {
                return ($("#score_plot_shape_options" + i + " .selectpicker").val())
            })
        }


        if (!$("#score_plot_traces_size_by_info").is(":checked")) {
            score_plot_size_values = [$("#score_plot_size_option").val()]
            score_plot_size_by = undefined
        } else {
            score_plot_size_values = score_plot_size_levels.map(function (x, i) {
                return ($("#score_plot_size_options" + i).val())
            })
        }

        score_plot_ellipse_group = ['color']


        score_plot_labels = unpack(obj.p, "label")
        score_plot_layout = {
            plot_bgcolor: $("#score_plot_plot_bgcolor .pickr .pcr-button").css('color'),
            paper_bgcolor: $("#score_plot_paper_bgcolor .pickr .pcr-button").css('color'),
            /*font: {
                family: "Arial",
                size: 12,
                color: "#000000"
            },*/
            title: {
                text: $("#score_plot_layout_title_text").val(),
                font: {
                    family: $("#score_plot_layout_title_font .form-group .selectpicker").val(),
                    size: $("#score_plot_layout_title_font .input-group .size").val(),
                    color: $("#score_plot_layout_title_font .input-group .pickr .pcr-button").css('color')
                },
                x: $("#score_plot_layout_title_x").val(),
                y: $("#score_plot_layout_title_y").val(),
            },
            autosize: false,
            width: $("#score_plot_layout_width").val(),
            height: $("#score_plot_layout_height").val(),
            margin: {
                l: $("#score_plot_layout_margin_left").val(),
                r: $("#score_plot_layout_margin_right").val(),
                t: $("#score_plot_layout_margin_top").val(),
                b: $("#score_plot_layout_margin_bottom").val(),
                pad: 0,
                autoexpand: true
            },
            xaxis: {
                title: {
                    text: $("#score_plot_layout_xaxis_title_text").val(),
                    font: {
                        family: $("#score_plot_layout_xaxis_title_font .form-group .selectpicker").val(),
                        size: $("#score_plot_layout_xaxis_title_font .input-group .size").val(),
                        color: $("#score_plot_layout_xaxis_title_font .input-group .pickr .pcr-button").css('color')
                    },
                },
                ticklen: $("#score_plot_layout_xaxis_ticklen").val(),
                tickwidth: $("#score_plot_layout_xaxis_tickwidth").val(),
                tickcolor: $("#score_plot_layout_xaxis_tickcolor .pickr .pcr-button").css('color'),
                tickfont: {
                    family: $("#score_plot_layout_xaxis_tickfont .form-group .selectpicker").val(),
                    size: $("#score_plot_layout_xaxis_tickfont .input-group .size").val(),
                    color: $("#score_plot_layout_xaxis_tickfont .input-group .pickr .pcr-button").css('color')
                },
                tickangle: $("#score_plot_layout_xaxis_tickangle").val(),
                showline: true,
                linecolor: $("#score_plot_layout_xaxis_linecolor .pickr .pcr-button").css('color'),
                linewidth: $("#score_plot_layout_xaxis_linewidth").val(),
                showgrid: $("#score_plot_layout_xaxis_showgrid").is(":checked"),
                gridcolor: $("#score_plot_layout_xaxis_gridcolor .pickr .pcr-button").css('color'),
                gridwidth: $("#score_plot_layout_xaxis_gridwidth").val(),
                zeroline: $("#score_plot_layout_xaxis_zeroline").is(":checked"),
                zerolinecolor: $("#score_plot_layout_xaxis_zerolinecolor .pickr .pcr-button").css('color'),
                zerolinewidth: $("#score_plot_layout_xaxis_zerolinewidth").val()
            },
            yaxis: {
                title: {
                    text: $("#score_plot_layout_yaxis_title_text").val(),
                    font: {
                        family: $("#score_plot_layout_yaxis_title_font .form-group .selectpicker").val(),
                        size: $("#score_plot_layout_yaxis_title_font .input-group .size").val(),
                        color: $("#score_plot_layout_yaxis_title_font .input-group .pickr .pcr-button").css('color')
                    },
                },
                ticklen: $("#score_plot_layout_yaxis_ticklen").val(),
                tickwidth: $("#score_plot_layout_yaxis_tickwidth").val(),
                tickcolor: $("#score_plot_layout_yaxis_tickcolor .pickr .pcr-button").css('color'),
                tickfont: {
                    family: $("#score_plot_layout_yaxis_tickfont .form-group .selectpicker").val(),
                    size: $("#score_plot_layout_yaxis_tickfont .input-group .size").val(),
                    color: $("#score_plot_layout_yaxis_tickfont .input-group .pickr .pcr-button").css('color')
                },
                tickangle: $("#score_plot_layout_yaxis_tickangle").val(),
                showline: true,
                linecolor: $("#score_plot_layout_yaxis_linecolor .pickr .pcr-button").css('color'),
                linewidth: $("#score_plot_layout_yaxis_linewidth").val(),
                showgrid: $("#score_plot_layout_yaxis_showgrid").is(":checked"),
                //gridcolor: $("#score_plot_layout_yaxis_gridcolor .pickr .pcr-button").css('color'),
                gridcolor: $("#score_plot_layout_yaxis_gridcolor").spectrum("get").toRgbString() ,
                gridwidth: $("#score_plot_layout_yaxis_gridwidth").val(),
                zeroline: $("#score_plot_layout_yaxis_zeroline").is(":checked"),
                zerolinecolor: $("#score_plot_layout_yaxis_zerolinecolor .pickr .pcr-button").css('color'),
                zerolinewidth: $("#score_plot_layout_yaxis_zerolinewidth").val()
            },
            hovermode: "closest",
            traces: {
                scatter_colors: {
                    "1": ["rgba(0, 0, 0, 1)"],
                    "2": ["rgba(244, 67, 54, 1)", "rgba(233, 30, 99, 1)"],
                    "3": ["rgba(156, 39, 176, 1)", "rgba(63, 81, 181, 1)", 'rgba(33, 150, 243, 1)']
                }
            }
        }
        /*
        'rgba(244, 67, 54, 1)',
                                'rgba(233, 30, 99, 1)',
                                'rgba(156, 39, 176, 1)',
                                'rgba(103, 58, 183, 1)',
                                'rgba(63, 81, 181, 1)',
                                'rgba(33, 150, 243, 1)',
                                'rgba(3, 169, 244, 1)',
                                'rgba(0, 188, 212, 1)',
                                'rgba(0, 150, 136, 1)',
                                'rgba(76, 175, 80, 1)',
                                'rgba(139, 195, 74, 1)',
                                'rgba(205, 220, 57, 1)',
                                'rgba(255, 235, 59, 1)',
                                'rgba(255, 193, 7, 1)'
        */

        save_score_plot_style = function () {
            ocpu.call("save_score_plot_style", {
                method: window.location.href.split("#")[1],
                style: score_plot_layout,
                user_id: localStorage.user_id
            }, function (session) {
                console.log("good.")
            }).fail(function (e2) {
                Swal.fire('Oops...', e2.responseText, 'error')
            })
        }

        scatter_by_group({
            x: x, y: y, color_by: score_plot_color_by, color_values: score_plot_color_values, color_levels: score_plot_color_levels,
            shape_by: score_plot_shape_by, shape_values: score_plot_shape_values, shape_levels: score_plot_shape_levels,
            size_by: score_plot_size_by, size_values: score_plot_size_values, size_levels: score_plot_size_levels,
            ellipse_group: score_plot_ellipse_group,
            labels: score_plot_labels,
            layout: score_plot_layout,
            plot_id: score_plot_plot_id
        })
        /*
                o = {
                    x: x, y: y, color_by: score_plot_color_by, color_values: score_plot_color_values, color_levels: score_plot_color_levels,
                    shape_by: score_plot_shape_by, shape_values: score_plot_shape_values, shape_levels: score_plot_shape_levels,
                    size_by: score_plot_size_by, size_values: score_plot_size_values, size_levels: score_plot_size_levels,
                    ellipse_group: score_plot_ellipse_group,
                    labels: score_plot_labels,
                    layout: score_plot_layout,
                    plot_id: score_plot_plot_id
                }
        
                for(var i=0; i<Object.keys(o).length; i++){
                    window[Object.keys(o)[i]] = Object.values(o)[i]
                }
          */


    }

    $("#score_plot_layout_font, #score_plot_layout_title_font, #score_plot_layout_xaxis_title_font,#score_plot_layout_yaxis_title_font, #score_plot_layout_xaxis_tickfont, #score_plot_layout_yaxis_tickfont").load("fonts_select.html", function () {
        init_selectpicker();

        $("#score_plot_layout_font .form-group .selectpicker").change(gather_page_information_to_score_plot);
        $("#score_plot_layout_font .input-group .size").change(gather_page_information_to_score_plot);
        $("#score_plot_layout_font .input-group .pickr .pcr-button").change(gather_page_information_to_score_plot);
        $("#score_plot_layout_font .input-group .pickr-container").attr('id', 'score_plot_layout_font_color_id');

        $("#score_plot_layout_title_font .form-group .selectpicker").change(gather_page_information_to_score_plot);
        $("#score_plot_layout_title_font .input-group .size").change(gather_page_information_to_score_plot);
        $("#score_plot_layout_title_font .input-group .pickr .pcr-button").change(gather_page_information_to_score_plot);
        $("#score_plot_layout_title_font .input-group .pickr-container").attr('id', 'score_plot_layout_title_font_color_id');

        $("#score_plot_layout_xaxis_title_font .form-group .selectpicker").change(gather_page_information_to_score_plot);
        $("#score_plot_layout_xaxis_title_font .input-group .size").change(gather_page_information_to_score_plot);
        $("#score_plot_layout_xaxis_title_font .input-group .pickr .pcr-button").change(gather_page_information_to_score_plot);
        $("#score_plot_layout_xaxis_title_font .input-group .pickr-container").attr('id', 'score_plot_layout_xaxis_title_font_color_id');

        $("#score_plot_layout_yaxis_title_font .form-group .selectpicker").change(gather_page_information_to_score_plot);
        $("#score_plot_layout_yaxis_title_font .input-group .size").change(gather_page_information_to_score_plot);
        $("#score_plot_layout_yaxis_title_font .input-group .pickr .pcr-button").change(gather_page_information_to_score_plot);
        $("#score_plot_layout_yaxis_title_font .input-group .pickr-container").attr('id', 'score_plot_layout_yaxis_title_font_color_id');

        $("#score_plot_layout_xaxis_tickfont .form-group .selectpicker").change(gather_page_information_to_score_plot);
        $("#score_plot_layout_xaxis_tickfont .input-group .size").change(gather_page_information_to_score_plot);
        $("#score_plot_layout_xaxis_tickfont .input-group .pickr .pcr-button").change(gather_page_information_to_score_plot);
        $("#score_plot_layout_xaxis_tickfont .input-group .pickr-container").attr('id', 'score_plot_layout_xaxis_tickfont_color_id');

        $("#score_plot_layout_yaxis_tickfont .form-group .selectpicker").change(gather_page_information_to_score_plot);
        $("#score_plot_layout_yaxis_tickfont .input-group .size").change(gather_page_information_to_score_plot);
        $("#score_plot_layout_yaxis_tickfont .input-group .pickr .pcr-button").change(gather_page_information_to_score_plot);
        $("#score_plot_layout_yaxis_tickfont .input-group .pickr-container").attr('id', 'score_plot_layout_yaxis_tickfont_color_id');

    })



    p_column_names = Object.keys(obj.p[0])
    p_column_unique = p_column_names.map(x => unpack(obj.p, x))
    p_column_unique_length = p_column_unique.map(x => x.filter(unique).length)

    score_plot_color_levels_div = '<div class="form-group" style="margin:0;border:0;padding:0"><select class="form-control selectpicker" id="score_plot_color_levels" data-style="btn btn-link">'
    for (var i = 0; i < p_column_names.length; i++) {
        if (p_column_names[i] !== 'label') {
            score_plot_color_levels_div = score_plot_color_levels_div + '<option>' + p_column_names[i] + '</option>'
        }
    }
    score_plot_color_levels_div = score_plot_color_levels_div + '</select></div>'
    $("#score_plot_color_levels_div").html(score_plot_color_levels_div)
    score_plot_color_levels_change = function () {
        score_plot_color_by = unpack(obj.p, $("#score_plot_color_levels").val())
        score_plot_color_levels = score_plot_color_by.filter(unique)
        score_plot_color_options_div = ""
        for (var i = 0; i < score_plot_color_levels.length; i++) {
            score_plot_color_options_div = score_plot_color_options_div +
                '<div class="input-group" id="score_plot_color_options' + i + '">' +
                '<div class="input-group-prepend"><span class="input-group-text">' + score_plot_color_levels[i] +
                '</span></div><div class="pickr-container" id="score_plot_color_options' + i + '_id"></div></div>'
        }
        $("#score_plot_color_options_div").html(score_plot_color_options_div)
        init_pickr()

        setTimeout(gather_page_information_to_score_plot, 500)

    }
    $("#score_plot_color_levels").change(score_plot_color_levels_change)

    score_plot_traces_color_by_info_change = function () {
        if ($("#score_plot_traces_color_by_info").is(':checked')) {
            $("#score_plot_show_when_color_by_info").show()
            $("#score_plot_hide_when_color_by_info").hide()
        } else {
            $("#score_plot_show_when_color_by_info").hide()
            $("#score_plot_hide_when_color_by_info").show()
        }
        score_plot_color_levels_change();

    }
    $("#score_plot_traces_color_by_info").change(score_plot_traces_color_by_info_change)
    /*
        if (p_column_unique_length.some(function (x) { return (x > 1 && x < 6) })) {
            for (var i = 0; i < p_column_unique_length.length; i++) {
                if (p_column_unique_length[i] > 1 && p_column_unique_length[i] < 6) {
                    console.log(i)
                    $("#score_plot_traces_color_by_info").prop("checked", true);
                    $("#score_plot_color_levels").val(p_column_names[i])
                  
                    //score_plot_traces
                    // = $("#score_plot_plot_bgcolor .pickr .pcr-button").css('color', obj.plot_bgcolor)
    
                    break;
                }
            }
        }
    */

    score_plot_shape_levels_div = '<div class="form-group" style="margin:0;border:0;padding:0"><select class="form-control selectpicker" id="score_plot_shape_levels" data-style="btn btn-link">'
    for (var i = 0; i < p_column_names.length; i++) {
        if (p_column_names[i] !== 'label') {
            score_plot_shape_levels_div = score_plot_shape_levels_div + '<option>' + p_column_names[i] + '</option>'
        }
    }
    score_plot_shape_levels_div = score_plot_shape_levels_div + '</select></div>'
    $("#score_plot_shape_levels_div").html(score_plot_shape_levels_div)
    score_plot_shape_levels_change = function () {
        score_plot_shape_by = unpack(obj.p, $("#score_plot_shape_levels").val())
        score_plot_shape_levels = score_plot_shape_by.filter(unique)
        score_plot_shape_options_div = ""
        for (var i = 0; i < score_plot_shape_levels.length; i++) {
            score_plot_shape_options_div = score_plot_shape_options_div +
                '<div class="form-group score_plot_shapes" style="margin:0;border:0;padding:0" id="score_plot_shape_options' + i + '">' +
                '<label>' + score_plot_shape_levels[i] + '</label><select class="form-control selectpicker" data-style="btn btn-link">' +
                '<option>circle</option>' + '<option>square</option>' +
                '</select></div>'
        }
        $("#score_plot_shape_options_div").html(score_plot_shape_options_div)
        init_selectpicker()
        setTimeout(gather_page_information_to_score_plot, 500)
        $(".score_plot_shapes").change(gather_page_information_to_score_plot)



    }
    $("#score_plot_shape_levels").change(score_plot_shape_levels_change)

    score_plot_traces_shape_by_info_change = function () {
        if ($("#score_plot_traces_shape_by_info").is(':checked')) {
            $("#score_plot_show_when_shape_by_info").show()
            $("#score_plot_hide_when_shape_by_info").hide()
        } else {
            $("#score_plot_show_when_shape_by_info").hide()
            $("#score_plot_hide_when_shape_by_info").show()
        }
        score_plot_shape_levels_change()
    }
    $("#score_plot_traces_shape_by_info").change(score_plot_traces_shape_by_info_change)







    score_plot_size_levels_div = '<div class="form-group" style="margin:0;border:0;padding:0"><select class="form-control selectpicker" id="score_plot_size_levels" data-style="btn btn-link">'
    for (var i = 0; i < p_column_names.length; i++) {
        if (p_column_names[i] !== 'label') {
            score_plot_size_levels_div = score_plot_size_levels_div + '<option>' + p_column_names[i] + '</option>'
        }
    }
    score_plot_size_levels_div = score_plot_size_levels_div + '</select></div>'
    $("#score_plot_size_levels_div").html(score_plot_size_levels_div)
    score_plot_size_levels_change = function () {
        score_plot_size_by = unpack(obj.p, $("#score_plot_size_levels").val())
        score_plot_size_levels = score_plot_size_by.filter(unique)

        score_plot_size_options_div = ''
        for (var i = 0; i < score_plot_size_levels.length; i++) {
            score_plot_size_options_div = score_plot_size_options_div +
                '<div class="input-group"><div class="input-group-prepend"><span class="input-group-text">' +
                score_plot_size_levels[i] + "</span></div>" +
                '<input id="score_plot_size_options' + i + '" type="number" class="form-control score_plot_sizes" placeholder="Dot Size" min="0" step="1" value="15"></div>'
        }
        $("#score_plot_size_options_div").html(score_plot_size_options_div)
        setTimeout(gather_page_information_to_score_plot, 500)
        $(".score_plot_sizes").change(gather_page_information_to_score_plot)
    }
    $("#score_plot_size_levels").change(score_plot_size_levels_change)

    score_plot_traces_size_by_info_change = function () {
        if ($("#score_plot_traces_size_by_info").is(':checked')) {
            $("#score_plot_show_when_size_by_info").show()
            $("#score_plot_hide_when_size_by_info").hide()
        } else {
            $("#score_plot_show_when_size_by_info").hide()
            $("#score_plot_hide_when_size_by_info").show()
        }
        score_plot_size_levels_change()
    }
    $("#score_plot_traces_size_by_info").change(score_plot_traces_size_by_info_change)

    score_plot_plot_id = "score_plot"






    // assign the default value for pca score plot
    ocpu.call("get_pca_score_plot_style", {
        user_id: localStorage.user_id
    }, function (session) {
        session.getObject(function (obj) {
            console.log(obj)
            sss = obj

            /*init_pickr = function () {

                console.log($(".pickr-container").length)
                $(".pickr-container").each(function () {
                    switch (this.id) {
                        case "score_plot_plot_bgcolor_id":
                            default_color = sss.plot_bgcolor[0];
                            break;
                        case "score_plot_paper_bgcolor_id":
                            default_color = sss.paper_bgcolor[0];
                            break;

                        case "score_plot_layout_title_font_color_id":
                            default_color = sss.title.font.color[0]
                            break;

                        case "score_plot_layout_xaxis_title_font_color_id":
                            default_color = sss.xaxis.title.font.color[0]
                            break;
                        case "score_plot_layout_xaxis_tickfont_color_id":
                            default_color = sss.xaxis.tickfont.color[0]
                            break;

                        case "score_plot_layout_yaxis_title_font_color_id":
                            default_color = sss.xaxis.title.font.color[0]
                            break;
                        case "score_plot_layout_yaxis_tickfont_color_id":
                            default_color = sss.xaxis.tickfont.color[0]
                            break;

                        case "score_plot_layout_xaxis_tickcolor_id":
                            default_color = sss.xaxis.tickcolor[0];
                            break;
                        case "score_plot_layout_xaxis_linecolor_id":
                            default_color = sss.xaxis.linecolor[0];
                            break;
                        case "score_plot_layout_xaxis_gridcolor_id":
                            default_color = sss.xaxis.gridcolor[0];
                            break;
                        case "score_plot_layout_xaxis_zerolinecolor_id":
                            default_color = sss.xaxis.zerolinecolor[0];
                            break;
                        case "score_plot_layout_yaxis_tickcolor_id":
                            default_color = sss.yaxis.tickcolor[0];
                            break;
                        case "score_plot_layout_yaxis_linecolor_id":
                            default_color = sss.yaxis.linecolor[0];
                            break;
                        case "score_plot_layout_yaxis_zerolinecolor_id":
                            default_color = sss.yaxis.zerolinecolor[0];
                            break;
                        default:
                            default_color = "rgb(0, 0, 0)"
                    }
                    console.log("The current id is " + this.id + ". The color is " + default_color)
                    new Pickr(Object.assign({
                        el: this, theme: 'classic',
                        default: rgbaToHex(default_color)
                    }, {
                            swatches: [
                                'rgba(244, 67, 54, 1)',
                                'rgba(233, 30, 99, 1)',
                                'rgba(156, 39, 176, 1)',
                                'rgba(103, 58, 183, 1)',
                                'rgba(63, 81, 181, 1)',
                                'rgba(33, 150, 243, 1)',
                                'rgba(3, 169, 244, 1)',
                                'rgba(0, 188, 212, 1)',
                                'rgba(0, 150, 136, 1)',
                                'rgba(76, 175, 80, 1)',
                                'rgba(139, 195, 74, 1)',
                                'rgba(205, 220, 57, 1)',
                                'rgba(255, 235, 59, 1)',
                                'rgba(255, 193, 7, 1)'
                            ],
                            components: {
                                preview: true, opacity: true, hue: true,
                                interaction: {
                                    hex: true, rgba: true, input: true, clear: true, save: true
                                }
                            }
                        })).on('save', function () {
                            setTimeout(gather_page_information_to_score_plot, 500)
                        });
                })
            }*/

            //init_pickr = function(){}
            /*setTimeout(function () {
                console.log("653")
                init_pickr()
                setTimeout(function () {
                    gather_page_information_to_score_plot()
                }, 500)
            }, 500)*/

            /*score_plot_color_levels_change(); score_plot_traces_color_by_info_change();
            score_plot_shape_levels_change(); score_plot_traces_shape_by_info_change();
            score_plot_size_levels_change(); score_plot_traces_size_by_info_change()*/

            $("#score_plot_plot_bgcolor .pickr .pcr-button").css('color', obj.plot_bgcolor)
            $("#score_plot_paper_bgcolor .pickr .pcr-button").css('color', obj.paper_bgcolor)
            $("#score_plot_layout_title_text").val(obj.title.text)
            $("#score_plot_layout_title_font .form-group .selectpicker").val(obj.title.font.family)
            $("#score_plot_layout_title_font .form-group .selectpicker").selectpicker('refresh')
            $("#score_plot_layout_title_font .input-group .size").val(obj.title.font.size)
            $("#score_plot_layout_title_font .input-group .pickr .pcr-button").css('color', obj.title.font.color)
            $("#score_plot_layout_title_x").val(obj.title.x)
            $("#score_plot_layout_title_y").val(obj.title.y)
            $("#score_plot_layout_width").val(obj.width)
            $("#score_plot_layout_height").val(obj.height)
            $("#score_plot_layout_margin_left").val(obj.margin.l)
            $("#score_plot_layout_margin_right").val(obj.margin.r)
            $("#score_plot_layout_margin_top").val(obj.margin.t)
            $("#score_plot_layout_margin_bottom").val(obj.margin.b)

            $("#score_plot_layout_xaxis_title_text").val(obj.xaxis.title.text)
            $("#score_plot_layout_xaxis_title_font .form-group .selectpicker").val(obj.xaxis.title.font.family)
            $("#score_plot_layout_xaxis_title_font .form-group .selectpicker").selectpicker('refresh')
            $("#score_plot_layout_xaxis_title_font .input-group .size").val(obj.xaxis.title.font.size)
            $("#score_plot_layout_xaxis_title_font .input-group .pickr .pcr-button").css('color', obj.xaxis.title.font.color)

            $("#score_plot_layout_xaxis_ticklen").val(obj.xaxis.ticklen)
            $("#score_plot_layout_xaxis_tickwidth").val(obj.xaxis.tickwidth)
            $("#score_plot_layout_xaxis_tickcolor .pickr .pcr-button").css('color', obj.xaxis.tickcolor)

            $("#score_plot_layout_xaxis_tickfont .form-group .selectpicker").val(obj.xaxis.title.font.family)
            $("#score_plot_layout_xaxis_tickfont .form-group .selectpicker").selectpicker('refresh')
            $("#score_plot_layout_xaxis_tickfont .input-group .size").val(obj.xaxis.title.font.size)
            $("#score_plot_layout_xaxis_tickfont .input-group .pickr .pcr-button").css('color', obj.xaxis.title.font.color)

            $("#score_plot_layout_xaxis_tickangle").val(obj.xaxis.tickangle)
            $("#score_plot_layout_xaxis_linecolor .pickr .pcr-button").css('color', obj.xaxis.linecolor)
            $("#score_plot_layout_xaxis_linewidth").val(obj.xaxis.linewidth)

            $("#score_plot_layout_xaxis_showgrid").prop("checked", obj.xaxis.showgrid[0])
            $("#score_plot_layout_xaxis_gridcolor .pickr .pcr-button").css('color', obj.xaxis.gridcolor)
            $("#score_plot_layout_xaxis_gridwidth").val(obj.xaxis.gridwidth)
            $("#score_plot_layout_xaxis_zeroline").prop("checked", obj.xaxis.zeroline[0])
            $("#score_plot_layout_xaxis_zerolinecolor .pickr .pcr-button").css('color', obj.xaxis.zerolinecolor)
            $("#score_plot_layout_xaxis_zerolinewidth").val(obj.xaxis.zerolinewidth)


            $("#score_plot_layout_yaxis_title_text").val(obj.yaxis.title.text)
            $("#score_plot_layout_yaxis_title_font .form-group .selectpicker").val(obj.yaxis.title.font.family)
            $("#score_plot_layout_yaxis_title_font .form-group .selectpicker").selectpicker('refresh')
            $("#score_plot_layout_yaxis_title_font .input-group .size").val(obj.yaxis.title.font.size)
            $("#score_plot_layout_yaxis_title_font .input-group .pickr .pcr-button").css('color', obj.yaxis.title.font.color)

            $("#score_plot_layout_yaxis_ticklen").val(obj.yaxis.ticklen)
            $("#score_plot_layout_yaxis_tickwidth").val(obj.yaxis.tickwidth)
            $("#score_plot_layout_yaxis_tickcolor .pickr .pcr-button").css('color', obj.yaxis.tickcolor)

            $("#score_plot_layout_yaxis_tickfont .form-group .selectpicker").val(obj.yaxis.title.font.family)
            $("#score_plot_layout_yaxis_tickfont .form-group .selectpicker").selectpicker('refresh')
            $("#score_plot_layout_yaxis_tickfont .input-group .size").val(obj.yaxis.title.font.size)
            $("#score_plot_layout_yaxis_tickfont .input-group .pickr .pcr-button").css('color', obj.yaxis.title.font.color)

            $("#score_plot_layout_yaxis_tickangle").val(obj.yaxis.tickangle)
            $("#score_plot_layout_yaxis_linecolor .pickr .pcr-button").css('color', obj.yaxis.linecolor)
            $("#score_plot_layout_yaxis_linewidth").val(obj.yaxis.linewidth)

            $("#score_plot_layout_yaxis_showgrid").prop("checked", obj.yaxis.showgrid[0])
            //$("#score_plot_layout_yaxis_gridcolor .pickr .pcr-button").css('color', obj.yaxis.gridcolor)
            $("#score_plot_layout_yaxis_gridcolor").spectrum({
                color: obj.yaxis.gridcolor[0]
            });
            $("#score_plot_layout_yaxis_gridwidth").val(obj.yaxis.gridwidth)
            $("#score_plot_layout_yaxis_zeroline").prop("checked", obj.yaxis.zeroline[0])
            $("#score_plot_layout_yaxis_zerolinecolor .pickr .pcr-button").css('color', obj.yaxis.zerolinecolor)
            $("#score_plot_layout_yaxis_zerolinewidth").val(obj.yaxis.zerolinewidth)

            score_plot_traces = obj.traces


            init_pickr();


            setTimeout(function(){
                if (p_column_unique_length.some(function (x) { return (x > 1 && x < 6) })) {
                    for (var i = 0; i < p_column_unique_length.length; i++) {
                        if (p_column_unique_length[i] > 1 && p_column_unique_length[i] < 6) {
                            console.log(i)
                            

                            
                            $("#score_plot_color_levels").val(p_column_names[i])
                            $("#score_plot_color_levels").selectpicker('refresh')
                            $("#score_plot_traces_color_by_info").prop("checked", true).change();

                            
                            setTimeout(function(){
                                console.log("!!")
                                console.log(p_column_unique_length[i])
                                for(var j=0; j<p_column_unique_length[i];j++){
                                    $("#score_plot_color_options"+j+" .pickr .pcr-button").css('color', score_plot_traces.scatter_colors[p_column_unique_length[i]][j])
                                }
                                console.log("804")
                                console.log($("#score_plot_color_options"+0+" .pickr .pcr-button").css('color'))
                                gather_page_information_to_score_plot()
                            },500)



                            break;
                        }
                    }
                }
                
            },500)






        })
    }).fail(function (e2) {
        Swal.fire('Oops...', e2.responseText, 'error')
    })







    var files_sources = [session.loc + "files/sample_scores.csv", session.loc + "files/compound_loadings.csv"];
    var files_names = ["sample_scores.csv", "compound_loadings.csv"]
    var zipfile_name = "pca_results.zip"
    $("#download_results").off("click").on("click", function () {
        download_results(files_names, files_sources, zipfile_name)
    })

}
