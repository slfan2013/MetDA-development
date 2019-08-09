



$.get("plot_layout_adjuster.html", function (plot_layout_adjuster_string) {
    $("#volcano_plot_to_be_loaded").append($.parseHTML(plot_layout_adjuster_string.replaceAll("PLOT_NAME", "volcano_plot")));

    $.getScript("js/plot_layout_adjuster1.js", function (plot_layout_adjuster1) {

        adjusted_volcano_plot_layout_adjuster1= plot_layout_adjuster1.replace(/PLOT_NAME/g, 'volcano_plot')
        eval(adjusted_volcano_plot_layout_adjuster1)

        // assign the default value for volcano plot
        ocpu.call("call_fun", {parameter:{
            user_id: localStorage.user_id,
            fun_name:"get_volcano_plot_style"
        }}, function (session) {
            session.getObject(function (volcano_plot_obj) {
                oo = volcano_plot_obj
                volcano_plot_traces = volcano_plot_obj.traces



                $.getScript("js/plot_layout_adjuster2.js", function (plot_layout_adjuster2) {
                    adjusted_volcano_plot_layout_adjuster2 = plot_layout_adjuster2.replace(/PLOT_NAME/g, 'volcano_plot')
                    //console.log(adjusted_volcano_plot_layout_adjuster2)
                    console.log("here")
                    eval(adjusted_volcano_plot_layout_adjuster2)
                    // initialize the traces on HTML.
                    console.log(volcano_plot_obj)
                    $("#fold_change_cut_off").val(volcano_plot_obj.traces.fold_change_cut_off)
                    $("#p_value_cut_off").val(volcano_plot_obj.traces.p_value_cut_off)

                    $("#sig_pos").spectrum({
                        color: volcano_plot_obj.traces.colors[0][0],
                        showPalette: true,
                        palette: color_pallete
                    })
                    $("#sig_pos_size").val(volcano_plot_obj.traces.sizes[0][0])
                    $("#sig_pos_shape").val(volcano_plot_obj.traces.shapes[0][0])
                    $("#sig_pos_shape").selectpicker('refresh')

                    $("#sig_neg").spectrum({
                        color: volcano_plot_obj.traces.colors[1][0],
                        showPalette: true,
                        palette: color_pallete
                    })
                    $("#sig_neg_size").val(volcano_plot_obj.traces.sizes[1][0])
                    $("#sig_neg_shape").val(volcano_plot_obj.traces.shapes[1][0])
                    $("#sig_neg_shape").selectpicker('refresh')

                    $("#sig_not_pos_neg").spectrum({
                        color: volcano_plot_obj.traces.colors[2][0],
                        showPalette: true,
                        palette: color_pallete
                    })
                    $("#sig_not_pos_neg_size").val(volcano_plot_obj.traces.sizes[2][0])
                    $("#sig_not_pos_neg_shape").val(volcano_plot_obj.traces.shapes[2][0])
                    $("#sig_not_pos_neg_shape").selectpicker('refresh')

                    $("#not_sig_pos").spectrum({
                        color: volcano_plot_obj.traces.colors[3][0],
                        showPalette: true,
                        palette: color_pallete
                    })
                    $("#not_sig_pos_size").val(volcano_plot_obj.traces.sizes[3][0])
                    $("#not_sig_pos_shape").val(volcano_plot_obj.traces.shapes[3][0])
                    $("#not_sig_pos_shape").selectpicker('refresh')




                    $("#not_sig_neg").spectrum({
                        color: volcano_plot_obj.traces.colors[4][0],
                        showPalette: true,
                        palette: color_pallete
                    })
                    $("#not_sig_neg_size").val(volcano_plot_obj.traces.sizes[4][0])
                    $("#not_sig_neg_shape").val(volcano_plot_obj.traces.shapes[4][0])
                    $("#not_sig_neg_shape").selectpicker('refresh')

                    $("#not_sig_not_pos_neg").spectrum({
                        color: volcano_plot_obj.traces.colors[5][0],
                        showPalette: true,
                        palette: color_pallete
                    })
                    $("#not_sig_not_pos_neg_size").val(volcano_plot_obj.traces.sizes[5][0])
                    $("#not_sig_not_pos_neg_shape").val(volcano_plot_obj.traces.shapes[5][0])
                    $("#not_sig_not_pos_neg_shape").selectpicker('refresh')



                    $("#significancy_line_color").spectrum({
                        color: volcano_plot_obj.traces.significancy_line_color[0],
                        showPalette: true,
                        palette: color_pallete
                    })
                    $("#significancy_line_width").val(volcano_plot_obj.traces.significancy_line_width[0])
                    $("#significancy_line_dash").val(volcano_plot_obj.traces.significancy_line_dash[0])
                    $("#significancy_line_dash").selectpicker('refresh')







                    volcano_plot_debounced()
                })

            })
        }).fail(function (e2) {
            Swal.fire('Oops...', e2.responseText, 'error')
        })


        gather_page_information_to_volcano_plot = function () {



            $.getScript("js/plot_layout_adjuster3.js", function (plot_layout_adjuster3) {
                console.log("!!")
                adjusted_volcano_plot_layout_adjuster3 = plot_layout_adjuster3.replace(/PLOT_NAME/g, 'volcano_plot')
                //console.log(adjusted_volcano_plot_layout_adjuster3)
                eval(adjusted_volcano_plot_layout_adjuster3)
                console.log($("#volcano_plot_plot_bgcolor").spectrum("get").toRgbString())
                save_volcano_plot_style = function () {

                    // save traces on HTML to the layout.


                    volcano_plot_layout.traces.fold_change_cut_off = $("#fold_change_cut_off").val()
                    volcano_plot_layout.traces.p_value_cut_off = $("#p_value_cut_off").val()


                    volcano_plot_layout.traces.colors[0] = $("#sig_pos").spectrum("get").toRgbString()
                    volcano_plot_layout.traces.colors[1] = $("#sig_neg").spectrum("get").toRgbString()
                    volcano_plot_layout.traces.colors[2] = $("#sig_not_pos_neg").spectrum("get").toRgbString()
                    volcano_plot_layout.traces.colors[3] = $("#not_sig_pos").spectrum("get").toRgbString()
                    volcano_plot_layout.traces.colors[4] = $("#not_sig_neg").spectrum("get").toRgbString()
                    volcano_plot_layout.traces.colors[5] = $("#not_sig_not_pos_neg").spectrum("get").toRgbString()


                    volcano_plot_layout.traces.sizes[0] = $("#sig_pos_size").val()
                    volcano_plot_layout.traces.sizes[1] = $("#sig_neg_size").val()
                    volcano_plot_layout.traces.sizes[2] = $("#sig_not_pos_neg_size").val()
                    volcano_plot_layout.traces.sizes[3] = $("#not_sig_pos_size").val()
                    volcano_plot_layout.traces.sizes[4] = $("#not_sig_neg_size").val()
                    volcano_plot_layout.traces.sizes[5] = $("#not_sig_not_pos_neg_size").val()



                    volcano_plot_layout.traces.shapes[0] = $("#sig_pos_shape").val()
                    volcano_plot_layout.traces.shapes[1] = $("#sig_neg_shape").val()
                    volcano_plot_layout.traces.shapes[2] = $("#sig_not_pos_neg_shape").val()
                    volcano_plot_layout.traces.shapes[3] = $("#not_sig_pos_shape").val()
                    volcano_plot_layout.traces.shapes[4] = $("#not_sig_neg_shape").val()
                    volcano_plot_layout.traces.shapes[5] = $("#not_sig_not_pos_neg_shape").val()


                    volcano_plot_layout.traces.significancy_line_color = $("#significancy_line_color").spectrum("get").toRgbString()
                    volcano_plot_layout.traces.significancy_line_width = $("#significancy_line_width").val()
                    volcano_plot_layout.traces.significancy_line_dash = $("#significancy_line_dash").val()

                    $.getScript("js/plot_layout_adjuster4.js", function (plot_layout_adjuster4) {
                        adjusted_volcano_plot_layout_adjuster4 = plot_layout_adjuster4.replace(/PLOT_NAME/g, 'volcano_plot')
                        console.log(adjusted_volcano_plot_layout_adjuster4)
                        eval(adjusted_volcano_plot_layout_adjuster4)
                    })


                }




                var layout = volcano_plot_layout
                var plot_id = "volcano_plot"



                var p_value_cut_off = $("#p_value_cut_off").val()
                var fold_change_cut_off = $("#fold_change_cut_off").val()
                var colors = [$("#sig_pos").spectrum("get").toRgbString(), $("#sig_neg").spectrum("get").toRgbString(), $("#sig_not_pos_neg").spectrum("get").toRgbString(), $("#not_sig_pos").spectrum("get").toRgbString(), $("#not_sig_neg").spectrum("get").toRgbString(), $("#not_sig_not_pos_neg").spectrum("get").toRgbString()]
                var shapes = [$("#sig_pos_shape").val(), $("#sig_neg_shape").val(), $("#sig_not_pos_neg_shape").val(), $("#not_sig_pos_shape").val(), $("#not_sig_neg_shape").val(), $("#not_sig_not_pos_neg_shape").val()]
                var sizes = [$("#sig_pos_size").val(), $("#sig_neg_size").val(), $("#sig_not_pos_neg_size").val(), $("#not_sig_pos_size").val(), $("#not_sig_neg_size").val(), $("#not_sig_not_pos_neg_size").val()]
                var significancy_line_color = $("#significancy_line_color").spectrum("get").toRgbString()
                var significancy_line_dash = $("#significancy_line_dash").val()
                var significancy_line_width = $("#significancy_line_width").val()



                plot_id = "volcano_plot"
                var layout = volcano_plot_layout
                var names = ["Significant + Positive", "Significant + Negative", "Significant but Small Fold Change", "Not Significant + Positive", "Not Significant + Positive", "Not Significant + Small Fold Change"]

                volcano_plot_fun({
                    p_values: obj_volcano_plot.p_values, label: obj_volcano_plot.label, fold_change: obj_volcano_plot.fold_change,
                    p_value_cut_off: p_value_cut_off, fold_change_cut_off: fold_change_cut_off,
                    colors: colors, shapes: shapes, sizes: sizes,
                    significancy_line_color: significancy_line_color, significancy_line_dash: significancy_line_dash, significancy_line_width: significancy_line_width,
                    names: names,
                    layout: layout, plot_id: plot_id
                })
            })
        }
        volcano_plot_debounced = _.debounce(gather_page_information_to_volcano_plot, 250, { 'maxWait': 1000 }); // this must be a global object.



    }, 'js')
}, 'html');







