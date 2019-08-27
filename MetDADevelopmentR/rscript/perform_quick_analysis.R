# perform_quick_analysis <- function(
#   project_id = "boxplot b41564966343",
#   selected_data = "e.csv",
#   project_id2 = "boxplot a41564966178",
#   selected_data2 = "e.csv",
#   parameters) {
  # save(project_id, selected_data, project_id2, selected_data2, parameters, file = "local.RData") # for debugging


  # load("local.RData")
  # structures <- get_to_be_added_structure(
  #   project_id,
  #   selected_data,
  #   project_id2,
  #   selected_data2
  # )


  structures = call_fun(parameter = list(
    project_id = project_id,
    selected_data = selected_data,
    project_id2 = project_id2,
    selected_data2 = selected_data2,
    fun_name = "get_to_be_added_structure"
  ))


  project_structure <- structures$project_structure
  ids <- sapply(project_structure, function(x) {
    x$id
  })
  parents <- sapply(project_structure, function(x) {
    x$parent
  })


  structure_to_be_added <- structures$structure_to_be_added

  structure_to_be_added_icons <- sapply(structure_to_be_added, function(x) {
    x$icon
  })
  structure_to_be_added_folders_only <- structure_to_be_added[structure_to_be_added_icons %in% "fa fa-folder"]


  structure_to_be_added_folders_only_activated_data_id <- sapply(structure_to_be_added_folders_only, function(x) {
    x$parameter$activate_data_id
  })

  round <- 1
  being_activated_data_id2 <- c()
  being_activated_data_id2[1] <- selected_data2
  structure_to_be_added_parents <- sapply(structure_to_be_added, function(x) {
    x$parent
  })

  structure_to_be_added_ids <- sapply(structure_to_be_added, function(x) {
    x$id
  })

  names(structure_to_be_added_parents) = structure_to_be_added_ids

  # i <- 1
  activate_data_id <- sapply(structure_to_be_added, function(x) {
    x$parameter$activate_data_id
  })

  # addjust the parameter according to users input.
  sample_parameters_from <- gsub("sample_parameters_global_id_", "", names(parameters))
  sample_parameters_to <- parameters
  names(sample_parameters_to) <- sample_parameters_from


  compound_parameters_from <- gsub("compound_parameters_global_id_", "", names(parameters))
  compound_parameters_to <- parameters
  names(compound_parameters_to) <- compound_parameters_from







  structure_to_be_added_id <- sapply(structure_to_be_added, function(x) x$id)
  old_id = sapply(structure_to_be_added_folders_only, function(x) x$id)
  structure_to_be_added_folders_only_id <- old_id

  structure_to_be_added_folders_only_parents = sapply(structure_to_be_added_folders_only, function(x) x$parent)






  depending <- list()
  for (i in 1:length(structure_to_be_added_folders_only)) {
    temp_index <- which(structure_to_be_added_id %in% structure_to_be_added_folders_only[[i]]$parameter$activate_data_id)

    if (length(temp_index) == 0) {
      depending[[i]] <- 0
    } else {
      # depending[i] <- which(structure_to_be_added_folders_only_id %in% structure_to_be_added_folders_only[[i]]$parent)

      depending[[i]] <- which(structure_to_be_added_folders_only_id %in% sapply(structure_to_be_added_folders_only[[i]]$parameter$activate_data_id, function(x) structure_to_be_added_parents[[x]]))



    }
  }
  output_file_time <- c()



  old_id_to_new_id_matches=c(1:length(structure_to_be_added_folders_only))
  old_id_to_new_id_matches = as.list(structure_to_be_added_folders_only_id)
  names(old_id_to_new_id_matches) = structure_to_be_added_folders_only_id



  # result = TRUE
  # results = list()




  # for (i in 1:length(structure_to_be_added_folders_only)) {
  #
  #
  #   index <- which(structure_to_be_added_ids %in% structure_to_be_added_folders_only[[i]]$id)
  #
  #   current_parameter <- structure_to_be_added[[index]]$parameter
  #
  #
  #
  #
  #   if (any(!depending[[i]] == 0)) {
  #     temp_id <- current_parameter$activate_data_id
  #
  #     # temp_split <- strsplit(temp_id, "\\.")[[1]]
  #
  #     temp_splits = sapply(temp_id, function(x){
  #       strsplit(x, "\\.")[[1]]
  #     }, simplify = F)
  #
  #
  #     # current_parameter$activate_data_id <- paste0(substr(temp_split[[1]], 1, nchar(temp_split[[1]]) - 11 + 1), output_file_time[depending[[i]]], ".", temp_split[length(temp_split)])
  #
  #     current_parameter$activate_data_id <- sapply(1:length(temp_splits),function(x){
  #       paste0(substr(temp_splits[[x]][1], 1, nchar(temp_splits[[x]][1]) - 11 + 1), output_file_time[depending[[i]][x]], ".", temp_splits[[x]][length(temp_splits[[x]])])
  #     })
  #
  #   }
  #
  #
  #
  #   # current_parameter$fun_name
  #   if (current_parameter$fun_name %in% c("pca",'plsda')) {
  #     for (j in 1:length(current_parameter$score_plot)) {
  #       if (current_parameter$score_plot[[j]] %in% names(sample_parameters_to)) {
  #         print(j)
  #         current_parameter$score_plot[[j]] <- plyr::revalue(current_parameter$score_plot[[j]], sample_parameters_to)
  #       }
  #     }
  #
  #
  #     for (j in 1:length(current_parameter$loading_plot)) {
  #       if (current_parameter$loading_plot[[j]] %in% names(compound_parameters_to)) {
  #         print(j)
  #         current_parameter$loading_plot[[j]] <- plyr::revalue(current_parameter$loading_plot[[j]], compound_parameters_to)
  #       }
  #     }
  #
  #
  #
  #   } else if(current_parameter$fun_name %in% c("heatmap")){
  #     for (j in 1:length(current_parameter$heatmap_plot)) {
  #       if(length(current_parameter$heatmap_plot[[j]])>0){
  #         if (current_parameter$heatmap_plot[[j]] %in% names(sample_parameters_to)) {
  #           current_parameter$heatmap_plot[[j]] <- plyr::revalue(unlist(current_parameter$heatmap_plot[[j]]), sample_parameters_to)
  #         }
  #       }
  #     }
  #
  #
  #     for (j in 1:length(current_parameter$heatmap_plot)) {
  #       if(length(current_parameter$heatmap_plot[[j]])>0){
  #         if (current_parameter$heatmap_plot[[j]] %in% names(compound_parameters_to)) {
  #           print(j)
  #           current_parameter$heatmap_plot[[j]] <- plyr::revalue(unlist(current_parameter$heatmap_plot[[j]]), compound_parameters_to)
  #         }
  #       }
  #     }
  #
  #
  #
  #   } else if(current_parameter$fun_name %in% c("boxplot")){
  #
  #
  #
  #     for (j in 1:length(current_parameter$boxplot_plot)) {
  #       if(length(current_parameter$boxplot_plot[[j]])>0){
  #         if (current_parameter$boxplot_plot[[j]] %in% names(sample_parameters_to)) {
  #           current_parameter$boxplot_plot[[j]] <- plyr::revalue(unlist(current_parameter$boxplot_plot[[j]]), sample_parameters_to)
  #         }
  #       }
  #     }
  #
  #
  #   }else{
  #     for (j in 1:length(current_parameter)) {
  #       if (current_parameter[[j]] %in% names(sample_parameters_to)) {
  #         # print(j)
  #         current_parameter[[j]] <- plyr::revalue(current_parameter[[j]], sample_parameters_to)
  #       }
  #     }
  #   }
  #
  #
  #
  #   current_parameter$project_id <- project_id
  #   # load("current_parameter.RData")
  #   result = call_fun(parameter = current_parameter)# now go to the call_fun and run line by line. The parameter is ready.
  #
  #
  #
  #   children <- structure_to_be_added[structure_to_be_added_parents %in% structure_to_be_added[[index]]$id & !structure_to_be_added_icons %in% "fa fa-folder"]
  #   children_file_names <- sapply(children, function(x) {
  #     x$text
  #   })
  #
  #
  #
  #   # save results
  #   sources <- sapply(structure_to_be_added[[index]]$files_sources, function(x) {
  #     return(strsplit(x, "files/")[[1]][2])
  #   }, simplify = T)
  #
  #   names(sources)[1] = "quick_analysis" #this is for save_results_to_project to determin if the call is from the quick analysis.
  #
  #   if(current_parameter$fun_name %in% c("heatmap","pca",'boxplot','volcano','ssize','plsda')){
  #     if(any(is.na(sources))){
  #       children_texts = sapply(children, function(x) x$text)
  #       for(j in which(is.na(sources))){
  #         sources[j] = base64enc::base64encode(1:100)
  #       }
  #     }
  #
  #     need_plot = TRUE # needs the js to draw the plot and save.
  #
  #   }else{
  #     if(any(is.na(sources))){
  #       children_texts = sapply(children, function(x) x$text)
  #       for(j in which(is.na(sources))){
  #         sources[j] = base64enc::base64encode(children_texts[j])
  #       }
  #     }
  #
  #     need_plot = FALSE
  #
  #   }
  #
  #
  #
  #   saved_result = call_fun(parameter = list(
  #     project_id = project_id,
  #     selected_folder = plyr::revalue(structure_to_be_added_folders_only_parents[[i]],old_id_to_new_id_matches),
  #     files_names = children_file_names,
  #     # files_sources = sources,
  #     files_sources_data = "not_useful",
  #     files_types = unlist(structure_to_be_added[[index]]$files_types),
  #     fold_name = structure_to_be_added[[index]]$text,
  #     parameters = current_parameter,
  #     epf_index = structure_to_be_added[[index]]$epf_index,
  #     fun_name = "save_results_to_project"
  #   ))
  #   output_file_time[i] <- saved_result$current_time
  #
  #
  #   old_id_to_new_id_matches[i] = gsub(substr(old_id_to_new_id_matches[i],nchar(old_id_to_new_id_matches[i])-9,nchar(old_id_to_new_id_matches[i])),output_file_time[i],old_id_to_new_id_matches[i])
  #
  #   if(need_plot){
  #     results[[as.character(output_file_time[i])]] = result
  #   }
  #
  # }


  # result = results
  ii = 1
  result = jsonlite::toJSON(list(structure_to_be_added_ids=structure_to_be_added_ids, structure_to_be_added_folders_only = structure_to_be_added_folders_only, structure_to_be_added = structure_to_be_added, old_id_to_new_id_matches = old_id_to_new_id_matches, depending = depending,sample_parameters_to=sample_parameters_to,project_id =project_id,structure_to_be_added_parents=structure_to_be_added_parents,structure_to_be_added_icons=structure_to_be_added_icons,structure_to_be_added_folders_only_parents=structure_to_be_added_folders_only_parents,output_file_time=output_file_time,ii=ii), auto_unbox = TRUE, force = TRUE)
















































