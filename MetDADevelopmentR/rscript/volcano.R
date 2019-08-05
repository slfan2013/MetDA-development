# result = list(a = defination_of_missing_value)


# http://localhost:5656/ocpu/tmp/x08f655c87c/
# helper function for creating dendograms

pacman::p_load(data.table, ggdendro, plotly, ggplot2)

data = read.csv(
  paste0(
    "http://metda:metda@localhost:5985/metda_project/",
    project_id,
    "/",activate_data_id
  )
  ,row.names  = 1)


fwrite(data, "data.csv", col.names = TRUE,row.names = TRUE)
# data = read_data_from_projects(project_id, activate_data_id)
# e = data$e
# f = data$f
# p = data$p

# Summarize the information about missing values.
# data = wcmc::read_data("GCTOF_Abraham_CM_v_M_heart_NoSwim.xlsx")
# e = data$e_matrix
# f = data$f
# p = data$p







if(exists("volcano_plot")){# this means this call is from quick_analysis. Here we are going to draw score plot and loading plot.

  volcano_plot_style = get_volcano_plot_style("slfan") # !!! HERE WE NEED TO CHANGE 'SLFAN' TO NEW ID.

  group_sample_by = volcano_plot$group_sample_by
  f_label = f$label
  plotting_compound_index = 1
  y = e[plotting_compound_index,]

  main_group = volcano_plot$main_group
  main_group_values = p[[main_group]]

  if(length(group_sample_by)>1){
    sub_group = group_sample_by[!group_sample_by%in%main_group]
    x = p[[sub_group]]

    if(all(unique(x) %in% unlist(volcano_plot$categoryarray))){
      categoryarray = volcano_plot$categoryarray
    }else if(all(unique(x) %in% unlist(volcano_plot$main_group_split))){
      categoryarray = volcano_plot$main_group_split
    }else{
      categoryarray = levels(factor(x))
    }
    xs = unname(sapply(by(x, main_group_values, function(x) x), function(x) x, simplify = FALSE))


  }else{
    xs = NULL
    if(all(unique(main_group_values) %in% unlist(volcano_plot$categoryarray))){
      categoryarray = volcano_plot$categoryarray
    }else if(all(unique(main_group_values) %in% unlist(volcano_plot$main_group_split))){
      categoryarray = volcano_plot$main_group_split
    }else{
      categoryarray = levels(factor(main_group_values))
    }

  }

  main_group_levels = unique(main_group_values)
  if(all(unique(main_group_levels) %in% unlist(volcano_plot$categoryarray))){
    main_group_levels = unlist(volcano_plot$categoryarray)
  }else if(all(unique(main_group_levels) %in% unlist(volcano_plot$main_group_split))){
    main_group_levels = unlist(volcano_plot$main_group_split)
  }else{
    main_group_levels = levels(factor(main_group_levels))
  }

  main_group_values = factor(main_group_values, levels = main_group_levels)

  ys = unname(sapply(by(y, main_group_values, function(x) x), function(x) x, simplify = F))



  p_label = p$label

  texts = unname(sapply(by(p_label, main_group_values, function(x) x), function(x) x, simplify = F))

  trace_names = main_group_levels


  colors = sapply(volcano_plot$data, function(x){
    x$marker$color
  })
  names = sapply(volcano_plot$data, function(x){
    x$name
  })
  names(colors) = names

  box_colors = sapply(trace_names, function(x) x)

  if(all(trace_names %in% names)){ # this means that we can inherite all teh colors from the user.
    box_colors = plyr::revalue(box_colors, colors)
  }else{
    box_colors = volcano_plot_style$traces$box_colors[[length(colors)]]
    names(box_colors) = trace_names
  }

  layout = volcano_plot$layout

  title = f_label[plotting_compound_index]
  fillcolor_transparency = volcano_plot$layout$traces$fillcolor_transparency

  boxpoints = volcano_plot$layout$traces$boxpoints
  if(boxpoints == "FALSE"){
    boxpoints = FALSE
  }

  jitter = volcano_plot$layout$traces$jitter
  pointpos = volcano_plot$layout$traces$pointpos
  whiskerwidth = volcano_plot$layout$traces$whiskerwidth
  notched = volcano_plot$layout$traces$notched
  notched = as.logical(notched)

  notchwidth = volcano_plot$layout$traces$notchwidth

  symbol = volcano_plot$layout$traces$symbol

  boxmean = volcano_plot$layout$traces$boxmean
  if(boxmean == 'none'){
    boxmean = FALSE
  }else if(boxmean == 'mean'){
    boxmean = TRUE
  }

  size = volcano_plot$layout$traces$size

  outliercolor = volcano_plot$layout$traces$outliercolor

  line_width = volcano_plot$layout$traces$line_width





  result = jsonlite::toJSON(list("volcano_plot.zip" = list(

    xs= xs, ys= ys, texts= texts, boxpoints= boxpoints, jitter= jitter, pointpos= pointpos, trace_names= trace_names, box_colors= box_colors,
    symbol= symbol, whiskerwidth= whiskerwidth, notched= notched, notchwidth= notchwidth, boxmean= boxmean,
    size= size, outliercolor= outliercolor, line_width= line_width, fillcolor_transparency= fillcolor_transparency, title= title, categoryarray= categoryarray,
    layout= layout, plot_id= "",

    main_group_values = main_group_values,main_group_levels = main_group_levels,e=e


  )
  ), auto_unbox = TRUE, force = TRUE)





}else{
  result = list(results_description = "volcanos are ready to make.",label = rownames(data), p_values = data$p_values, fold_change = data$fold_changes)
}
