# result = list(a = defination_of_missing_value)


# http://localhost:5656/ocpu/tmp/x08f655c87c/
# helper function for creating dendograms

pacman::p_load(data.table, ggdendro, plotly, ggplot2)



data = read_data_from_projects(project_id, activate_data_id)
e = data$e
f = data$f
p = data$p

# Summarize the information about missing values.
# data = wcmc::read_data("GCTOF_Abraham_CM_v_M_heart_NoSwim.xlsx")
# e = data$e_matrix
# f = data$f
# p = data$p







if(exists("boxplot_plot")){# this means this call is from quick_analysis. Here we are going to draw score plot and loading plot.

  boxplot_plot_style = get_boxplot_plot_style("slfan") # !!! HERE WE NEED TO CHANGE 'SLFAN' TO NEW ID.

  group_sample_by = boxplot_plot$group_sample_by
  f_label = f$label
  plotting_compound_index = 1
  y = e[plotting_compound_index,]

  main_group = boxplot_plot$main_group
  main_group_values = p[[main_group]]

  if(length(group_sample_by)>1){
    sub_group = group_sample_by[!group_sample_by%in%main_group]
    x = p[[sub_group]]

    if(all(unique(x) %in% unlist(boxplot_plot$categoryarray))){
      categoryarray = boxplot_plot$categoryarray
    }else if(all(unique(x) %in% unlist(boxplot_plot$main_group_split))){
      categoryarray = boxplot_plot$main_group_split
    }else{
      categoryarray = levels(factor(x))
    }
    xs = unname(sapply(by(x, main_group_values, function(x) x), function(x) x, simplify = FALSE))


  }else{
    xs = NULL
    if(all(unique(main_group_values) %in% unlist(boxplot_plot$categoryarray))){
      categoryarray = boxplot_plot$categoryarray
    }else if(all(unique(main_group_values) %in% unlist(boxplot_plot$main_group_split))){
      categoryarray = boxplot_plot$main_group_split
    }else{
      categoryarray = levels(factor(main_group_values))
    }

  }

  main_group_levels = unique(main_group_values)
  if(all(unique(main_group_levels) %in% unlist(boxplot_plot$categoryarray))){
    main_group_levels = unlist(boxplot_plot$categoryarray)
  }else if(all(unique(main_group_levels) %in% unlist(boxplot_plot$main_group_split))){
    main_group_levels = unlist(boxplot_plot$main_group_split)
  }else{
    main_group_levels = levels(factor(main_group_levels))
  }

  main_group_values = factor(main_group_values, levels = main_group_levels)

  ys = unname(sapply(by(y, main_group_values, function(x) x), function(x) x, simplify = F))



  p_label = p$label

  texts = unname(sapply(by(p_label, main_group_values, function(x) x), function(x) x, simplify = F))

  trace_names = main_group_levels


  colors = sapply(boxplot_plot$data, function(x){
    x$marker$color
  })
  names = sapply(boxplot_plot$data, function(x){
    x$name
  })
  names(colors) = names

  box_colors = sapply(trace_names, function(x) x)

  if(all(trace_names %in% names)){ # this means that we can inherite all teh colors from the user.
    box_colors = plyr::revalue(box_colors, colors)
  }else{
    box_colors = boxplot_plot_style$traces$box_colors[[length(colors)]]
    names(box_colors) = trace_names
  }

  layout = boxplot_plot$layout

  title = f_label[plotting_compound_index]
  fillcolor_transparency = boxplot_plot$layout$traces$fillcolor_transparency

  boxpoints = boxplot_plot$layout$traces$boxpoints
  if(boxpoints == "FALSE"){
    boxpoints = FALSE
  }

  jitter = boxplot_plot$layout$traces$jitter
  pointpos = boxplot_plot$layout$traces$pointpos
  whiskerwidth = boxplot_plot$layout$traces$whiskerwidth
  notched = boxplot_plot$layout$traces$notched
  notched = as.logical(notched)

  notchwidth = boxplot_plot$layout$traces$notchwidth

  symbol = boxplot_plot$layout$traces$symbol

  boxmean = boxplot_plot$layout$traces$boxmean
  if(boxmean == 'none'){
    boxmean = FALSE
  }else if(boxmean == 'mean'){
    boxmean = TRUE
  }

  size = boxplot_plot$layout$traces$size

  outliercolor = boxplot_plot$layout$traces$outliercolor

  line_width = boxplot_plot$layout$traces$line_width





  result = jsonlite::toJSON(list("boxplot_plot.zip" = list(
    xs= xs, ys= ys, texts= texts, boxpoints= boxpoints, jitter= jitter, pointpos= pointpos, trace_names= trace_names, box_colors= box_colors,
    symbol= symbol, whiskerwidth= whiskerwidth, notched= notched, notchwidth= notchwidth, boxmean= boxmean,
    size= size, outliercolor= outliercolor, line_width= line_width, fillcolor_transparency= fillcolor_transparency, title= title, categoryarray= categoryarray,
    layout= layout, plot_id= "",
    main_group_values = main_group_values,main_group_levels = main_group_levels,e=e
  )
  ), auto_unbox = TRUE, force = TRUE)





}else{
  result = list(results_description = "Boxplots are ready to make.",p = p, f = f, e = e)
}
