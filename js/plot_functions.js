heatmap_plot_fun = function ({
    heatmap_x = undefined, heatmap_y = undefined, heatmap_z = undefined, sample_label = undefined, heatmap_x_text = undefined, heatmap_y_text = undefined, tickvals = undefined,
    colorscale = undefined,
    show_sample_dendrogram = undefined, sample_dendro_trace_x = undefined, sample_dendro_trace_y = undefined, order_sample_by = undefined,
    show_compound_dendrogram = undefined, compound_dendro_trace_x = undefined, compound_dendro_trace_y = undefined, order_compound_by = undefined,
    sample_annotations = undefined,
    sample_level_options = undefined, p = undefined, sample_order = undefined,
    sample_tree_height = undefined, sample_annotation_height = undefined, show_sample_label = undefined,
    compound_annotations = undefined,
    compound_level_options = undefined, f = undefined, compound_order = undefined,
    compound_tree_height = undefined, compound_annotation_height = undefined, show_compound_label = undefined,
    layout = undefined, plot_id = undefined, quick_analysis = false, quick_analysis_project_time = undefined, quick_analysis_plot_name = undefined } = {}
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
    lll = layout

    Plotly.newPlot(plot_id, data, layout, { editable: false })


        .then(gd => {
            heatmap_plot_gd = gd
            if (!quick_analysis) {
                // Note: cache should not be re-used by repeated calls to JSON.stringify.
                /*var cache = [];
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
                cache = null; // Enable garbage collection*/


                heatmap_plot_parameters = {
                    //full_data: JSON.parse(fullData),
                    //full_layout: JSON.parse(fullLayout),
                    data: heatmap_plot_gd.data,
                    layout: heatmap_plot_gd.layout,
                }

                heatmap_plot_parameters.sample_annotation = $("#heatmap_plot_sample_annotation").val()
                heatmap_plot_parameters.sample_annotations = sample_annotations
                heatmap_plot_parameters.compound_annotation = $("#heatmap_plot_compound_annotation").val()
                heatmap_plot_parameters.compound_annotations = compound_annotations

                heatmap_plot_parameters.order_sample_by = order_sample_by
                heatmap_plot_parameters.order_compound_by = order_compound_by

                if (typeof (order_sample_levels) === "undefined") {
                    order_sample_levels = ""
                }
                heatmap_plot_parameters.order_sample_levels = order_sample_levels
                if (typeof (order_compound_levels) == "undefined") {
                    order_compound_levels = ""
                }
                heatmap_plot_parameters.order_compound_levels = order_compound_levels

                heatmap_plot_parameters.show_sample_label = $("#show_sample_label").prop("checked")
                heatmap_plot_parameters.show_compound_label = $("#show_compound_label").prop("checked")


                heatmap_plot_parameters.colorscale = $("#colorscale").val()
                heatmap_plot_parameters.sample_tree_height = $("#sample_tree_height").val()
                heatmap_plot_parameters.sample_annotation_height = $("#sample_annotation_height").val()
                heatmap_plot_parameters.compound_tree_height = $("#compound_tree_height").val()
                heatmap_plot_parameters.compound_annotation_height = $("#compound_annotation_height").val()
            }

            /*
            
                                if ($("#score_plot_traces_color_by_info").is(":checked")) {
                                    score_plot_parameters.score_plot_color_levels = $("#score_plot_color_levels").val()
                                }
                                if ($("#score_plot_traces_shape_by_info").is(":checked")) {
                                    score_plot_parameters.score_plot_shape_levels = $("#score_plot_shape_levels").val()
                                }
                                if ($("#score_plot_traces_size_by_info").is(":checked")) {
                                    score_plot_parameters.score_plot_size_levels = $("#score_plot_size_levels").val()
                                }
            
            
            */




            Plotly.toImage(gd, { format: 'svg' })
                .then(
                    function (url) {
                        console.log("!!")
                        heatmap_plot_url = url
                        heatmap_plot_url2 = heatmap_plot_url.replace(/^data:image\/svg\+xml,/, '');
                        heatmap_plot_url2 = decodeURIComponent(heatmap_plot_url2);
                        if (!quick_analysis) {
                            plot_url.heatmap_plot = btoa(unescape(encodeURIComponent(heatmap_plot_url2)))
                            files_sources[2] = plot_url.heatmap_plot
                        } else {
                            plot_base64[quick_analysis_project_time][quick_analysis_plot_name] = btoa(unescape(encodeURIComponent(heatmap_plot_url2)))
                        }

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
