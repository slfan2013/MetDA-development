



$.get("plot_layout_adjuster.html", function (plot_layout_adjuster_string) {
    $("#power_plot_to_be_loaded").append($.parseHTML(plot_layout_adjuster_string.replaceAll("PLOT_NAME", "power_plot")));

    $.ajax({
        url: "js/plot_layout_adjuster1.js", converters: { 'text script': function (text) { return text; } }, success: function (plot_layout_adjuster1) {

            adjusted_power_plot_layout_adjuster1 = plot_layout_adjuster1.replace(/PLOT_NAME/g, 'power_plot')
            eval(adjusted_power_plot_layout_adjuster1)

            // assign the default value for power plot
            ocpu.call("call_fun", {
                parameter: {
                    user_id: localStorage.user_id,
                    fun_name: "get_power_plot_style"
                }
            }, function (session) {
                session.getObject(function (power_plot_obj) {
                    power_plot_obj = prepare_layout(power_plot_obj)
                    power_plot_obj_global = power_plot_obj
                    power_plot_traces = power_plot_obj.traces
                    p_column_names = Object.keys(obj_power_plot.p[0])
                    p_column_unique = {}
                    p_column_unique_length = {}


                    f_column_names = Object.keys(obj_power_plot.f[0])
                    f_column_unique = {}
                    f_column_unique_length = {}

                    // create inputs according to sample and compound information.



                    $.ajax({
                        url: "js/plot_layout_adjuster2.js", converters: { 'text script': function (text) { return text; } }, success: function (plot_layout_adjuster2) {
                            adjusted_power_plot_layout_adjuster2 = plot_layout_adjuster2.replace(/PLOT_NAME/g, 'power_plot')
                            //console.log(adjusted_power_plot_layout_adjuster2)
                            eval(adjusted_power_plot_layout_adjuster2)
                            // initialize the traces on HTML.

                            $("#power_plot_layout_title_text").val(obj_power_plot.power_title);
                            $("#power_plot_layout_yaxis_title_text").val(obj_power_plot.power_ylab);
                            $("#power_plot_layout_title_text").prop("disabled", true);
                            $("#power_plot_layout_yaxis_title_text").prop("disabled", true);

                            $("#power_plot_traces_line").load("line_style.html", function () {
                                init_selectpicker();

                                $("#power_plot_traces_line .input-group .spectrums").spectrum({
                                    color: power_plot_obj.traces.line.color,
                                    showPalette: true,
                                    palette: color_pallete
                                });
                                $("#power_plot_traces_line .input-group .spectrums").change(power_plot_debounced);
                                $("#power_plot_traces_line .form-control.width").val(power_plot_obj.traces.line.width)
                                $("#power_plot_traces_line .form-control.width").change(power_plot_debounced);
                                $("#power_plot_traces_line .form-group .selectpicker").val(power_plot_obj.traces.line.shape)
                                $("#power_plot_traces_line .form-group .selectpicker").change(power_plot_debounced);
                                $("#power_plot_traces_line .form-group .selectpicker").selectpicker('refresh')
                                $("#power_plot_traces_line .form-control.smoothing").val(power_plot_obj.traces.line.smoothing)
                                $("#power_plot_traces_line .form-control.smoothing").change(power_plot_debounced);
                                power_plot_debounced()
                            })


                        }
                    })

                })
            }).fail(function (e2) {
                Swal.fire('Oops...', e2.responseText, 'error')
            })


            gather_page_information_to_power_plot = function () {


                $.ajax({
                    url: "js/plot_layout_adjuster3.js", converters: { 'text script': function (text) { return text; } }, success: function (plot_layout_adjuster3) {
                        var adjusted_power_plot_layout_adjuster3 = plot_layout_adjuster3.replace(/PLOT_NAME/g, 'power_plot')
                        console.log("REPLACED")
                        //console.log(adjusted_power_plot_layout_adjuster3)

                        console.log("EVALUATED")
                        eval(adjusted_power_plot_layout_adjuster3)

                        save_power_plot_style = function () {
                            // save the traces on HTML
                            
                            power_plot_layout.traces.line = {
                                color: $("#power_plot_traces_line .input-group .spectrums").spectrum("get").toRgbString(),
                                width: $("#power_plot_traces_line .form-control.width").val(),
                                shape:$("#power_plot_traces_line .form-group .selectpicker").val(),
                                smoothing:$("#power_plot_traces_line .form-control.smoothing").val()
                            }
                            
                              


                            $.ajax({
                                url: "js/plot_layout_adjuster4.js", converters: { 'text script': function (text) { return text; } }, success: function (plot_layout_adjuster4) {
                                    adjusted_power_plot_layout_adjuster4 = plot_layout_adjuster4.replace(/PLOT_NAME/g, 'power_plot')
                                    console.log(adjusted_power_plot_layout_adjuster4)
                                    eval(adjusted_power_plot_layout_adjuster4)
                                }
                            })
                        }

                        // collect traces info for plot.
                        //power_plot_layout.xaxis.autorange = false
                        //power_plot_layout.xaxis.range = [0,1]
                        power_plot_layout.traces.line = {
                            color: $("#power_plot_traces_line .input-group .spectrums").spectrum("get").toRgbString(),
                            width: $("#power_plot_traces_line .form-control.width").val(),
                            shape:$("#power_plot_traces_line .form-group .selectpicker").val(),
                            smoothing:$("#power_plot_traces_line .form-control.smoothing").val()
                        }

                        var layout = power_plot_layout
                        var plot_id = "power_plot"
                        //obj_power_plot

                        var x = Object.values(obj_power_plot.inv_power).map(o => o.x)
                        var y = Object.values(obj_power_plot.inv_power).map(o => o.y)
                        var names = Object.keys(obj_power_plot.inv_power)
                        var title = $("#power_plot_layout_title_text").val();
                        var y_lab = $("#power_plot_layout_yaxis_title_text").val();

                        


                        if($("#power_plot_explanation_html").length==0){
                            $("#power_plot_explanation").append("<div id='power_plot_explanation_html'></div>")
                        }
                        $("#power_plot_explanation_html").html(obj_power_plot.results_description[2])


                        power_plot_fun({
                            x: x, y: y, title: title, y_lab: y_lab, names: names,
                            layout: layout, plot_id: plot_id
                        })



                    }
                })
            }
            power_plot_debounced = _.debounce(gather_page_information_to_power_plot, 250, { 'maxWait': 1000 }); // this must be a global object.



        }
    })
}, 'html');







