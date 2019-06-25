parameter = {}
parameter.fun_name = 'principal_component_analysis'
parameter.project_id = localStorage.activate_project_id

if (localStorage['activate_data_id'] !== undefined && localStorage.big_category === 'project') {
    parameter.activate_data_id = localStorage['activate_data_id']
} else {
    parameter.activate_data_id = 'e.csv'
}
parameter.scaling_method = "standard"
ocpu.call("call_fun", { parameter: parameter }, function (session) {
    session.getObject(function (obj) {
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


        o = obj
        data = o

        p_column_names = Object.keys(obj.p[0])


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
        }
        $("#score_plot_traces_color_by_info").change(score_plot_traces_color_by_info_change)

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
                    '<div class="form-group" style="margin:0;border:0;padding:0" id="score_plot_shape_options' + i + '">' +
                    '<label>' + score_plot_shape_levels[i] + '</label><select class="form-control selectpicker" data-style="btn btn-link">' +
                    '<option>circle</option>' + '<option>square</option>' +
                    '</select></div>'
            }
            $("#score_plot_shape_options_div").html(score_plot_shape_options_div)
            init_selectpicker()
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
                    '<input id="score_plot_size_options' + i + '" type="number" class="form-control" placeholder="Dot Size" min="0" step="1"></div>'
            }
            $("#score_plot_size_options_div").html(score_plot_size_options_div)
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
        }
        $("#score_plot_traces_size_by_info").change(score_plot_traces_size_by_info_change)

        score_plot_plot_id = "testing_pca"


        gather_page_information_to_score_plot = function () {

            x = unpack(obj.sample_scores, "PC1")
            y = unpack(obj.sample_scores, "PC2")


            if (!$("#score_plot_traces_color_by_info").is(":checked")) {
                score_plot_color_values = [$("#score_plot_color_option .pickr .pcr-button").css('color')]
            } else {
                score_plot_color_values = score_plot_color_levels.map(function (x, i) {
                    return ($("#score_plot_color_options" + i + " .pickr .pcr-button").css('color'))
                })
            }

            if (!$("#score_plot_traces_shape_by_info").is(":checked")) {
                score_plot_shape_values = [$("#score_plot_shape_option .selectpicker").val()]
            } else {
                score_plot_shape_values = score_plot_color_levels.map(function (x, i) {
                    return ($("#score_plot_shape_options" + i + " .selectpicker").val())
                })
            }


            if (!$("#score_plot_traces_size_by_info").is(":checked")) {
                score_plot_size_values = [$("#score_plot_size_option").val()]
            } else {
                score_plot_size_values = score_plot_color_levels.map(function (x, i) {
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
                    gridcolor: $("#score_plot_layout_yaxis_gridcolor .pickr .pcr-button").css('color'),
                    gridwidth: $("#score_plot_layout_yaxis_gridwidth").val(),
                    zeroline: $("#score_plot_layout_yaxis_zeroline").is(":checked"),
                    zerolinecolor: $("#score_plot_layout_yaxis_zerolinecolor .pickr .pcr-button").css('color'),
                    zerolinewidth: $("#score_plot_layout_yaxis_zerolinewidth").val()
                },
                hovermode: "closest"
            }

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
        }




        // assign the default value for pca score plot
        ocpu.call("get_pca_score_plot_style", {
            user_id: localStorage.user_id
        }, function (session) {
            session.getObject(function (obj) {
                console.log(obj)
                sss = obj

                init_pickr = function () {
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
                            case "score_plot_layout_yaxis_gridcolor_id":
                                default_color = sss.yaxis.gridcolor[0];
                                break;
                            case "score_plot_layout_yaxis_zerolinecolor_id":
                                default_color = sss.yaxis.zerolinecolor[0];
                                break;
                            default:
                            default_color = "rgb(0, 0, 0)"
                        }
                        new Pickr(Object.assign({
                            el: this, theme: 'classic',
                            default: default_color
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
                            })).on('save', function () {
                                setTimeout(gather_page_information_to_score_plot, 200)
                            });
                    })
                }

                //init_pickr = function(){}
                setTimeout(function(){
                    init_pickr()
                    gather_page_information_to_score_plot()
                }, 500)

                score_plot_color_levels_change(); score_plot_traces_color_by_info_change();
                score_plot_shape_levels_change(); score_plot_traces_shape_by_info_change();
                score_plot_size_levels_change(); score_plot_traces_size_by_info_change()

                /*$("#score_plot_plot_bgcolor .pickr .pcr-button").css('color', obj.plot_bgcolor)
                $("#score_plot_paper_bgcolor .pickr .pcr-button").css('color', obj.paper_bgcolor)*/
                $("#score_plot_layout_title_text").val(obj.title.text)
                $("#score_plot_layout_title_font .form-group .selectpicker").val(obj.title.font.family)
                $("#score_plot_layout_title_font .form-group .selectpicker").selectpicker('refresh')
                $("#score_plot_layout_title_font .input-group .size").val(obj.title.font.size)
                //$("#score_plot_layout_title_font .input-group .pickr .pcr-button").css('color', obj.title.font.color)
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
                //$("#score_plot_layout_xaxis_title_font .input-group .pickr .pcr-button").css('color', obj.xaxis.title.font.color)

                $("#score_plot_layout_xaxis_ticklen").val(obj.xaxis.ticklen)
                $("#score_plot_layout_xaxis_tickwidth").val(obj.xaxis.tickwidth)
                //$("#score_plot_layout_xaxis_tickcolor .pickr .pcr-button").css('color', obj.xaxis.tickcolor)

                $("#score_plot_layout_xaxis_tickfont .form-group .selectpicker").val(obj.xaxis.title.font.family)
                $("#score_plot_layout_xaxis_tickfont .form-group .selectpicker").selectpicker('refresh')
                $("#score_plot_layout_xaxis_tickfont .input-group .size").val(obj.xaxis.title.font.size)
                //$("#score_plot_layout_xaxis_tickfont .input-group .pickr .pcr-button").css('color', obj.xaxis.title.font.color)

                $("#score_plot_layout_xaxis_tickangle").val(obj.xaxis.tickangle)
                //$("#score_plot_layout_xaxis_linecolor .pickr .pcr-button").css('color', obj.xaxis.linecolor)
                $("#score_plot_layout_xaxis_linewidth").val(obj.xaxis.linewidth)

                $("#score_plot_layout_xaxis_showgrid").prop("checked", obj.xaxis.showgrid[0])
                //$("#score_plot_layout_xaxis_gridcolor .pickr .pcr-button").css('color', obj.xaxis.gridcolor)
                $("#score_plot_layout_xaxis_gridwidth").val(obj.xaxis.gridwidth)
                $("#score_plot_layout_xaxis_zeroline").prop("checked", obj.xaxis.zeroline[0])
                //$("#score_plot_layout_xaxis_zerolinecolor .pickr .pcr-button").css('color', obj.xaxis.zerolinecolor)
                $("#score_plot_layout_xaxis_zerolinewidth").val(obj.xaxis.zerolinewidth)


                $("#score_plot_layout_yaxis_title_text").val(obj.yaxis.title.text)
                $("#score_plot_layout_yaxis_title_font .form-group .selectpicker").val(obj.yaxis.title.font.family)
                $("#score_plot_layout_yaxis_title_font .form-group .selectpicker").selectpicker('refresh')
                $("#score_plot_layout_yaxis_title_font .input-group .size").val(obj.yaxis.title.font.size)
                //$("#score_plot_layout_yaxis_title_font .input-group .pickr .pcr-button").css('color', obj.yaxis.title.font.color)

                $("#score_plot_layout_yaxis_ticklen").val(obj.yaxis.ticklen)
                $("#score_plot_layout_yaxis_tickwidth").val(obj.yaxis.tickwidth)
                //$("#score_plot_layout_yaxis_tickcolor .pickr .pcr-button").css('color', obj.yaxis.tickcolor)

                $("#score_plot_layout_yaxis_tickfont .form-group .selectpicker").val(obj.yaxis.title.font.family)
                $("#score_plot_layout_yaxis_tickfont .form-group .selectpicker").selectpicker('refresh')
                $("#score_plot_layout_yaxis_tickfont .input-group .size").val(obj.yaxis.title.font.size)
                //$("#score_plot_layout_yaxis_tickfont .input-group .pickr .pcr-button").css('color', obj.yaxis.title.font.color)

                $("#score_plot_layout_yaxis_tickangle").val(obj.yaxis.tickangle)
                //$("#score_plot_layout_yaxis_linecolor .pickr .pcr-button").css('color', obj.yaxis.linecolor)
                $("#score_plot_layout_yaxis_linewidth").val(obj.yaxis.linewidth)

                $("#score_plot_layout_yaxis_showgrid").prop("checked", obj.yaxis.showgrid[0])
                //$("#score_plot_layout_yaxis_gridcolor .pickr .pcr-button").css('color', obj.yaxis.gridcolor)
                $("#score_plot_layout_yaxis_gridwidth").val(obj.yaxis.gridwidth)
                $("#score_plot_layout_yaxis_zeroline").prop("checked", obj.yaxis.zeroline[0])
                //$("#score_plot_layout_yaxis_zerolinecolor .pickr .pcr-button").css('color', obj.yaxis.zerolinecolor)
                $("#score_plot_layout_yaxis_zerolinewidth").val(obj.yaxis.zerolinewidth)

                



            })
        }).fail(function (e2) {
            Swal.fire('Oops...', e2.responseText, 'error')
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
