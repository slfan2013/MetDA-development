



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



                            $("#ssize_plot_traces_line").load("line_style.html", function () {
                                init_selectpicker();

                                $("#ssize_plot_traces_line .input-group .spectrums").spectrum({
                                    color: ssize_plot_obj.traces.line.color,
                                    showPalette: true,
                                    palette: color_pallete
                                });
                                $("#ssize_plot_traces_line .input-group .spectrums").change(ssize_plot_debounced);
                                $("#ssize_plot_traces_line .form-control.width").val(ssize_plot_obj.traces.line.width)
                                $("#ssize_plot_traces_line .form-control.width").change(ssize_plot_debounced);
                                $("#ssize_plot_traces_line .form-group .selectpicker").val(ssize_plot_obj.traces.line.shape)
                                $("#ssize_plot_traces_line .form-group .selectpicker").change(ssize_plot_debounced);
                                $("#ssize_plot_traces_line .form-group .selectpicker").selectpicker('refresh')
                                $("#ssize_plot_traces_line .form-control.smoothing").val(ssize_plot_obj.traces.line.smoothing)
                                $("#ssize_plot_traces_line .form-control.smoothing").change(ssize_plot_debounced);
                                ssize_plot_debounced()
                            })



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


                            ssize_plot_layout.traces.line = {
                                color: $("#ssize_plot_traces_line .input-group .spectrums").spectrum("get").toRgbString(),
                                width: $("#ssize_plot_traces_line .form-control.width").val(),
                                shape:$("#ssize_plot_traces_line .form-group .selectpicker").val(),
                                smoothing:$("#ssize_plot_traces_line .form-control.smoothing").val()
                            }



                            $.ajax({
                                url: "js/plot_layout_adjuster4.js", converters: { 'text script': function (text) { return text; } }, success: function (plot_layout_adjuster4) {
                                    adjusted_ssize_plot_layout_adjuster4 = plot_layout_adjuster4.replace(/PLOT_NAME/g, 'ssize_plot')
                                    console.log(adjusted_ssize_plot_layout_adjuster4)
                                    eval(adjusted_ssize_plot_layout_adjuster4)
                                }
                            })
                        }

                        // collect traces info for plot.
                        ssize_plot_layout.traces.line = {
                            color: $("#ssize_plot_traces_line .input-group .spectrums").spectrum("get").toRgbString(),
                            width: $("#ssize_plot_traces_line .form-control.width").val(),
                            shape:$("#ssize_plot_traces_line .form-group .selectpicker").val(),
                            smoothing:$("#ssize_plot_traces_line .form-control.smoothing").val()
                        }


                        ssize_plot_layout.xaxis.autorange = false
                        ssize_plot_layout.xaxis.range = $("#sample_size_range").val().split("-")

                        console.log(ssize_plot_layout.xaxis.autorange)
                        var layout = ssize_plot_layout
                        var plot_id = "ssize_plot"
                        //obj_ssize_plot

                        var x = Object.values(obj_ssize_plot.inv_n).map(o=>o.x)
                        var y = Object.values(obj_ssize_plot.inv_n).map(o=>o.y)
                        var names = Object.keys(obj_ssize_plot.inv_n)
                        var title = $("#ssize_plot_layout_title_text").val();
                        var y_lab = $("#ssize_plot_layout_yaxis_title_text").val();

                       
                        if($("#ssize_plot_explanation_html").length==0){
                            $("#ssize_plot_explanation").append("<div id='ssize_plot_explanation_html'></div>")
                        }
                        $("#ssize_plot_explanation_html").html(obj_ssize_plot.results_description[1])



                        ssize_plot_fun({x:x,y:y,title:title,y_lab:y_lab,names:names,
                            layout: layout, plot_id: plot_id
                        })



                    }
                })
            }
            ssize_plot_debounced = _.debounce(gather_page_information_to_ssize_plot, 250, { 'maxWait': 1000 }); // this must be a global object.



        }
    })
}, 'html');







