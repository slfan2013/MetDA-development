    $("#PLOT_NAME_layout_font, #PLOT_NAME_layout_title_font, #PLOT_NAME_layout_xaxis_title_font,#PLOT_NAME_layout_yaxis_title_font, #PLOT_NAME_layout_xaxis_tickfont, #PLOT_NAME_layout_yaxis_tickfont").load("fonts_select.html", function () {
        init_selectpicker();

        $("#PLOT_NAME_layout_font .form-group .selectpicker").change(gather_page_information_to_PLOT_NAME);
        $("#PLOT_NAME_layout_font .input-group .size").change(gather_page_information_to_PLOT_NAME);
        $("#PLOT_NAME_layout_font .input-group .spectrums").change(gather_page_information_to_PLOT_NAME)


        $("#PLOT_NAME_layout_title_font .form-group .selectpicker").change(gather_page_information_to_PLOT_NAME);
        $("#PLOT_NAME_layout_title_font .input-group .size").change(gather_page_information_to_PLOT_NAME);
        $("#PLOT_NAME_layout_title_font .input-group .spectrums").change(gather_page_information_to_PLOT_NAME)

        $("#PLOT_NAME_layout_xaxis_title_font .form-group .selectpicker").change(gather_page_information_to_PLOT_NAME);
        $("#PLOT_NAME_layout_xaxis_title_font .input-group .size").change(gather_page_information_to_PLOT_NAME);
        $("#PLOT_NAME_layout_xaxis_title_font .input-group .spectrums").change(gather_page_information_to_PLOT_NAME)

        $("#PLOT_NAME_layout_yaxis_title_font .form-group .selectpicker").change(gather_page_information_to_PLOT_NAME);
        $("#PLOT_NAME_layout_yaxis_title_font .input-group .size").change(gather_page_information_to_PLOT_NAME);
        $("#PLOT_NAME_layout_yaxis_title_font .input-group .spectrums").change(gather_page_information_to_PLOT_NAME)

        $("#PLOT_NAME_layout_xaxis_tickfont .form-group .selectpicker").change(gather_page_information_to_PLOT_NAME);
        $("#PLOT_NAME_layout_xaxis_tickfont .input-group .size").change(gather_page_information_to_PLOT_NAME);
        $("#PLOT_NAME_layout_xaxis_tickfont .input-group .spectrums").change(gather_page_information_to_PLOT_NAME)

        $("#PLOT_NAME_layout_yaxis_tickfont .form-group .selectpicker").change(gather_page_information_to_PLOT_NAME);
        $("#PLOT_NAME_layout_yaxis_tickfont .input-group .size").change(gather_page_information_to_PLOT_NAME);
        $("#PLOT_NAME_layout_yaxis_tickfont .input-group .spectrums").change(gather_page_information_to_PLOT_NAME)

    })