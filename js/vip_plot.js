$.get("plot_layout_adjuster.html", function (plot_layout_adjuster_string) {
    $("#vip_plot_to_be_loaded").append($.parseHTML(plot_layout_adjuster_string.replaceAll("PLOT_NAME", "vip_plot")));

    $.ajax({
        url: "js/plot_layout_adjuster1.js", converters: { 'text script': function (text) { return text; } }, success: function (plot_layout_adjuster1) {

            adjusted_vip_plot_layout_adjuster1 = plot_layout_adjuster1.replace(/PLOT_NAME/g, 'vip_plot')
            eval(adjusted_vip_plot_layout_adjuster1)

            // assign the default value for vip plot
            ocpu.call("call_fun", {
                parameter: {
                    user_id: localStorage.user_id,
                    fun_name: "get_vip_plot_style"
                }
            }, function (session) {
                session.getObject(function (vip_plot_obj) {

                    vip_plot_obj = prepare_layout(vip_plot_obj)
                    vip_plot_obj_global = vip_plot_obj
                    vip_plot_traces = vip_plot_obj.traces

                    var p_column_names = Object.keys(obj_vip_plot.p[0])
                    var p_column_unique = {}
                    var p_column_unique_length = {}


                    var f_column_names = Object.keys(obj_vip_plot.f[0])
                    var f_column_unique = {}
                    var f_column_unique_length = {}

                    // create inputs according to sample and compound information.



                    $.ajax({
                        url: "js/plot_layout_adjuster2.js", converters: { 'text script': function (text) { return text; } }, success: function (plot_layout_adjuster2) {
                            adjusted_vip_plot_layout_adjuster2 = plot_layout_adjuster2.replace(/PLOT_NAME/g, 'vip_plot')
                            //console.log(adjusted_vip_plot_layout_adjuster2)
                            eval(adjusted_vip_plot_layout_adjuster2)


                            // initialize the traces on HTML.
                            $("#n_vip").val(vip_plot_obj.traces.n_vip);
                            $("#colorscale").val(vip_plot_obj.traces.colorscale)
                            $("#colorscale").selectpicker('refresh')



                            vip_plot_debounced()
                        }
                    })

                })
            }).fail(function (e2) {
                Swal.fire('Oops...', e2.responseText, 'error')
            })


            gather_page_information_to_vip_plot = function () {


                $.ajax({
                    url: "js/plot_layout_adjuster3.js", converters: { 'text script': function (text) { return text; } }, success: function (plot_layout_adjuster3) {
                        var adjusted_vip_plot_layout_adjuster3 = plot_layout_adjuster3.replace(/PLOT_NAME/g, 'vip_plot')
                        console.log("REPLACED")
                        //console.log(adjusted_vip_plot_layout_adjuster3)

                        console.log("EVALUATED")
                        eval(adjusted_vip_plot_layout_adjuster3)

                        save_vip_plot_style = function () {
                            // save the traces on HTML
                            vip_plot_layout.traces.n_vip = $("#n_vip").val()
                            vip_plot_layout.traces.colorscale = $("#colorscale").val()
                            //vip_plot_layout.traces.sample_size_range = $("#sample_size_range").val()
                            $.ajax({
                                url: "js/plot_layout_adjuster4.js", converters: { 'text script': function (text) { return text; } }, success: function (plot_layout_adjuster4) {
                                    adjusted_vip_plot_layout_adjuster4 = plot_layout_adjuster4.replace(/PLOT_NAME/g, 'vip_plot')
                                    console.log(adjusted_vip_plot_layout_adjuster4)
                                    eval(adjusted_vip_plot_layout_adjuster4)
                                }
                            })
                        }

                        // collect traces info for plot.
                        vip_plot_layout.traces.n_vip = $("#n_vip").val()
                        vip_plot_layout.traces.colorscale = $("#colorscale").val()
                        var layout = vip_plot_layout

                        var plot_id = "vip_plot"


                        vip_plot_fun({ obj_vip_plot: obj_vip_plot, layout: layout, plot_id: plot_id })



                    }
                })
            }
            vip_plot_debounced = _.debounce(gather_page_information_to_vip_plot, 250, { 'maxWait': 1000 }); // this must be a global object.



        }
    })
}, 'html');







