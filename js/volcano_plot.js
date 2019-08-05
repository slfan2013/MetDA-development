



$.get("plot_layout_adjuster.html", function (plot_layout_adjuster_string) {
    $("#volcano_plot_to_be_loaded").append($.parseHTML(plot_layout_adjuster_string.replaceAll("PLOT_NAME", "volcano_plot")));

    $.getScript("js/plot_layout_adjuster1.js", function (plot_layout_adjuster1) {

        adjusted_volcano_plot_layout_adjuster1 = plot_layout_adjuster1.replace(/PLOT_NAME/g, 'volcano_plot')
        eval(adjusted_volcano_plot_layout_adjuster1)

        // assign the default value for volcano plot
        ocpu.call("get_volcano_plot_style", {
            user_id: localStorage.user_id
        }, function (session) {
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
                        color: volcano_plot_obj.traces.colors.sig_pos[0],
                        showPalette: true,
                        palette: color_pallete
                    })
                    $("#sig_pos_size").val(volcano_plot_obj.traces.sizes.sig_pos)
                    $("#sig_pos_shape").val(volcano_plot_obj.traces.shapes.sig_pos)
                    $("#sig_pos_shape").selectpicker('refresh')

                    $("#sig_neg").spectrum({
                        color: volcano_plot_obj.traces.colors.sig_neg[0],
                        showPalette: true,
                        palette: color_pallete
                    })
                    $("#sig_neg_size").val(volcano_plot_obj.traces.sizes.sig_neg)
                    $("#sig_neg_shape").val(volcano_plot_obj.traces.shapes.sig_neg)
                    $("#sig_neg_shape").selectpicker('refresh')

                    $("#sig_not_pos_neg").spectrum({
                        color: volcano_plot_obj.traces.colors.sig_not_pos_neg[0],
                        showPalette: true,
                        palette: color_pallete
                    })
                    $("#sig_not_pos_neg_size").val(volcano_plot_obj.traces.sizes.sig_not_pos_neg)
                    $("#sig_not_pos_neg_shape").val(volcano_plot_obj.traces.shapes.sig_not_pos_neg)
                    $("#sig_not_pos_neg_shape").selectpicker('refresh')

                    $("#not_sig_pos").spectrum({
                        color: volcano_plot_obj.traces.colors.not_sig_pos[0],
                        showPalette: true,
                        palette: color_pallete
                    })
                    $("#not_sig_pos_size").val(volcano_plot_obj.traces.sizes.not_sig_pos)
                    $("#not_sig_pos_shape").val(volcano_plot_obj.traces.shapes.not_sig_pos)
                    $("#not_sig_pos_shape").selectpicker('refresh')




                    $("#not_sig_neg").spectrum({
                        color: volcano_plot_obj.traces.colors.not_sig_neg[0],
                        showPalette: true,
                        palette: color_pallete
                    })
                    $("#not_sig_neg_size").val(volcano_plot_obj.traces.sizes.not_sig_neg)
                    $("#not_sig_neg_shape").val(volcano_plot_obj.traces.shapes.not_sig_neg)
                    $("#not_sig_neg_shape").selectpicker('refresh')

                    $("#not_sig_not_pos_neg").spectrum({
                        color: volcano_plot_obj.traces.colors.not_sig_not_pos_neg[0],
                        showPalette: true,
                        palette: color_pallete
                    })
                    $("#not_sig_not_pos_neg_size").val(volcano_plot_obj.traces.sizes.not_sig_not_pos_neg)
                    $("#not_sig_not_pos_neg_shape").val(volcano_plot_obj.traces.shapes.not_sig_not_pos_neg)
                    $("#not_sig_not_pos_neg_shape").selectpicker('refresh')




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
                    

                    volcano_plot_layout.traces.colors.sig_pos[0] = $("#sig_pos").spectrum("get").toRgbString()
                    volcano_plot_layout.traces.colors.sig_neg[0] = $("#sig_neg").spectrum("get").toRgbString()
                    volcano_plot_layout.traces.colors.sig_not_pos_neg[0] = $("#sig_not_pos_neg").spectrum("get").toRgbString()
                    volcano_plot_layout.traces.colors.not_sig_pos[0] = $("#not_sig_pos").spectrum("get").toRgbString()
                    volcano_plot_layout.traces.colors.not_sig_neg[0] = $("#not_sig_neg").spectrum("get").toRgbString()
                    volcano_plot_layout.traces.colors.not_sig_not_pos_neg[0] = $("#not_sig_not_pos_neg").spectrum("get").toRgbString()


                    volcano_plot_layout.traces.sizes.sig_pos = $("#sig_pos_size").val()
                    volcano_plot_layout.traces.sizes.sig_neg = $("#sig_neg_size").val()
                    volcano_plot_layout.traces.sizes.sig_not_pos_neg = $("#sig_not_pos_neg_size").val()
                    volcano_plot_layout.traces.sizes.not_sig_pos = $("#not_sig_pos_size").val()
                    volcano_plot_layout.traces.sizes.not_sig_neg = $("#not_sig_neg_size").val()
                    volcano_plot_layout.traces.sizes.not_sig_not_pos_neg = $("#not_sig_not_pos_neg_size").val()


                    
                    volcano_plot_layout.traces.shapes.sig_pos = $("#sig_pos_shape").val()
                    volcano_plot_layout.traces.shapes.sig_neg = $("#sig_neg_shape").val()
                    volcano_plot_layout.traces.shapes.sig_not_pos_neg = $("#sig_not_pos_neg_shape").val()
                    volcano_plot_layout.traces.shapes.not_sig_pos = $("#not_sig_pos_shape").val()
                    volcano_plot_layout.traces.shapes.not_sig_neg = $("#not_sig_neg_shape").val()
                    volcano_plot_layout.traces.shapes.not_sig_not_pos_neg = $("#not_sig_not_pos_neg_shape").val()



            
                    $.getScript("js/plot_layout_adjuster4.js", function (plot_layout_adjuster4) {
                        adjusted_volcano_plot_layout_adjuster4 = plot_layout_adjuster4.replace(/PLOT_NAME/g, 'volcano_plot')
                        console.log(adjusted_volcano_plot_layout_adjuster4)
                        eval(adjusted_volcano_plot_layout_adjuster4)
                    })


                }
                
				
				
				
                var layout = volcano_plot_layout
                var plot_id = "volcano_plot"
                



                /*volcano_parameter = {
                    xs: xs, ys: ys, texts: texts, boxpoints: boxpoints, jitter: jitter, pointpos: pointpos, trace_names: trace_names, box_colors: box_colors,
                    symbol: symbol, whiskerwidth: whiskerwidth, notched: notched, notchwidth: notchwidth, boxmean: boxmean,
                    size: size, outliercolor: outliercolor, line_width: line_width, fillcolor_transparency: fillcolor_transparency, title: title, categoryarray: categoryarray,
                    layout: layout, plot_id: plot_id,quick_analysis:false
                }

                volcano_data_layout_generate = volcano_plot_fun(volcano_parameter)*/






            })
        }
        volcano_plot_debounced = _.debounce(gather_page_information_to_volcano_plot, 250, { 'maxWait': 1000 }); // this must be a global object.



    }, 'js')
}, 'html');







