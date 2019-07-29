



$.get("plot_layout_adjuster.html", function (plot_layout_adjuster_string) {
    $("#score_plot_to_be_loaded").append($.parseHTML(plot_layout_adjuster_string.replaceAll("PLOT_NAME", "score_plot")));

    $.getScript("js/plot_layout_adjuster1.js", function (plot_layout_adjuster1) {
        adjusted_score_plot_layout_adjuster1 = plot_layout_adjuster1.replaceAll("PLOT_NAME", "score_plot")
        console.log(adjusted_score_plot_layout_adjuster1)
        eval(adjusted_score_plot_layout_adjuster1)

        // assign the default value for pca score plot
        ocpu.call("get_pca_score_plot_style", {
            user_id: localStorage.user_id
        }, function (session) {
            session.getObject(function (score_plot_obj) {
                console.log(score_plot_obj)
                oo = score_plot_obj
                score_plot_traces = score_plot_obj.traces

                $.getScript("js/plot_layout_adjuster2.js", function (plot_layout_adjuster2) {
                    adjusted_score_plot_layout_adjuster2 = plot_layout_adjuster2.replaceAll("PLOT_NAME", "score_plot")




                    console.log(adjusted_score_plot_layout_adjuster2) // THIS console log is neccessary. 
                    eval(adjusted_score_plot_layout_adjuster2)
                    $("#score_plot_layout_yaxis_title_text").val("PC" + $("#score_plot_pcy").val() + " (" + (obj_score_loading_plot.variance[$("#score_plot_pcy").val() - 1] * 100).toFixed(2) + "%)")
                    $("#score_plot_layout_yaxis_title_text").val("PC" + $("#score_plot_pcy").val() + " (" + (obj_score_loading_plot.variance[$("#score_plot_pcy").val() - 1] * 100).toFixed(2) + "%)")

                    $("#score_plot_color_option").spectrum({
                        color: score_plot_traces.scatter_colors[1][0],
                        showPalette: true,
                        palette: color_pallete
                    });
                    $("#score_plot_color_option").change(gather_page_information_to_score_plot)

                    $("#score_plot_shape_option .selectpicker").val(score_plot_traces.scatter_shapes[1][0])
                    $("#score_plot_shape_option .selectpicker").selectpicker('refresh')
                    $("#score_plot_shape_option .selectpicker").change(gather_page_information_to_score_plot)

                    $("#score_plot_size_option").val(score_plot_traces.scatter_sizes[1][0])
                    $("#score_plot_size_option").change(gather_page_information_to_score_plot)

                    if (p_column_unique_length.some(function (x) { return (x > 1 && x < 6) })) {
                        for (var i = 0; i < p_column_unique_length.length; i++) {
                            if (p_column_unique_length[i] > 1 && p_column_unique_length[i] < 6) {
                                $("#score_plot_color_levels").val(p_column_names[i])
                                $("#score_plot_color_levels").selectpicker('refresh')
                                $("#score_plot_traces_color_by_info").prop("checked", true).change();
                                for (var j = 0; j < p_column_unique_length[i]; j++) {
                                    $("#score_plot_color_options" + j).spectrum("set", score_plot_traces.scatter_colors[p_column_unique_length[i]][j][0]);
                                }
                                gather_page_information_to_score_plot()
                                break;
                            }
                        }
                    }
                })

            })
        }).fail(function (e2) {
            Swal.fire('Oops...', e2.responseText, 'error')
        })
        /*scatter_by_group({
                x: x, y: y, color_by: score_plot_color_by, color_values: score_plot_color_values, color_levels: score_plot_color_levels,
                shape_by: score_plot_shape_by, shape_values: score_plot_shape_values, shape_levels: score_plot_shape_levels,
                size_by: score_plot_size_by, size_values: score_plot_size_values, size_levels: score_plot_size_levels,
                ellipse_group: score_plot_ellipse_group,
                labels: score_plot_labels,
                layout: score_plot_layout,
                plot_id: score_plot_plot_id
            })*/

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
                    legendgroup: trace_keys[i],
                    showlegend: true
                })
            }
            // add ellipse.
            if (ellipse_group === "no_ellipse") {
                console.log("no ellipse")
            } else { // it means use would like to draw ellipse.
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
            }




            if (names == "++") {
                layout.showlegend = false
            }



            Plotly.newPlot(plot_id, data, layout, { editable: false })


                .then(gd => {
                    ggg = gd
                    // Note: cache should not be re-used by repeated calls to JSON.stringify.
                    var cache = [];
                    fullLayout = JSON.stringify(ggg._fullLayout, function (key, value) {
                        if (typeof value === 'object' && value !== null) {
                            if (cache.indexOf(value) !== -1) {
                                // Duplicate reference found, discard key
                                return;
                            }
                            // Store value in our collection
                            cache.push(value);
                        }
                        return value;
                    });
                    cache = null; // Enable garbage collection
                    // Note: cache should not be re-used by repeated calls to JSON.stringify.
                    var cache = [];
                    fullData = JSON.stringify(ggg._fullData, function (key, value) {
                        if (typeof value === 'object' && value !== null) {
                            if (cache.indexOf(value) !== -1) {
                                // Duplicate reference found, discard key
                                return;
                            }
                            // Store value in our collection
                            cache.push(value);
                        }
                        return value;
                    });
                    cache = null; // Enable garbage collection

                    score_plot_parameters = {
                        full_data: JSON.parse(fullData),
                        full_layout: JSON.parse(fullLayout),
                        data: ggg.data,
                        layout: ggg.layout,

                    }

                    if ($("#score_plot_traces_color_by_info").is(":checked")) {
                        score_plot_parameters.score_plot_color_levels = $("#score_plot_color_levels").val()
                    }
                    if ($("#score_plot_traces_shape_by_info").is(":checked")) {
                        score_plot_parameters.score_plot_shape_levels = $("#score_plot_shape_levels").val()
                    }
                    if ($("#score_plot_traces_size_by_info").is(":checked")) {
                        score_plot_parameters.score_plot_size_levels = $("#score_plot_size_levels").val()
                    }


                    /*
                                    ocpu.call("test_pca", {
                                        full_data:JSON.parse(fullData),
                                        full_layout:JSON.parse(fullLayout),
                                        data: ggg.data,
                                        layout: ggg.layout
                                    }, function (session) {
                                        console.log(session)
                                    })
                    */


                    // here click to add annotations.
                    /*console.log(gd)
                    gd.on('plotly_clickannotation', (x) => {
                        console.log(x)
                        console.log('annotation clicked !!!');
                    })*/
                    Plotly.toImage(gd, { format: 'svg' })
                        .then(
                            function (url) {
                                uuuu = url
                                uuu = uuuu.replace(/^data:image\/svg\+xml,/, '');
                                uuu = decodeURIComponent(uuu);
                                plot_url.score_plot = btoa(unescape(encodeURIComponent(uuu)))
                                files_sources[2] = plot_url.score_plot
                                /*var canvas = document.createElement("canvas");
                                var context = canvas.getContext("2d");
                                canvas.width = 4000;
                                canvas.height = 3000;
                                var image = new Image();
                                context.clearRect ( 0, 0, 4000, 3000 );
                                var imgsrc = 'data:image/svg+xml;base64,'+ btoa(unescape(url.replace("data:image/svg+xml,",""))); // Convert SVG string to data URL
      
                                var image = new Image();
                                image.onload = function() {
                                    context.drawImage(image, 0, 0, 4000, 3000);
                                    var img = canvas.toDataURL("image/png");
                                    base64 = img.replace("data:image/png;base64,","")
                                    plot_url.score_plot = base64
                                };
                                image.src = imgsrc*/
                            }
                        )



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
            console.log($("#score_plot_plot_bgcolor").spectrum("get").toRgbString())

            x = unpack(obj_score_loading_plot.sample_scores, "PC" + $("#score_plot_pcx").val())
            y = unpack(obj_score_loading_plot.sample_scores, "PC" + $("#score_plot_pcy").val())


            if (!$("#score_plot_traces_color_by_info").is(":checked")) {
                score_plot_color_values = [$("#score_plot_color_option").spectrum("get").toRgbString()]
                score_plot_color_by = undefined
            } else {
                score_plot_color_values = score_plot_color_levels.map(function (x, i) {
                    return ($("#score_plot_color_options" + i).spectrum("get").toRgbString())
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
            if ($("#score_plot_confidence_ellipse").is(":checked")) {
                score_plot_ellipse_group = ['color']
            } else {
                score_plot_ellipse_group = 'no_ellipse'
            }

            score_plot_labels = unpack(obj_score_loading_plot.p, "label")
            $("#score_plot_layout_xaxis_title_text").val("PC" + $("#score_plot_pcx").val() + " (" + (obj_score_loading_plot.variance[$("#score_plot_pcx").val() - 1] * 100).toFixed(2) + "%)")
            $("#score_plot_layout_yaxis_title_text").val("PC" + $("#score_plot_pcy").val() + " (" + (obj_score_loading_plot.variance[$("#score_plot_pcy").val() - 1] * 100).toFixed(2) + "%)")




            $.getScript("js/plot_layout_adjuster3.js", function (plot_layout_adjuster3) {
                adjusted_score_plot_layout_adjuster3 = plot_layout_adjuster3.replaceAll("PLOT_NAME", "score_plot")
                console.log(adjusted_score_plot_layout_adjuster3) // THIS console log is neccessary.
                eval(adjusted_score_plot_layout_adjuster3)
                save_score_plot_style = function () {


                    if ($("#score_plot_traces_color_by_info").is(':checked')) {
                        for (var i = 0; i < score_plot_color_levels.length; i++) {
                            score_plot_layout.traces.scatter_colors[score_plot_color_levels.length][i] = $("#score_plot_color_options" + i).spectrum("get").toRgbString()
                        }
                    } else {
                        score_plot_layout.traces.scatter_colors[1] = $("#score_plot_color_option").spectrum("get").toRgbString()
                    }

                    if ($("#score_plot_traces_shape_by_info").is(':checked')) {
                        for (var i = 0; i < score_plot_shape_levels.length; i++) {
                            score_plot_layout.traces.scatter_shapes[score_plot_shape_levels.length][i] = $("#score_plot_shape_options" + i + " .selectpicker").val()
                        }
                    } else {
                        score_plot_layout.traces.scatter_shapes[1] = $("#score_plot_shape_option .selectpicker").val()
                    }


                    if ($("#score_plot_traces_size_by_info").is(':checked')) {
                        for (var i = 0; i < score_plot_size_levels.length; i++) {
                            score_plot_layout.traces.scatter_sizes[score_plot_size_levels.length][i] = $("#score_plot_size_options" + i).val()
                        }
                    } else {
                        score_plot_layout.traces.scatter_sizes[1] = $("#score_plot_size_option").val()
                    }

                    $.getScript("js/plot_layout_adjuster4.js", function (plot_layout_adjuster4) {
                        adjusted_score_plot_layout_adjuster4 = plot_layout_adjuster4.replaceAll("PLOT_NAME", "score_plot")
                        console.log(adjusted_score_plot_layout_adjuster4)
                        eval(adjusted_score_plot_layout_adjuster4)
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



        p_column_names = Object.keys(obj_score_loading_plot.p[0])
        p_column_unique = p_column_names.map(x => unpack(obj_score_loading_plot.p, x))
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
            score_plot_color_by = unpack(obj_score_loading_plot.p, $("#score_plot_color_levels").val())
            score_plot_color_levels = score_plot_color_by.filter(unique)
            score_plot_color_options_div = ""
            for (var i = 0; i < score_plot_color_levels.length; i++) {
                score_plot_color_options_div = score_plot_color_options_div +
                    '<div class="input-group" id="score_plot_color_options' + i + '_div">' +
                    '<div class="input-group-prepend"><span class="input-group-text">' + score_plot_color_levels[i] +
                    '</span></div><input type="text" id="score_plot_color_options' + i + '" class="spectrums" data-show-alpha="true" /></div>'
            }
            $("#score_plot_color_options_div").html(score_plot_color_options_div)

            for (var i = 0; i < score_plot_color_levels.length; i++) {
                $("#score_plot_color_options" + i).spectrum({
                    color: score_plot_traces.scatter_colors[score_plot_color_levels.length][i][0],
                    showPalette: true,
                    palette: color_pallete
                });
                $("#score_plot_color_options" + i).change(gather_page_information_to_score_plot)
            }

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


        score_plot_shape_levels_div = '<div class="form-group" style="margin:0;border:0;padding:0"><select class="form-control selectpicker" id="score_plot_shape_levels" data-style="btn btn-link">'
        for (var i = 0; i < p_column_names.length; i++) {
            if (p_column_names[i] !== 'label') {
                score_plot_shape_levels_div = score_plot_shape_levels_div + '<option>' + p_column_names[i] + '</option>'
            }
        }
        score_plot_shape_levels_div = score_plot_shape_levels_div + '</select></div>'
        $("#score_plot_shape_levels_div").html(score_plot_shape_levels_div)
        score_plot_shape_levels_change = function () {
            score_plot_shape_by = unpack(obj_score_loading_plot.p, $("#score_plot_shape_levels").val())
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


            for (var i = 0; i < score_plot_shape_levels.length; i++) {
                $("#score_plot_shape_options" + i + " .selectpicker").val(score_plot_traces.scatter_shapes[score_plot_shape_levels.length][i][0])
                $("#score_plot_shape_options" + i + " .selectpicker").selectpicker('refresh')
                $("#score_plot_shape_options" + i + " .selectpicker").change(gather_page_information_to_score_plot)
            }



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
            score_plot_size_by = unpack(obj_score_loading_plot.p, $("#score_plot_size_levels").val())
            score_plot_size_levels = score_plot_size_by.filter(unique)

            score_plot_size_options_div = ''
            for (var i = 0; i < score_plot_size_levels.length; i++) {
                score_plot_size_options_div = score_plot_size_options_div +
                    '<div class="input-group"><div class="input-group-prepend"><span class="input-group-text">' +
                    score_plot_size_levels[i] + "</span></div>" +
                    '<input id="score_plot_size_options' + i + '" type="number" class="form-control score_plot_sizes" placeholder="Dot Size" min="0" step="1" value="15"></div>'
            }
            $("#score_plot_size_options_div").html(score_plot_size_options_div)



            for (var i = 0; i < score_plot_size_levels.length; i++) {
                if (score_plot_size_levels.length === 1) {
                    $("#score_plot_size_options" + i).val(score_plot_traces.scatter_sizes[score_plot_size_levels.length][i])
                } else {
                    $("#score_plot_size_options" + i).val(score_plot_traces.scatter_sizes[score_plot_size_levels.length][i][0])
                }

                $("#score_plot_size_options" + i).change(gather_page_information_to_score_plot)
            }




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







    }, 'js')














}, 'html');







