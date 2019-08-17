    $("#PLOT_NAME_layout_font, #PLOT_NAME_layout_title_font, #PLOT_NAME_layout_xaxis_title_font,#PLOT_NAME_layout_yaxis_title_font, #PLOT_NAME_layout_xaxis_tickfont, #PLOT_NAME_layout_yaxis_tickfont, #PLOT_NAME_legend_font").load("fonts_select.html", function () {
        init_selectpicker();

        $("#PLOT_NAME_layout_font .form-group .selectpicker").change(PLOT_NAME_debounced);
        $("#PLOT_NAME_layout_font .input-group .size").change(PLOT_NAME_debounced);
        $("#PLOT_NAME_layout_font .input-group .spectrums").change(PLOT_NAME_debounced)


        $("#PLOT_NAME_layout_title_font .form-group .selectpicker").change(PLOT_NAME_debounced);
        $("#PLOT_NAME_layout_title_font .input-group .size").change(PLOT_NAME_debounced);
        $("#PLOT_NAME_layout_title_font .input-group .spectrums").change(PLOT_NAME_debounced)

        $("#PLOT_NAME_layout_xaxis_title_font .form-group .selectpicker").change(PLOT_NAME_debounced);
        $("#PLOT_NAME_layout_xaxis_title_font .input-group .size").change(PLOT_NAME_debounced);
        $("#PLOT_NAME_layout_xaxis_title_font .input-group .spectrums").change(PLOT_NAME_debounced)

        $("#PLOT_NAME_layout_yaxis_title_font .form-group .selectpicker").change(PLOT_NAME_debounced);
        $("#PLOT_NAME_layout_yaxis_title_font .input-group .size").change(PLOT_NAME_debounced);
        $("#PLOT_NAME_layout_yaxis_title_font .input-group .spectrums").change(PLOT_NAME_debounced)

        $("#PLOT_NAME_layout_xaxis_tickfont .form-group .selectpicker").change(PLOT_NAME_debounced);
        $("#PLOT_NAME_layout_xaxis_tickfont .input-group .size").change(PLOT_NAME_debounced);
        $("#PLOT_NAME_layout_xaxis_tickfont .input-group .spectrums").change(PLOT_NAME_debounced)

        $("#PLOT_NAME_layout_yaxis_tickfont .form-group .selectpicker").change(PLOT_NAME_debounced);
        $("#PLOT_NAME_layout_yaxis_tickfont .input-group .size").change(PLOT_NAME_debounced);
        $("#PLOT_NAME_layout_yaxis_tickfont .input-group .spectrums").change(PLOT_NAME_debounced)
        
        
        $("#PLOT_NAME_legend_font .form-group .selectpicker").change(PLOT_NAME_debounced);
        $("#PLOT_NAME_legend_font .input-group .size").change(PLOT_NAME_debounced);
        $("#PLOT_NAME_legend_font .input-group .spectrums").change(PLOT_NAME_debounced)

    })