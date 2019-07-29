



$.get("plot_layout_adjuster.html", function (plot_layout_adjuster_string) {
    $("#heatmap_plot_to_be_loaded").append($.parseHTML(plot_layout_adjuster_string.replaceAll("PLOT_NAME", "heatmap_plot")));

    $.getScript("js/plot_layout_adjuster1.js", function (plot_layout_adjuster1) {

        adjusted_heatmap_plot_layout_adjuster1 = plot_layout_adjuster1.replace(/PLOT_NAME/g, 'heatmap_plot')
        eval(adjusted_heatmap_plot_layout_adjuster1)

        // assign the default value for heatmap plot
        ocpu.call("get_heatmap_plot_style", {
            user_id: localStorage.user_id
        }, function (session) {
            session.getObject(function (heatmap_plot_obj) {
                console.log(heatmap_plot_obj)
                oo = heatmap_plot_obj
                heatmap_plot_traces = heatmap_plot_obj.traces
                p_column_names = Object.keys(obj_heatmap_plot.p[0])
                p_column_unique = {}
                p_column_unique_length = {}
                for (var i = 0; i < p_column_names.length; i++) {
                    p_column_unique[p_column_names[i]] = unpack(obj_heatmap_plot.p, p_column_names[i]).filter(unique)
                    p_column_unique_length[p_column_names[i]] = p_column_unique[p_column_names[i]].length
                    $('#heatmap_plot_order_sample_by').append($('<option>', {
                        value: p_column_names[i],
                        text: p_column_names[i]
                    }));
                    $("#heatmap_plot_order_sample_by").selectpicker('refresh')
                    $("#heatmap_plot_order_sample_by").change(function () {
                        heatmap_plot_order_sample_by_div = ""
                        order_sample_by = $("#heatmap_plot_order_sample_by").val()
                        if (order_sample_by.includes("as is")) {
                            heatmap_plot_order_sample_by_div = "<p>Sample Order is displayed <em>as is</em></p>"
                            $("#heatmap_plot_order_sample_levels_div").html(heatmap_plot_order_sample_by_div)
                        } else if (order_sample_by.includes("dendrogram")) {
                            heatmap_plot_order_sample_by_div = "<p>Sample Order is displayed <em>dendrogram</em></p>"
                            $("#heatmap_plot_order_sample_levels_div").html(heatmap_plot_order_sample_by_div)
                        } else {
                            for (var i = 0; i < order_sample_by.length; i++) {
                                heatmap_plot_order_sample_by_div = heatmap_plot_order_sample_by_div +
                                    '<div class="form-group">' +
                                    '<label for="order_sample_by_' + order_sample_by[i] + '">' + order_sample_by[i] + '</label>' +
                                    '<input type="text" class="form-control order_sample_levels" id="order_sample_by_' + order_sample_by[i] + '" aria-describedby="" placeholder="">' +
                                    '</div>'
                            }
                            $("#heatmap_plot_order_sample_levels_div").html(heatmap_plot_order_sample_by_div)
                            for (var i = 0; i < order_sample_by.length; i++) {
                                $("#order_sample_by_" + order_sample_by[i]).val(p_column_unique[order_sample_by[i]].join("||"))
                            }
                        }
                        debounced()
                    })
                    $('#heatmap_plot_sample_annotation').append($('<option>', {
                        value: p_column_names[i],
                        text: p_column_names[i]
                    }));
                    $("#heatmap_plot_sample_annotation").selectpicker('refresh')
                    $("#heatmap_plot_sample_annotation").change(function () {
                        heatmap_plot_sample_annotation_div = ""
                        sample_annotation = $("#heatmap_plot_sample_annotation").val()
                        for (var i = 0; i < sample_annotation.length; i++) {
                            heatmap_plot_sample_annotation_div = heatmap_plot_sample_annotation_div +
                                '<label>' + sample_annotation[i] + '</label>'
                            for (var j = 0; j < p_column_unique_length[sample_annotation[i]]; j++) {
                                heatmap_plot_sample_annotation_div = heatmap_plot_sample_annotation_div +
                                    '<div class="input-group">' +
                                    '<div class="input-group-prepend"><span class="input-group-text">' + p_column_unique[sample_annotation[i]][j] + '</span></div>' +
                                    '<input type="text" id="sample_annotation_' + p_column_unique[sample_annotation[i]][j] + '" class="spectrums sample_annotation sample_annotation_' + sample_annotation[i] + '" data-show-alpha="true" onchange="debounced()" />' + '</div>'
                            }
                        }
                        $("#heatmap_plot_sample_annotation_div").html(heatmap_plot_sample_annotation_div)
                        for (var i = 0; i < sample_annotation.length; i++) {
                            var temp_colors = heatmap_plot_traces.sample_annotation[p_column_unique_length[sample_annotation[i]]]
                            for (var j = 0; j < p_column_unique_length[sample_annotation[i]]; j++) {
                                $("[id='sample_annotation_" + p_column_unique[sample_annotation[i]][j] + "']").spectrum({
                                    color: temp_colors[j][0],
                                    showPalette: true,
                                    palette: color_pallete
                                });
                                $("[id='sample_annotation_" + p_column_unique[sample_annotation[i]][j] + "']").change(debounced)
                            }
                        }
                        debounced()
                    })

                }
                $("#sample_tree_height").val(heatmap_plot_traces.sample_tree_height)
                $("#sample_annotation_height").val(heatmap_plot_traces.sample_annotation_height)

                f_column_names = Object.keys(obj_heatmap_plot.f[0])
                f_column_unique = {}
                f_column_unique_length = {}
                for (var i = 0; i < f_column_names.length; i++) {
                    f_column_unique[f_column_names[i]] = unpack(obj_heatmap_plot.f, f_column_names[i]).filter(unique)
                    f_column_unique_length[f_column_names[i]] = f_column_unique[f_column_names[i]].length
                    $('#heatmap_plot_order_compound_by').append($('<option>', {
                        value: f_column_names[i],
                        text: f_column_names[i]
                    }));
                    $("#heatmap_plot_order_compound_by").selectpicker('refresh')
                    $("#heatmap_plot_order_compound_by").change(function () {
                        heatmap_plot_order_compound_by_div = ""
                        order_compound_by = $("#heatmap_plot_order_compound_by").val()
                        if (order_compound_by.includes("as is")) {
                            heatmap_plot_order_compound_by_div = "<p>Compound Order is displayed <em>as is</em></p>"
                            $("#heatmap_plot_order_compound_levels_div").html(heatmap_plot_order_compound_by_div)
                        } else if (order_compound_by.includes("dendrogram")) {
                            heatmap_plot_order_compound_by_div = "<p>Compound Order is displayed <em>dendrogram</em></p>"
                            $("#heatmap_plot_order_compound_levels_div").html(heatmap_plot_order_compound_by_div)
                        } else {
                            for (var i = 0; i < order_compound_by.length; i++) {
                                heatmap_plot_order_compound_by_div = heatmap_plot_order_compound_by_div +
                                    '<div class="form-group">' +
                                    '<label for="order_compound_by_' + order_compound_by[i] + '">' + order_compound_by[i] + '</label>' +
                                    '<input type="text" class="form-control order_compound_levels" id="order_compound_by_' + order_compound_by[i] + '" aria-describedby="" placeholder="">' +
                                    '</div>'
                            }
                            $("#heatmap_plot_order_compound_levels_div").html(heatmap_plot_order_compound_by_div)
                            for (var i = 0; i < order_compound_by.length; i++) {
                                $("#order_compound_by_" + order_compound_by[i]).val(f_column_unique[order_compound_by[i]].join("||"))
                            }
                        }
                        debounced()
                    })
                    $('#heatmap_plot_compound_annotation').append($('<option>', {
                        value: f_column_names[i],
                        text: f_column_names[i]
                    }));
                    $("#heatmap_plot_compound_annotation").selectpicker('refresh')
                    $("#heatmap_plot_compound_annotation").change(function () {
                        heatmap_plot_compound_annotation_div = ""
                        compound_annotation = $("#heatmap_plot_compound_annotation").val()
                        for (var i = 0; i < compound_annotation.length; i++) {
                            heatmap_plot_compound_annotation_div = heatmap_plot_compound_annotation_div +
                                '<label>' + compound_annotation[i] + '</label>'
                            for (var j = 0; j < f_column_unique_length[compound_annotation[i]]; j++) {
                                heatmap_plot_compound_annotation_div = heatmap_plot_compound_annotation_div +
                                    '<div class="input-group">' +
                                    '<div class="input-group-prepend"><span class="input-group-text">' + f_column_unique[compound_annotation[i]][j] + '</span></div>' +
                                    '<input type="text" id="compound_annotation_' + f_column_unique[compound_annotation[i]][j] + '" class="spectrums compound_annotation compound_annotation_' + compound_annotation[i] + '" data-show-alpha="true" onchange="debounced()" />' + '</div>'
                            }
                        }
                        $("#heatmap_plot_compound_annotation_div").html(heatmap_plot_compound_annotation_div)
                        for (var i = 0; i < compound_annotation.length; i++) {
                            var temp_colors = heatmap_plot_traces.compound_annotation[f_column_unique_length[compound_annotation[i]]]
                            for (var j = 0; j < f_column_unique_length[compound_annotation[i]]; j++) {
                                $("[id='compound_annotation_" + f_column_unique[compound_annotation[i]][j] + "']").spectrum({
                                    color: temp_colors[j][0],
                                    showPalette: true,
                                    palette: color_pallete
                                });
                                $("[id='compound_annotation_" + f_column_unique[compound_annotation[i]][j] + "']").change(debounced)
                            }
                        }
                    })
                }
                $("#compound_tree_height").val(heatmap_plot_traces.compound_tree_height)
                $("#compound_annotation_height").val(heatmap_plot_traces.compound_annotation_height)


                $.getScript("js/plot_layout_adjuster2.js", function (plot_layout_adjuster2) {
                    //adjusted_heatmap_plot_layout_adjuster2 = plot_layout_adjuster2.replaceAll("PLOT_NAME", "heatmap_plot")

                    adjusted_heatmap_plot_layout_adjuster2 = plot_layout_adjuster2.replace(/PLOT_NAME/g, 'heatmap_plot')

                    console.log(adjusted_heatmap_plot_layout_adjuster2) // THIS console log is neccessary. 
                    eval(adjusted_heatmap_plot_layout_adjuster2)
                    /*$("#heatmap_plot_layout_yaxis_title_text").val("PC" + $("#heatmap_plot_pcy").val() + " (" + (obj_score_loading_plot.variance[$("#heatmap_plot_pcy").val() - 1] * 100).toFixed(2) + "%)")
                    $("#heatmap_plot_layout_yaxis_title_text").val("PC" + $("#heatmap_plot_pcy").val() + " (" + (obj_score_loading_plot.variance[$("#heatmap_plot_pcy").val() - 1] * 100).toFixed(2) + "%)")*/

                    /*$("#heatmap_plot_color_option").spectrum({
                        color: heatmap_plot_traces.scatter_colors[1][0],
                        showPalette: true,
                        palette: color_pallete
                    });
                    $("#heatmap_plot_color_option").change(debounced)

                    $("#heatmap_plot_shape_option .selectpicker").val(heatmap_plot_traces.scatter_shapes[1][0])
                    $("#heatmap_plot_shape_option .selectpicker").selectpicker('refresh')
                    $("#heatmap_plot_shape_option .selectpicker").change(debounced)

                    $("#heatmap_plot_size_option").val(heatmap_plot_traces.scatter_sizes[1][0])
                    $("#heatmap_plot_size_option").change(debounced)

                    if (p_column_unique_length.some(function (x) { return (x > 1 && x < 6) })) {
                        for (var i = 0; i < p_column_unique_length.length; i++) {
                            if (p_column_unique_length[i] > 1 && p_column_unique_length[i] < 6) {
                                $("#heatmap_plot_color_levels").val(p_column_names[i])
                                $("#heatmap_plot_color_levels").selectpicker('refresh')
                                $("#heatmap_plot_traces_color_by_info").prop("checked", true).change();
                                for (var j = 0; j < p_column_unique_length[i]; j++) {
                                    $("#heatmap_plot_color_options" + j).spectrum("set", heatmap_plot_traces.scatter_colors[p_column_unique_length[i]][j][0]);
                                }
                                debounced()
                                break;
                            }
                        }
                    }*/
                    debounced()
                })

            })
        }).fail(function (e2) {
            Swal.fire('Oops...', e2.responseText, 'error')
        })

        heatmap_plot_fun = function ({
            heatmap_x = undefined, heatmap_y = undefined, heatmap_z = undefined, sample_label = undefined, heatmap_x_text = undefined, heatmap_y_text = undefined, tickvals = undefined,
            colorscale = undefined,
            show_sample_dendrogram = undefined, sample_dendro_trace_x = undefined,
            show_compound_dendrogram = undefined, compound_dendro_trace_x = undefined,
            sample_annotations = undefined,
            sample_level_options = undefined, p = undefined, sample_order = undefined,
            sample_tree_height = undefined, sample_annotation_height = undefined, show_sample_label = undefined,
            compound_annotations = undefined,
            compound_level_options = undefined, f = undefined, compound_order = undefined,
            compound_tree_height = undefined, compound_annotation_height = undefined, show_compound_label = undefined,
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
                    x: compound_dendro_trace_x,
                    y: compound_dendro_trace_y,
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
            var xrange_to = mid_xrang_from.concat([compound_tree_ratio, 1])

            //!!! layout
            layout.xaxis3 = {
                showgrid: false,
                zeroline: false,
                showline: false,
                autotick: true,
                ticks: '',
                showticklabels: false,
                domain: [xrange_from[xrange_from.length - 1], xrange_to[xrange_to.length - 1]]
            }
            layout.yaxis3 = {
                autorange: false,
                range: [0.25, jStat.max(heatmap_y) + 1.5],
                showgrid: false,
                zeroline: false,
                showline: false,
                autotick: true,
                ticks: '',
                showticklabels: false,
                domain: [yrange_from[0], yrange_to[0]]
            }

            layout.xaxis2 = {
                autorange: false,
                range: [0.5, jStat.max(heatmap_x) + 1.5],
                showgrid: false,
                zeroline: false,
                showline: false,
                autotick: true,
                ticks: '',
                showticklabels: false,
                domain: [xrange_from[0], xrange_to[0]]
            }

            layout.yaxis2 = {
                autorange: true,
                showgrid: false,
                zeroline: false,
                showline: false,
                autotick: true,
                ticks: '',
                showticklabels: false,
                domain: [yrange_from[yrange_from.length - 1], yrange_to[yrange_to.length - 1]]
            }

            layout.xaxis.range = [-0.5, jStat.max(heatmap_x) + 0.5]
            layout.xaxis.domain = [xrange_from[0], xrange_to[0]]
            layout.xaxis.tickvals = heatmap_x
            layout.xaxis.ticktext = heatmap_x_text
            layout.xaxis.ticklen = show_sample_label ? 5 : 0
            layout.xaxis.showticklabels = show_sample_label


            layout.yaxis.domain = [yrange_from[0], yrange_to[0]]
            layout.yaxis.tickvals = heatmap_y
            layout.yaxis.ticktext = heatmap_y_text
            layout.yaxis.ticklen = show_compound_label ? 5 : 0
            layout.yaxis.showticklabels = show_compound_label




            //sample_annotation_layout = {}
            for (var i = 0; i < sample_annotations.length; i++) {
                layout["xaxis" + (i + 4)] = {
                    autorange: false,
                    range: [-0.5, jStat.max(heatmap_x) + 0.5],
                    type: "linear",
                    tickmode: "array",
                    domain: [xrange_from[0], xrange_to[0]],
                    ticklen: 0,
                    showticklabels: false,
                    showline: false,
                    showgrid: false,
                    zeroline: false,
                    title: ""
                }
                layout["yaxis" + (i + 4)] = {
                    autorange: false,
                    range: [-0.5, 0],
                    type: "linear",
                    tickmode: "array",
                    domain: [yrange_from[i + 1], yrange_to[i + 1]],
                    ticklen: 0,
                    tickvals: [-0.25],
                    ticktext: [sample_annotations[i].column],
                    showline: false,
                    showgrid: false,
                    zeroline: false,
                    title: ""
                }
            }
            //compound_annotation_layout = {}
            for (var i = 0; i < compound_annotations.length; i++) {
                layout["xaxis" + (i + 4 + sample_annotations.length)] = {
                    autorange: false,
                    range: [-0.5, 0],
                    type: "linear",
                    tickmode: "array",
                    domain: [xrange_from[i + 1], xrange_to[i + 1]],
                    ticklen: 0,
                    tickvals: [-0.25],
                    ticktext: [compound_annotations[i].column],
                    tickangle: 90,
                    showline: false,
                    showgrid: false,
                    zeroline: false,
                    title: ""
                }
                layout["yaxis" + (i + 4 + sample_annotations.length)] = {
                    autorange: true,
                    //range:[0.25,jStat.max(heatmap_y)+1.5],
                    type: "linear",
                    tickmode: "array",
                    domain: [yrange_from[0], yrange_to[0]],
                    ticklen: 0,
                    showticklabels: false,
                    showline: false,
                    showgrid: false,
                    zeroline: false,
                    title: ""
                }
            }




            data = [heatmap_trace]
            if (show_sample_dendrogram) {
                data = data.concat(sample_dendro_trace)
            }
            if (show_compound_dendrogram) {
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



            $.getScript("js/plot_layout_adjuster3.js", function (plot_layout_adjuster3) {
                adjusted_heatmap_plot_layout_adjuster3 = plot_layout_adjuster3.replace(/PLOT_NAME/g, 'heatmap_plot')
                console.log(adjusted_heatmap_plot_layout_adjuster3)
                eval(adjusted_heatmap_plot_layout_adjuster3)
                save_heatmap_plot_style = function () {





                    $.getScript("js/plot_layout_adjuster4.js", function (plot_layout_adjuster4) {
                        adjusted_heatmap_plot_layout_adjuster4 = plot_layout_adjuster4.replace(/PLOT_NAME/g, 'heatmap_plot')
                        console.log(adjusted_heatmap_plot_layout_adjuster4)
                        eval(adjusted_heatmap_plot_layout_adjuster4)
                    })


                }
                order_sample_by = $("#heatmap_plot_order_sample_by").val()
                if (order_sample_by.includes("as is")) {
                    sample_order = sequence(from = 0, to = p.length - 1)
                    show_sample_dendrogram = false
                } else if (order_sample_by.includes('dendrogram')) {
                    sample_order = obj_heatmap_plot.hc_row_order
                    show_sample_dendrogram = true
                } else {
                    order_sample_levels = {}
                    $(".order_sample_levels").each(function () {
                        if (this.id !== '') {
                            order_sample_levels[this.id.replace("order_sample_by_", "")] = $(this).val()
                        }
                    })
                    var num_sample = p.length
                    var keys = Object.keys(order_sample_levels)
                    var values = Object.values(order_sample_levels)
                    var num_order = Array(num_sample).fill(0)
                    for (var i = 0; i < keys.length; i++) {
                        var levels = unpack(p, keys[i])
                        var ordered_levels = values[i].split("||")
                        for (var j = 0; j < ordered_levels.length; j++) {
                            var target_index = getAllIndexes(levels, ordered_levels[j])
                            for (var k = 0; k < target_index.length; k++) {
                                num_order[target_index[k]] = num_order[target_index[k]] + j
                            }
                        }
                        num_order = num_order.map(x => x * (keys.length - i) * 1000)
                    }
                    num_order = num_order.map((x, i) => x + i / num_sample)
                    var ordered_num_order = sort(num_order)
                    sample_order = ordered_num_order.map(x => num_order.indexOf(x))
                    show_sample_dendrogram = false
                }


                // !!!order_compound_by = $("#heatmap_plot_order_compound_by").val() 
                order_compound_by = "dendrogram"
                if (order_compound_by.includes('as is')) {
                    compound_order = sequence(from = 0, to = f.length - 1)
                    show_compound_dendrogram = false
                } else if (order_compound_by.includes('dendrogram')) {
                    compound_order = obj_heatmap_plot.hc_col_order
                    show_compound_dendrogram = true
                } else { // !!!
                    var num_compound = f.length
                    var keys = Object.keys(order_compound_levels)
                    var values = Object.values(order_compound_levels)
                    var num_order = Array(num_compound).fill(0)
                    for (var i = 0; i < keys.length; i++) {
                        var levels = unpack(f, keys[i])
                        var ordered_levels = values[i].split("||")
                        for (var j = 0; j < ordered_levels.length; j++) {
                            var target_index = getAllIndexes(levels, ordered_levels[j])
                            for (var k = 0; k < target_index.length; k++) {
                                num_order[target_index[k]] = num_order[target_index[k]] + j
                            }
                        }
                        num_order = num_order.map(x => x * (keys.length - i) * 1000)
                    }
                    num_order = num_order.map((x, i) => x + i / num_compound)
                    var ordered_num_order = sort(num_order)
                    compound_order = ordered_num_order.map(x => num_order.indexOf(x))
                    show_compound_dendrogram = false
                }
                dta = obj_heatmap_plot.temp_data
                var heatmap_z = compound_order.map(x => dta[x]).map(x => sample_order.map(y => x[y]))
                var sample_label = unpack(p, "label")
                var compound_label = unpack(f, "label")

                var heatmap_x = Array.apply(null, { length: dta[0].length }).map(Number.call, Number)
                var heatmap_y = Array.apply(null, { length: dta.length }).map(Number.call, Number)
                var heatmap_x_text = sample_order.map(x => sample_label[x])
                var heatmap_y_text = compound_order.map(x => compound_label[x])
                var tickvals = [obj_heatmap_plot.min[0], obj_heatmap_plot.median[0], obj_heatmap_plot.max[0]]

                sample_dendro_trace_x = obj_heatmap_plot.sx
                sample_dendro_trace_y = obj_heatmap_plot.sy
                compound_dendro_trace_x = obj_heatmap_plot.cx
                compound_dendro_trace_y = obj_heatmap_plot.cy

                sample_annotations = []
                for (var i = 0; i < $("#heatmap_plot_sample_annotation").val().length; i++) {
                    var temp_object = {
                        colors: [],
                        column: sample_annotation[i],
                        type: 'character'
                    }
                    $(".sample_annotation_" + sample_annotation[i].replaceAll(" ", ".")).each(function () {
                        temp_object.colors.push($("[id='" + this.id + "']").spectrum("get").toRgbString())
                    })
                    sample_annotations.push(temp_object)
                }
                sample_level_options = p_column_unique

                var sample_tree_height = $("#sample_tree_height").val()

                var sample_annotation_height = $("#sample_annotation_height").val()

                compound_annotations = []
                for (var i = 0; i < $("#heatmap_plot_compound_annotation").val().length; i++) {
                    var temp_object = {
                        colors: [],
                        column: compound_annotation[i],
                        type: 'character'
                    }
                    $(".compound_annotation_" + compound_annotation[i].replaceAll(" ", ".")).each(function () {
                        temp_object.colors.push($("[id='" + this.id + "']").spectrum("get").toRgbString())
                    })
                    compound_annotations.push(temp_object)
                }
                compound_level_options = f_column_unique

                var compound_tree_height = $("#compound_tree_height").val()

                var compound_annotation_height = $("#compound_annotation_height").val()



                var colorscale = $("#colorscale").val()
                var layout = heatmap_plot_layout
                var plot_id = "heatmap_plot"

                show_sample_label = $("#show_sample_label").is(':checked')
                show_compound_label = $("#show_compound_label").is(':checked')
                heatmap_plot_fun({
                    heatmap_x: heatmap_x, heatmap_y: heatmap_y, heatmap_z: heatmap_z, sample_label: sample_label, heatmap_x_text: heatmap_x_text, heatmap_y_text: heatmap_y_text, tickvals: tickvals,
                    colorscale: colorscale,
                    show_sample_dendrogram: show_sample_dendrogram, sample_dendro_trace_x: sample_dendro_trace_x,
                    show_compound_dendrogram: show_compound_dendrogram, compound_dendro_trace_x: compound_dendro_trace_x,
                    sample_annotations: sample_annotations,
                    sample_level_options: sample_level_options, p: p, sample_order: sample_order,
                    sample_tree_height: sample_tree_height, sample_annotation_height: sample_annotation_height, show_sample_label: show_sample_label,
                    compound_annotations: compound_annotations,
                    compound_level_options: compound_level_options, f: f, compound_order: compound_order,
                    compound_tree_height: compound_tree_height, compound_annotation_height: compound_annotation_height, show_compound_label: show_compound_label,
                    layout: layout, plot_id: plot_id
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
        var debounced = _.debounce(gather_page_information_to_heatmap_plot, 250, { 'maxWait': 1000 });
    }, 'js')
}, 'html');







