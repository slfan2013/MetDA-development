



$.get("plot_layout_adjuster.html", function (plot_layout_adjuster_string) {
    $("#ssize_plot_to_be_loaded").append($.parseHTML(plot_layout_adjuster_string.replaceAll("PLOT_NAME", "ssize_plot")));

    $.ajax({
        url: "js/plot_layout_adjuster1.js", converters: { 'text script': function (text) { return text; } }, success: function (plot_layout_adjuster1) {

            adjusted_ssize_plot_layout_adjuster1 = plot_layout_adjuster1.replace(/PLOT_NAME/g, 'ssize_plot')
            eval(adjusted_ssize_plot_layout_adjuster1)

            // assign the default value for ssize plot
            ocpu.call("call_fun", {
                parameter: {
                    user_id: localStorage.user_id,
                    fun_name: "get_ssize_plot_style"
                }
            }, function (session) {
                session.getObject(function (ssize_plot_obj) {
                    ssize_plot_obj_global = ssize_plot_obj
                    ssize_plot_traces = ssize_plot_obj.traces
                    p_column_names = Object.keys(obj_ssize_plot.p[0])
                    p_column_unique = {}
                    p_column_unique_length = {}


                    f_column_names = Object.keys(obj_ssize_plot.f[0])
                    f_column_unique = {}
                    f_column_unique_length = {}

                    // create inputs according to sample and compound information.



                    $.ajax({
                        url: "js/plot_layout_adjuster2.js", converters: { 'text script': function (text) { return text; } }, success: function (plot_layout_adjuster2) {
                            adjusted_ssize_plot_layout_adjuster2 = plot_layout_adjuster2.replace(/PLOT_NAME/g, 'ssize_plot')
                            //console.log(adjusted_ssize_plot_layout_adjuster2)
                            eval(adjusted_ssize_plot_layout_adjuster2)
                            // initialize the traces on HTML.

                            $("#ssize_plot_layout_title_text").val(obj_ssize_plot.n_title);
                            $("#ssize_plot_layout_yaxis_title_text").val(obj_ssize_plot.n_ylab);
                            $("#ssize_plot_layout_title_text").prop("disabled", true);
                            $("#ssize_plot_layout_yaxis_title_text").prop("disabled", true);
                            $("#sample_size_range").val(ssize_plot_obj.traces.sample_size_range)

                            ssize_plot_debounced()
                        }
                    })

                })
            }).fail(function (e2) {
                Swal.fire('Oops...', e2.responseText, 'error')
            })


            gather_page_information_to_ssize_plot = function () {


                $.ajax({
                    url: "js/plot_layout_adjuster3.js", converters: { 'text script': function (text) { return text; } }, success: function (plot_layout_adjuster3) {
                        var adjusted_ssize_plot_layout_adjuster3 = plot_layout_adjuster3.replace(/PLOT_NAME/g, 'ssize_plot')
                        console.log("REPLACED")
                        //console.log(adjusted_ssize_plot_layout_adjuster3)

                        console.log("EVALUATED")
                        eval(adjusted_ssize_plot_layout_adjuster3)

                        save_ssize_plot_style = function () {
                            // save the traces on HTML
                            ssize_plot_layout.traces.sample_size_range = $("#sample_size_range").val()
                            $.ajax({
                                url: "js/plot_layout_adjuster4.js", converters: { 'text script': function (text) { return text; } }, success: function (plot_layout_adjuster4) {
                                    adjusted_ssize_plot_layout_adjuster4 = plot_layout_adjuster4.replace(/PLOT_NAME/g, 'ssize_plot')
                                    console.log(adjusted_ssize_plot_layout_adjuster4)
                                    eval(adjusted_ssize_plot_layout_adjuster4)
                                }
                            })
                        }

                        // collect traces info for plot.



                        ssize_plot_layout.xaxis.autorange = false
                        ssize_plot_layout.xaxis.range = $("#sample_size_range").val().split("-")

                        console.log(ssize_plot_layout.xaxis.autorange)
                        var layout = ssize_plot_layout
                        var plot_id = "ssize_plot"
                        //obj_ssize_plot

                        var myPlot = document.getElementById(plot_id)
                        ssize_plot_data = [{
                            x: obj_ssize_plot.inv_n.x,
                            y: obj_ssize_plot.inv_n.y,
                            text: "",
                            type: 'scatter',
                            showlegend: false,
                            mode: 'lines'
                        }]


                        Plotly.newPlot(plot_id, ssize_plot_data, ssize_plot_layout).then(gd => {

                        });




                        /*ssize_plot_fun({
                            ssize_x: ssize_x, ssize_y: ssize_y, ssize_z: ssize_z, sample_label: sample_label, ssize_x_text: ssize_x_text, ssize_y_text: ssize_y_text, tickvals: tickvals,
                            colorscale: colorscale,
                            show_sample_dendrogram: show_sample_dendrogram, sample_dendro_trace_x: sample_dendro_trace_x, sample_dendro_trace_y: sample_dendro_trace_y,
                            show_compound_dendrogram: show_compound_dendrogram, compound_dendro_trace_x: compound_dendro_trace_x, compound_dendro_trace_y: compound_dendro_trace_y,
                            sample_annotations: sample_annotations, order_sample_by: order_sample_by, order_compound_by: order_compound_by,
                            sample_level_options: sample_level_options, p: p, sample_order: sample_order,
                            sample_tree_height: sample_tree_height, sample_annotation_height: sample_annotation_height, show_sample_label: show_sample_label,
                            compound_annotations: compound_annotations,
                            compound_level_options: compound_level_options, f: f, compound_order: compound_order,
                            compound_tree_height: compound_tree_height, compound_annotation_height: compound_annotation_height, show_compound_label: show_compound_label,
                            layout: layout, plot_id: plot_id
                        })*/



                    }
                })
            }
            ssize_plot_debounced = _.debounce(gather_page_information_to_ssize_plot, 250, { 'maxWait': 1000 }); // this must be a global object.



        }
    })
}, 'html');







