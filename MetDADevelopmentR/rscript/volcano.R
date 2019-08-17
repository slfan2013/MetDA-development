# result = list(a = defination_of_missing_value)


# http://localhost:5656/ocpu/tmp/x08f655c87c/
# helper function for creating dendograms


pacman::p_load(data.table, ggdendro, plotly, ggplot2)


if(length(parameter$activate_data_id)>1){ # this means this is not in and out


  p_value_data_id = parameter$activate_data_id[1]
  fold_change_data_id = parameter$activate_data_id[2]


  p_value_data = tryCatch(read.csv(
    paste0(
      "http://metda:metda@localhost:5985/metda_project/",
      project_id,
      "/",p_value_data_id
    )
    ,row.names  = 1), error = function(e){
      read.csv(
      paste0(
        "http://metda:metda@localhost:5985/metda_project/",
        project_id,
        "/",paste0("student_t_test_result", substr(fold_change_data_id,nchar(fold_change_data_id) - 14 + 1,nchar(fold_change_data_id)))
      ))

      stop("check row 29. mann_whitney not allowed.")

    })



  fold_change_data = tryCatch(read.csv(
      paste0(
        "http://metda:metda@localhost:5985/metda_project/",
        project_id,
        "/",fold_change_data_id
      )
      ,row.names  = 1), error = function(e){

        read.csv(
          paste0(
            "http://metda:metda@localhost:5985/metda_project/",
            project_id,
            "/",paste0("fold_change_result", substr(p_value_data_id,nchar(p_value_data_id) - 14 + 1,nchar(p_value_data_id)))
          ))

      })
  data = data.table(label = p_value_data$label, p_values = p_value_data$p_values, fold_change = fold_change_data$fold_changes)

  fwrite(data, "data.csv", col.names = TRUE,row.names = FALSE)


}else{

  data = read.csv(
    paste0(
      "http://metda:metda@localhost:5985/metda_project/",
      project_id,
      "/",activate_data_id
    )
    ,row.names  = 1)

  data$label = rownames(data)
  fwrite(data, "data.csv", col.names = TRUE,row.names = TRUE)
}

# data = call_fun(parameter = list(project_id=project_id,activate_data_id=activate_data_id,fun_name="read_data_from_projects"))
# e = data$e
# f = data$f
# p = data$p

# Summarize the information about missing values.
# data = wcmc::read_data("GCTOF_Abraham_CM_v_M_heart_NoSwim.xlsx")
# e = data$e_matrix
# f = data$f
# p = data$p







if(exists("volcano_plot")){# this means this call is from quick_analysis. Here we are going to draw score plot and loading plot.

  # volcano_plot_style = get_volcano_plot_style("slfan") # !!! HERE WE NEED TO CHANGE 'SLFAN' TO NEW ID.
  volcano_plot_style = call_fun(parameter = list(
    user_id='slfan',
    fun_name = "get_volcano_plot_style"
  ))



  layout = volcano_plot$layout
  p_value_cut_off = volcano_plot$p_value_cut_off
  fold_change_cut_off = volcano_plot$fold_change_cut_off
  colors = volcano_plot$colors
  shapes = volcano_plot$shapes
  sizes = volcano_plot$sizes
  significancy_line_color = volcano_plot$significancy_line_color
  significancy_line_dash = volcano_plot$significancy_line_dash
  significancy_line_width = volcano_plot$significancy_line_width
  names = volcano_plot$names






  result = jsonlite::toJSON(list("volcano_plot.svg" = list(
    p_values = data$p_values,
    label = data$label,
    fold_change = data$fold_change,
    p_value_cut_off= p_value_cut_off, fold_change_cut_off= fold_change_cut_off,
    colors= colors, shapes= shapes, sizes= sizes,
    significancy_line_color= significancy_line_color, significancy_line_dash= significancy_line_dash, significancy_line_width= significancy_line_width,
    names= names,
    layout= layout, plot_id= ""

  )
  ), auto_unbox = TRUE, force = TRUE)





}else{
  result = list(results_description = "volcanos are ready to make.",label = data$label, p_values = data$p_values, fold_change = data$fold_change)
}
