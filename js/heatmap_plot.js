



$.get("plot_layout_adjuster.html", function (plot_layout_adjuster_string) {
    $("#heatmap_plot_to_be_loaded").append($.parseHTML(plot_layout_adjuster_string.replaceAll("PLOT_NAME", "heatmap_plot")));

    $.getScript("js/plot_layout_adjuster1.js", function (plot_layout_adjuster1) {
        adjusted_heatmap_plot_layout_adjuster1 = plot_layout_adjuster1.replaceAll("PLOT_NAME", "heatmap_plot")
        console.log(adjusted_heatmap_plot_layout_adjuster1)
        eval(adjusted_heatmap_plot_layout_adjuster1)

        // assign the default value for heatmap plot
        ocpu.call("get_heatmap_plot_style", {
            user_id: localStorage.user_id
        }, function (session) {
            session.getObject(function (heatmap_plot_obj) {
                console.log(heatmap_plot_obj)
                oo = heatmap_plot_obj
                heatmap_plot_traces = heatmap_plot_obj.traces

                $.getScript("js/plot_layout_adjuster2.js", function (plot_layout_adjuster2) {
                    adjusted_heatmap_plot_layout_adjuster2 = plot_layout_adjuster2.replaceAll("PLOT_NAME", "heatmap_plot")

                    console.log(adjusted_heatmap_plot_layout_adjuster2) // THIS console log is neccessary. 
                    eval(adjusted_heatmap_plot_layout_adjuster2)
                    /*$("#heatmap_plot_layout_yaxis_title_text").val("PC" + $("#heatmap_plot_pcy").val() + " (" + (obj_score_loading_plot.variance[$("#heatmap_plot_pcy").val() - 1] * 100).toFixed(2) + "%)")
                    $("#heatmap_plot_layout_yaxis_title_text").val("PC" + $("#heatmap_plot_pcy").val() + " (" + (obj_score_loading_plot.variance[$("#heatmap_plot_pcy").val() - 1] * 100).toFixed(2) + "%)")*/

                    /*$("#heatmap_plot_color_option").spectrum({
                        color: heatmap_plot_traces.scatter_colors[1][0],
                        showPalette: true,
                        palette: color_pallete
                    });
                    $("#heatmap_plot_color_option").change(gather_page_information_to_heatmap_plot)

                    $("#heatmap_plot_shape_option .selectpicker").val(heatmap_plot_traces.scatter_shapes[1][0])
                    $("#heatmap_plot_shape_option .selectpicker").selectpicker('refresh')
                    $("#heatmap_plot_shape_option .selectpicker").change(gather_page_information_to_heatmap_plot)

                    $("#heatmap_plot_size_option").val(heatmap_plot_traces.scatter_sizes[1][0])
                    $("#heatmap_plot_size_option").change(gather_page_information_to_heatmap_plot)

                    if (p_column_unique_length.some(function (x) { return (x > 1 && x < 6) })) {
                        for (var i = 0; i < p_column_unique_length.length; i++) {
                            if (p_column_unique_length[i] > 1 && p_column_unique_length[i] < 6) {
                                $("#heatmap_plot_color_levels").val(p_column_names[i])
                                $("#heatmap_plot_color_levels").selectpicker('refresh')
                                $("#heatmap_plot_traces_color_by_info").prop("checked", true).change();
                                for (var j = 0; j < p_column_unique_length[i]; j++) {
                                    $("#heatmap_plot_color_options" + j).spectrum("set", heatmap_plot_traces.scatter_colors[p_column_unique_length[i]][j][0]);
                                }
                                gather_page_information_to_heatmap_plot()
                                break;
                            }
                        }
                    }*/
                })

            })
        }).fail(function (e2) {
            Swal.fire('Oops...', e2.responseText, 'error')
        })
        /*heatmap_plot_fun({
                x: x, y: y, color_by: heatmap_plot_color_by, color_values: heatmap_plot_color_values, color_levels: heatmap_plot_color_levels,
                shape_by: heatmap_plot_shape_by, shape_values: heatmap_plot_shape_values, shape_levels: heatmap_plot_shape_levels,
                size_by: heatmap_plot_size_by, size_values: heatmap_plot_size_values, size_levels: heatmap_plot_size_levels,
                ellipse_group: heatmap_plot_ellipse_group,
                labels: heatmap_plot_labels,
                layout: heatmap_plot_layout,
                plot_id: heatmap_plot_plot_id
            })*/
        //tickvals = [oo.min[0],oo.median[0],oo.max[0]]
        //colorscale = ctrl.parameters.colorscale
        // sample_dendro_trace_x = oo.sx, sample_dendro_trace_y = oo.sy
        // compound_dendro_trace_x = oo.cx, compound_dendro_trace_y = oo.cy
        /*sample_annotations   colors: (2) ["#ff0080", "#ff8000"]
column: "fake_two_group"
type: "character" */
        /* sample_level_options: fake_two_group: (2) ["A", "B"]
        id: (16) ["M102", "M103", "M104", "M105", "M121", "M156", "M62", "M70", "M100", "M101", "M129", "M130", "M177", "M59", "M96", "M98"]
        label: (16) ["M102", "M102.1", "M104", "M105", "M121", "M156", "M62", "M70", "M100", "M101", "M129", "M130", "M177", "M59", "M96", "M98"]
        mx sample id: ["415186"]
        organ: ["Heart"]
        species: ["Mice"]
        treatment: ["Non Swimming"]
        */
        /*p ooo.p */
        /* sample_order
        (16) [0, 2, 4, 6, 8, 10, 12, 14, 1, 3, 5, 7, 9, 11, 13, 15]*/
        heatmap_plot_fun = function ({ heatmap_x: undefined, heatmap_y: undefined, heatmap_z: undefined, sample_label: undefined, heatmap_x_text: undefined, heatmap_y_text: undefined, tickvals: undefined,
            colorscale: undefined,
            show_sample_dendrogram: undefined, sample_dendro_trace_x: undefined,
            show_compound_dendrogram: undefined, compound_dendro_trace_x: undefined,
            sample_annotations: undefined,
            sample_level_options: undefined, p: undefined, sample_order: undefined,
            sample_tree_height: undefined, sample_annotation_height: undefined,
            compound_annotations: undefined,
            compound_level_options: undefined, f: undefined, compound_order: undefined,
            compound_tree_height: undefined, compound_annotation_height: undefined,
            layout = undefined, plot_id = undefined } = {}
        ) {
            var myPlot = document.getElementById(plot_id)
            heatmap_trace = {
                x: heatmap_x,
                y: heatmap_y,
                z: heatmap_z,
                type: "heatmap",
                showscale: true,
                colorbar: {
                    thicknessmode: "fraction",
                    thickness: 0.01,
                    lenmode: "fraction",
                    len: 0.3,
                    outlinecolor: "white",
                    nticks: 2,
                    ticklen: 0,
                    tickvals: tickvals,
                    ticktext: ["low", "median", "high"],
                    tickcolor: "black",
                    tickfont: {
                        family: "Dorid Sans",
                        color: "black",
                        size: 10
                    }
                },
                //autocolorscale:false,
                colorscale: colorscale,
                showlegend: false,
                xaxis: "x",
                yaxis: "y",
                hoverinfo: "text",
                name: "",
                xgap: 1,
                ygap: 1
            }

            if (show_sample_dendrogram) {
                var sample_dendro_trace = {
                    x: sample_dendro_trace_x,
                    y: sample_dendro_trace_y,
                    text: "",
                    type: "scatter",
                    mode: "lines",
                    line: {
                        width: 1,
                        color: "black",
                        dash: "solid"
                    },
                    hoveron: "points",
                    showlegend: false,
                    xaxis: "x2",
                    yaxis: "y2",
                    hoverinfo: "skip",
                    name: ""
                }
            }
            if (show_compound_dendrogram) {
                var compound_dendro_trace = {
                    x: oo.cx,
                    y: oo.cy,
                    text: "",
                    type: "scatter",
                    mode: "lines",
                    line: {
                        width: 1,
                        color: "black",
                        dash: "solid"
                    },
                    hoveron: "points",
                    showlegend: false,
                    xaxis: "x3",
                    yaxis: "y3",
                    hoverinfo: "skip",
                    name: ""
                }
            }

            sample_annotation_traces = []
            for (var i = 0; i < sample_annotations.length; i++) {
                var temp_z = unpack(p, sample_annotations[i].column)
                var temp_color_scale = []
                for (var j = 0; j < sample_level_options[sample_annotations[i].column].length; j++) {
                    if ((sample_level_options[sample_annotations[i].column].length - 1) === 0) {
                        temp_color_scale[j] = [0, sample_annotations[i].colors[j]]
                        temp_color_scale[j + 1] = [1, sample_annotations[i].colors[j]]
                    } else {
                        temp_color_scale[j] = [j / (sample_level_options[sample_annotations[i].column].length - 1), sample_annotations[i].colors[j]]
                    }

                }
                sample_annotation_traces[i] = {
                    x: heatmap_x,
                    //y:Array.apply(0, Array(heatmap_x.length)).map(function() { return 0; }),
                    y: [0],
                    z: [sample_order.map(x => temp_z[x]).map(x => sample_level_options[sample_annotations[i].column].indexOf(x))],
                    type: "heatmap",
                    showscale: false,
                    colorscale: temp_color_scale,
                    autocolorscale: false,
                    showlegend: false,
                    xaxis: "x" + (i + 4),
                    yaxis: "y" + (i + 4),
                    hoverinfo: "text",
                    name: "",
                    xgap: 1,
                    ygap: 1,
                    zmin: 0,
                    zmax: jStat.max(sample_order.map(x => temp_z[x]).map(x => sample_level_options[sample_annotations[i].column].indexOf(x)))
                }
            }


            var sample_tree_ratio = 1 - (sample_tree_height / layout.height) //!!!

            //var height_of_cell = (sample_tree_ratio*ctrl.parameters.height)/dta.length
            var height_of_sample_annotation = sample_annotation_height
            var mid_yrang_from = Array.apply(null, { length: sample_annotations.length }).map(Function.call, Number).map(x => x + 1).reverse().map(x => x * height_of_sample_annotation).map(x => layout.height * sample_tree_ratio - x).map(x => x / layout.height)


            var yrange_from = [0].concat(mid_yrang_from).concat([sample_tree_ratio])
            var yrange_to = mid_yrang_from.concat([sample_tree_ratio, 1])


            compound_annotation_traces = []
            for (var i = 0; i < compound_annotations.length; i++) {
                var temp_z = unpack(f, compound_annotations[i].column)
                var temp_color_scale = []
                for (var j = 0; j < compound_level_options[compound_annotations[i].column].length; j++) {
                    if ((compound_level_options[compound_annotations[i].column].length - 1) === 0) {
                        temp_color_scale[j] = [0, compound_annotations[i].colors[j]]
                        temp_color_scale[j + 1] = [1, compound_annotations[i].colors[j]]
                    } else {
                        temp_color_scale[j] = [j / (compound_level_options[compound_annotations[i].column].length - 1), compound_annotations[i].colors[j]]
                    }

                }
                compound_annotation_traces[i] = {
                    x: [0],
                    //y:Array.apply(0, Array(heatmap_x.length)).map(function() { return 0; }),
                    y: heatmap_y,
                    z: compound_order.map(x => temp_z[x]).map(x => [compound_level_options[compound_annotations[i].column].indexOf(x)]),
                    type: "heatmap",
                    showscale: false,
                    colorscale: temp_color_scale,
                    autocolorscale: false,
                    showlegend: false,
                    xaxis: "x" + (i + 4 + sample_annotations.length),
                    yaxis: "y" + (i + 4 + sample_annotations.length),
                    hoverinfo: "text",
                    name: "",
                    xgap: 1,
                    ygap: 1,
                    zmin: 0,
                    zmax: jStat.max(compound_order.map(x => temp_z[x]).map(x => compound_level_options[compound_annotations[i].column].indexOf(x)))
                }
            }

            var compound_tree_ratio = 1 - (compound_tree_height / layout.width)

            //var height_of_cell = (compound_tree_ratio*ctrl.parameters.height)/dta.length
            var height_of_compound_annotation = compound_annotation_height
            var mid_xrang_from = Array.apply(null, { length: compound_annotations.length }).map(Function.call, Number).map(x => x + 1).reverse().map(x => x * height_of_compound_annotation).map(x => layout.width * compound_tree_ratio - x).map(x => x / layout.width)

            var xrange_from = [0].concat(mid_xrang_from).concat([compound_tree_ratio])
            var xrange_to = mid_xrang_from.concat([compound_tree_ratio,1])

            //!!! layout
            data = [heatmap_trace]
            if(show_sample_dendrogram){
                data = data.concat(sample_dendro_trace)
            }
            if(show_compound_dendrogram){
                data = data.concat(compound_dendro_trace)
            }
            data = data.concat(sample_annotation_traces).concat(compound_annotation_traces)


            Plotly.newPlot(plot_id, data, layout, { editable: false })


                .then(gd => {
                    heatmap_plot_gd = gd
                    // Note: cache should not be re-used by repeated calls to JSON.stringify.
                    var cache = [];
                    fullLayout = JSON.stringify(heatmap_plot_gd._fullLayout, function (key, value) {
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
                    fullData = JSON.stringify(heatmap_plot_gd._fullData, function (key, value) {
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

                    heatmap_plot_parameters = {
                        full_data: JSON.parse(fullData),
                        full_layout: JSON.parse(fullLayout),
                        data: heatmap_plot_gd.data,
                        layout: heatmap_plot_gd.layout,

                    }

                    /*if ($("#heatmap_plot_traces_color_by_info").is(":checked")) {
                        heatmap_plot_parameters.heatmap_plot_color_levels = $("#heatmap_plot_color_levels").val()
                    }
                    if ($("#heatmap_plot_traces_shape_by_info").is(":checked")) {
                        heatmap_plot_parameters.heatmap_plot_shape_levels = $("#heatmap_plot_shape_levels").val()
                    }
                    if ($("#heatmap_plot_traces_size_by_info").is(":checked")) {
                        heatmap_plot_parameters.heatmap_plot_size_levels = $("#heatmap_plot_size_levels").val()
                    }*/




                    // here click to add annotations.
                    /*console.log(gd)
                    gd.on('plotly_clickannotation', (x) => {
                        console.log(x)
                        console.log('annotation clicked !!!');
                    })*/
                    Plotly.toImage(gd, { format: 'svg' })
                        .then(
                            function (url) {
                                console.log("!!")
                                scree_plot_url = url
                                scree_plot_url2 = scree_plot_url.replace(/^data:image\/svg\+xml,/, '');
                                scree_plot_url2 = decodeURIComponent(scree_plot_url2);
                                plot_url.heatmap_plot = btoa(unescape(encodeURIComponent(scree_plot_url2)))
                                files_sources[2] = plot_url.heatmap_plot
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
                                    plot_url.heatmap_plot = base64
                                };
                                image.src = imgsrc*/
                            }
                        )



                });
        }
        gather_page_information_to_heatmap_plot = function () {
            

            x = unpack(obj_score_loading_plot.sample_scores, "PC" + $("#heatmap_plot_pcx").val())
            y = unpack(obj_score_loading_plot.sample_scores, "PC" + $("#heatmap_plot_pcy").val())


            if (!$("#heatmap_plot_traces_color_by_info").is(":checked")) {
                heatmap_plot_color_values = [$("#heatmap_plot_color_option").spectrum("get").toRgbString()]
                heatmap_plot_color_by = undefined
            } else {
                heatmap_plot_color_values = heatmap_plot_color_levels.map(function (x, i) {
                    return ($("#heatmap_plot_color_options" + i).spectrum("get").toRgbString())
                })
            }

            if (!$("#heatmap_plot_traces_shape_by_info").is(":checked")) {
                heatmap_plot_shape_values = [$("#heatmap_plot_shape_option .selectpicker").val()]
                heatmap_plot_shape_by = undefined
            } else {
                heatmap_plot_shape_values = heatmap_plot_shape_levels.map(function (x, i) {
                    return ($("#heatmap_plot_shape_options" + i + " .selectpicker").val())
                })
            }


            if (!$("#heatmap_plot_traces_size_by_info").is(":checked")) {
                heatmap_plot_size_values = [$("#heatmap_plot_size_option").val()]
                heatmap_plot_size_by = undefined
            } else {
                heatmap_plot_size_values = heatmap_plot_size_levels.map(function (x, i) {
                    return ($("#heatmap_plot_size_options" + i).val())
                })
            }
            if ($("#heatmap_plot_confidence_ellipse").is(":checked")) {
                heatmap_plot_ellipse_group = ['color']
            } else {
                heatmap_plot_ellipse_group = 'no_ellipse'
            }

            heatmap_plot_labels = unpack(obj_score_loading_plot.p, "label")
            $("#heatmap_plot_layout_xaxis_title_text").val("PC" + $("#heatmap_plot_pcx").val() + " (" + (obj_score_loading_plot.variance[$("#heatmap_plot_pcx").val() - 1] * 100).toFixed(2) + "%)")
            $("#heatmap_plot_layout_yaxis_title_text").val("PC" + $("#heatmap_plot_pcy").val() + " (" + (obj_score_loading_plot.variance[$("#heatmap_plot_pcy").val() - 1] * 100).toFixed(2) + "%)")




            $.getScript("js/plot_layout_adjuster3.js", function (plot_layout_adjuster3) {
                adjusted_heatmap_plot_layout_adjuster3 = plot_layout_adjuster3.replaceAll("PLOT_NAME", "heatmap_plot")
                console.log(adjusted_heatmap_plot_layout_adjuster3) // THIS console log is neccessary.
                eval(adjusted_heatmap_plot_layout_adjuster3)
                save_heatmap_plot_style = function () {


                    if ($("#heatmap_plot_traces_color_by_info").is(':checked')) {
                        for (var i = 0; i < heatmap_plot_color_levels.length; i++) {
                            heatmap_plot_layout.traces.scatter_colors[heatmap_plot_color_levels.length][i] = $("#heatmap_plot_color_options" + i).spectrum("get").toRgbString()
                        }
                    } else {
                        heatmap_plot_layout.traces.scatter_colors[1] = $("#heatmap_plot_color_option").spectrum("get").toRgbString()
                    }

                    if ($("#heatmap_plot_traces_shape_by_info").is(':checked')) {
                        for (var i = 0; i < heatmap_plot_shape_levels.length; i++) {
                            heatmap_plot_layout.traces.scatter_shapes[heatmap_plot_shape_levels.length][i] = $("#heatmap_plot_shape_options" + i + " .selectpicker").val()
                        }
                    } else {
                        heatmap_plot_layout.traces.scatter_shapes[1] = $("#heatmap_plot_shape_option .selectpicker").val()
                    }


                    if ($("#heatmap_plot_traces_size_by_info").is(':checked')) {
                        for (var i = 0; i < heatmap_plot_size_levels.length; i++) {
                            heatmap_plot_layout.traces.scatter_sizes[heatmap_plot_size_levels.length][i] = $("#heatmap_plot_size_options" + i).val()
                        }
                    } else {
                        heatmap_plot_layout.traces.scatter_sizes[1] = $("#heatmap_plot_size_option").val()
                    }

                    $.getScript("js/plot_layout_adjuster4.js", function (plot_layout_adjuster4) {
                        adjusted_heatmap_plot_layout_adjuster4 = plot_layout_adjuster4.replaceAll("PLOT_NAME", "heatmap_plot")
                        console.log(adjusted_heatmap_plot_layout_adjuster4)
                        eval(adjusted_heatmap_plot_layout_adjuster4)
                    })



                }

                heatmap_plot_fun({
                    x: x, y: y, color_by: heatmap_plot_color_by, color_values: heatmap_plot_color_values, color_levels: heatmap_plot_color_levels,
                    shape_by: heatmap_plot_shape_by, shape_values: heatmap_plot_shape_values, shape_levels: heatmap_plot_shape_levels,
                    size_by: heatmap_plot_size_by, size_values: heatmap_plot_size_values, size_levels: heatmap_plot_size_levels,
                    ellipse_group: heatmap_plot_ellipse_group,
                    labels: heatmap_plot_labels,
                    layout: heatmap_plot_layout,
                    plot_id: heatmap_plot_plot_id
                })

            })



            /*
                    o = {
                        x: x, y: y, color_by: heatmap_plot_color_by, color_values: heatmap_plot_color_values, color_levels: heatmap_plot_color_levels,
                        shape_by: heatmap_plot_shape_by, shape_values: heatmap_plot_shape_values, shape_levels: heatmap_plot_shape_levels,
                        size_by: heatmap_plot_size_by, size_values: heatmap_plot_size_values, size_levels: heatmap_plot_size_levels,
                        ellipse_group: heatmap_plot_ellipse_group,
                        labels: heatmap_plot_labels,
                        layout: heatmap_plot_layout,
                        plot_id: heatmap_plot_plot_id
                    }
            
                    for(var i=0; i<Object.keys(o).length; i++){
                        window[Object.keys(o)[i]] = Object.values(o)[i]
                    }
              */


        }



        /*p_column_names = Object.keys(obj_score_loading_plot.p[0])
        p_column_unique = p_column_names.map(x => unpack(obj_score_loading_plot.p, x))
        p_column_unique_length = p_column_unique.map(x => x.filter(unique).length)

        heatmap_plot_color_levels_div = '<div class="form-group" style="margin:0;border:0;padding:0"><select class="form-control selectpicker" id="heatmap_plot_color_levels" data-style="btn btn-link">'
        for (var i = 0; i < p_column_names.length; i++) {
            if (p_column_names[i] !== 'label') {
                heatmap_plot_color_levels_div = heatmap_plot_color_levels_div + '<option>' + p_column_names[i] + '</option>'
            }
        }
        heatmap_plot_color_levels_div = heatmap_plot_color_levels_div + '</select></div>'
        $("#heatmap_plot_color_levels_div").html(heatmap_plot_color_levels_div)
        heatmap_plot_color_levels_change = function () {
            heatmap_plot_color_by = unpack(obj_score_loading_plot.p, $("#heatmap_plot_color_levels").val())
            heatmap_plot_color_levels = heatmap_plot_color_by.filter(unique)
            heatmap_plot_color_options_div = ""
            for (var i = 0; i < heatmap_plot_color_levels.length; i++) {
                heatmap_plot_color_options_div = heatmap_plot_color_options_div +
                    '<div class="input-group" id="heatmap_plot_color_options' + i + '_div">' +
                    '<div class="input-group-prepend"><span class="input-group-text">' + heatmap_plot_color_levels[i] +
                    '</span></div><input type="text" id="heatmap_plot_color_options' + i + '" class="spectrums" data-show-alpha="true" /></div>'
            }
            $("#heatmap_plot_color_options_div").html(heatmap_plot_color_options_div)

            for (var i = 0; i < heatmap_plot_color_levels.length; i++) {
                $("#heatmap_plot_color_options" + i).spectrum({
                    color: heatmap_plot_traces.scatter_colors[heatmap_plot_color_levels.length][i][0],
                    showPalette: true,
                    palette: color_pallete
                });
                $("#heatmap_plot_color_options" + i).change(gather_page_information_to_heatmap_plot)
            }

            setTimeout(gather_page_information_to_heatmap_plot, 500)

        }
        $("#heatmap_plot_color_levels").change(heatmap_plot_color_levels_change)

        heatmap_plot_traces_color_by_info_change = function () {
            if ($("#heatmap_plot_traces_color_by_info").is(':checked')) {
                $("#heatmap_plot_show_when_color_by_info").show()
                $("#heatmap_plot_hide_when_color_by_info").hide()
            } else {
                $("#heatmap_plot_show_when_color_by_info").hide()
                $("#heatmap_plot_hide_when_color_by_info").show()
            }
            heatmap_plot_color_levels_change();

        }
        $("#heatmap_plot_traces_color_by_info").change(heatmap_plot_traces_color_by_info_change)


        heatmap_plot_shape_levels_div = '<div class="form-group" style="margin:0;border:0;padding:0"><select class="form-control selectpicker" id="heatmap_plot_shape_levels" data-style="btn btn-link">'
        for (var i = 0; i < p_column_names.length; i++) {
            if (p_column_names[i] !== 'label') {
                heatmap_plot_shape_levels_div = heatmap_plot_shape_levels_div + '<option>' + p_column_names[i] + '</option>'
            }
        }
        heatmap_plot_shape_levels_div = heatmap_plot_shape_levels_div + '</select></div>'
        $("#heatmap_plot_shape_levels_div").html(heatmap_plot_shape_levels_div)
        heatmap_plot_shape_levels_change = function () {
            heatmap_plot_shape_by = unpack(obj_score_loading_plot.p, $("#heatmap_plot_shape_levels").val())
            heatmap_plot_shape_levels = heatmap_plot_shape_by.filter(unique)
            heatmap_plot_shape_options_div = ""
            for (var i = 0; i < heatmap_plot_shape_levels.length; i++) {
                heatmap_plot_shape_options_div = heatmap_plot_shape_options_div +
                    '<div class="form-group heatmap_plot_shapes" style="margin:0;border:0;padding:0" id="heatmap_plot_shape_options' + i + '">' +
                    '<label>' + heatmap_plot_shape_levels[i] + '</label><select class="form-control selectpicker" data-style="btn btn-link">' +
                    '<option>circle</option>' + '<option>square</option>' +
                    '</select></div>'
            }
            $("#heatmap_plot_shape_options_div").html(heatmap_plot_shape_options_div)


            for (var i = 0; i < heatmap_plot_shape_levels.length; i++) {
                $("#heatmap_plot_shape_options" + i + " .selectpicker").val(heatmap_plot_traces.scatter_shapes[heatmap_plot_shape_levels.length][i][0])
                $("#heatmap_plot_shape_options" + i + " .selectpicker").selectpicker('refresh')
                $("#heatmap_plot_shape_options" + i + " .selectpicker").change(gather_page_information_to_heatmap_plot)
            }



            init_selectpicker()
            setTimeout(gather_page_information_to_heatmap_plot, 500)
            $(".heatmap_plot_shapes").change(gather_page_information_to_heatmap_plot)



        }
        $("#heatmap_plot_shape_levels").change(heatmap_plot_shape_levels_change)

        heatmap_plot_traces_shape_by_info_change = function () {
            if ($("#heatmap_plot_traces_shape_by_info").is(':checked')) {
                $("#heatmap_plot_show_when_shape_by_info").show()
                $("#heatmap_plot_hide_when_shape_by_info").hide()
            } else {
                $("#heatmap_plot_show_when_shape_by_info").hide()
                $("#heatmap_plot_hide_when_shape_by_info").show()
            }
            heatmap_plot_shape_levels_change()
        }
        $("#heatmap_plot_traces_shape_by_info").change(heatmap_plot_traces_shape_by_info_change)

        heatmap_plot_size_levels_div = '<div class="form-group" style="margin:0;border:0;padding:0"><select class="form-control selectpicker" id="heatmap_plot_size_levels" data-style="btn btn-link">'
        for (var i = 0; i < p_column_names.length; i++) {
            if (p_column_names[i] !== 'label') {
                heatmap_plot_size_levels_div = heatmap_plot_size_levels_div + '<option>' + p_column_names[i] + '</option>'
            }
        }
        heatmap_plot_size_levels_div = heatmap_plot_size_levels_div + '</select></div>'
        $("#heatmap_plot_size_levels_div").html(heatmap_plot_size_levels_div)
        heatmap_plot_size_levels_change = function () {
            heatmap_plot_size_by = unpack(obj_score_loading_plot.p, $("#heatmap_plot_size_levels").val())
            heatmap_plot_size_levels = heatmap_plot_size_by.filter(unique)

            heatmap_plot_size_options_div = ''
            for (var i = 0; i < heatmap_plot_size_levels.length; i++) {
                heatmap_plot_size_options_div = heatmap_plot_size_options_div +
                    '<div class="input-group"><div class="input-group-prepend"><span class="input-group-text">' +
                    heatmap_plot_size_levels[i] + "</span></div>" +
                    '<input id="heatmap_plot_size_options' + i + '" type="number" class="form-control heatmap_plot_sizes" placeholder="Dot Size" min="0" step="1" value="15"></div>'
            }
            $("#heatmap_plot_size_options_div").html(heatmap_plot_size_options_div)



            for (var i = 0; i < heatmap_plot_size_levels.length; i++) {
                if (heatmap_plot_size_levels.length === 1) {
                    $("#heatmap_plot_size_options" + i).val(heatmap_plot_traces.scatter_sizes[heatmap_plot_size_levels.length][i])
                } else {
                    $("#heatmap_plot_size_options" + i).val(heatmap_plot_traces.scatter_sizes[heatmap_plot_size_levels.length][i][0])
                }

                $("#heatmap_plot_size_options" + i).change(gather_page_information_to_heatmap_plot)
            }




            setTimeout(gather_page_information_to_heatmap_plot, 500)
            $(".heatmap_plot_sizes").change(gather_page_information_to_heatmap_plot)
        }
        $("#heatmap_plot_size_levels").change(heatmap_plot_size_levels_change)

        heatmap_plot_traces_size_by_info_change = function () {
            if ($("#heatmap_plot_traces_size_by_info").is(':checked')) {
                $("#heatmap_plot_show_when_size_by_info").show()
                $("#heatmap_plot_hide_when_size_by_info").hide()
            } else {
                $("#heatmap_plot_show_when_size_by_info").hide()
                $("#heatmap_plot_hide_when_size_by_info").show()
            }
            heatmap_plot_size_levels_change()
        }
        $("#heatmap_plot_traces_size_by_info").change(heatmap_plot_traces_size_by_info_change)

        heatmap_plot_plot_id = "heatmap_plot"*/







    }, 'js')














}, 'html');







