# perform_quick_analysis_step_by_step

# ii = 1


json_list <- jsonlite::fromJSON(json, simplifyVector = FALSE, auto_unbox = TRUE)

# structure_to_be_added_ids <- json_list$structure_to_be_added_ids
# structure_to_be_added_folders_only <- json_list$structure_to_be_added_folders_only
# structure_to_be_added <- json_list$structure_to_be_added
# depending <- json_list$depending
# sample_parameters_to = json_list$sample_parameters_to






json_list_names <- names(json_list)
for (j in 1:length(json_list)) {
  assign(json_list_names[j], json_list[[json_list_names[j]]])
}


if (length(output_file_time) == 0) {
  output_file_time <- c()
}



index <- which(structure_to_be_added_ids %in% structure_to_be_added_folders_only[[ii]]$id)
current_parameter <- structure_to_be_added[[index]]$parameter




if (any(!depending[[ii]] == 0)) {
  temp_id <- current_parameter$activate_data_id

  temp_splits <- sapply(temp_id, function(x) {
    strsplit(x, "\\.")[[1]]
  }, simplify = F)

  current_parameter$activate_data_id <- sapply(1:length(temp_splits), function(x) {
    paste0(substr(temp_splits[[x]][1], 1, nchar(temp_splits[[x]][1]) - 11 + 1), output_file_time[unlist(depending[[ii]][x])], ".", temp_splits[[x]][length(temp_splits[[x]])])
  })
}




plot_index <- grepl("_plot", names(current_parameter))
if (any(plot_index)) {
  for (plot_idx in which(plot_index)) {
    for (j in 1:length(current_parameter[[plot_idx]])) {
      if (current_parameter[[plot_idx]][[j]] %in% names(sample_parameters_to)) {
        current_parameter[[plot_idx]][[j]] <- revalue(current_parameter[[plot_idx]][[j]], names(sample_parameters_to), unlist(sample_parameters_to))
      }
    }
  }

  for(not_plot_idx in which(!plot_index)){
    if (current_parameter[[not_plot_idx]] %in% names(sample_parameters_to)) {
      current_parameter[[not_plot_idx]] <- revalue(current_parameter[[not_plot_idx]], names(sample_parameters_to), unlist(sample_parameters_to))
    }
  }



}else{
  for (j in 1:length(current_parameter)) {
    if (current_parameter[[j]] %in% names(sample_parameters_to)) {
      current_parameter[[j]] <- revalue(current_parameter[[j]], names(sample_parameters_to), unlist(sample_parameters_to))
    }
  }
}




current_parameter$project_id <- project_id




result <- call_fun(parameter = current_parameter)
# now go to the call_fun and run line by line. The parameter is ready.




children <- structure_to_be_added[structure_to_be_added_parents %in% structure_to_be_added[[index]]$id & !structure_to_be_added_icons %in% "fa fa-folder"]

children_file_names <- sapply(children, function(x) {
  x$text
})




sources <- sapply(structure_to_be_added[[index]]$files_sources, function(x) {
  if(length(x) == 0){
    result = list()
  }else{
    result <- strsplit(x, "files/")[[1]][2]
    if (is.na(result)) {
      result <- x
    }
  }
  return(result)

}, simplify = T)



if (length(sources) == 0) {
  sources <- jsonlite::base64_enc("1")
}else{
  for(i in 1:length(sources)){
    if(length(sources[[i]])==0){
      sources[[i]] <- jsonlite::base64_enc("1")
    }
  }
}

names(sources)[1] <- "quick_analysis"




if (any(grepl("_plot", names(current_parameter)))) {
  need_plot <- TRUE
} else {
  need_plot <- FALSE
}









saved_result <- call_fun(parameter = list(
  project_id = project_id,
  selected_folder = revalue(structure_to_be_added_folders_only_parents[[ii]], names(old_id_to_new_id_matches), unlist(old_id_to_new_id_matches)),
  files_names = children_file_names,
  files_sources = sources,
  files_sources_data = "not_useful",
  files_types = unlist(structure_to_be_added[[index]]$files_types),
  fold_name = structure_to_be_added[[index]]$text,
  parameters = current_parameter,
  epf_index = structure_to_be_added[[index]]$epf_index,
  fun_name = "save_results_to_project",

  compound_sample_index = unlist(sapply(structure_to_be_added, function(x) {
    x$subset
  }))
))
output_file_time[ii] <- saved_result$current_time




old_id_to_new_id_matches[ii] <- gsub(substr(old_id_to_new_id_matches[ii], nchar(old_id_to_new_id_matches[ii]) - 9, nchar(old_id_to_new_id_matches[ii])), output_file_time[ii], old_id_to_new_id_matches[ii])

results <- list()
if (need_plot) {
  results[[as.character(output_file_time[ii])]] <- result
}


json_list <- list(structure_to_be_added_ids = structure_to_be_added_ids, structure_to_be_added_folders_only = structure_to_be_added_folders_only, structure_to_be_added = structure_to_be_added, old_id_to_new_id_matches = old_id_to_new_id_matches, depending = depending, sample_parameters_to = sample_parameters_to, project_id = project_id, structure_to_be_added_parents = structure_to_be_added_parents, structure_to_be_added_icons = structure_to_be_added_icons, structure_to_be_added_folders_only_parents = structure_to_be_added_folders_only_parents, output_file_time = output_file_time)

if (length(structure_to_be_added_folders_only) == ii) {
  ii <- "done."
} else {
  ii <- ii + 1
}




result <- jsonlite::toJSON(list(structure_to_be_added_ids = structure_to_be_added_ids, structure_to_be_added_folders_only = structure_to_be_added_folders_only, structure_to_be_added = structure_to_be_added, old_id_to_new_id_matches = old_id_to_new_id_matches, depending = depending, sample_parameters_to = sample_parameters_to, project_id = project_id, structure_to_be_added_parents = structure_to_be_added_parents, structure_to_be_added_icons = structure_to_be_added_icons, structure_to_be_added_folders_only_parents = structure_to_be_added_folders_only_parents, output_file_time = output_file_time, ii = ii, results = results), auto_unbox = TRUE, force = TRUE)
# print(ii)
# ii <- ii + 1
