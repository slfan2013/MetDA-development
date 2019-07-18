perform_quick_analysis <- function(
                                   project_id = "test111563385744",
                                   selected_data = "e.csv",
                                   project_id2 = "test51563374913",
                                   selected_data2 = "e.csv",
                                   parameter) {
  save(project_id, selected_data, project_id2, selected_data2, parameter, file = "local.RData") # for debugging


  structures <- get_to_be_added_structure(
    project_id,
    selected_data,
    project_id2,
    selected_data2
  )

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

  # i <- 1
  activate_data_id <- sapply(structure_to_be_added, function(x) {
    x$parameter$activate_data_id
  })

  # addjust the parameter according to users input.
  sample_parameters_from <- gsub("sample_parameters_global_id_", "", names(parameter))
  sample_parameters_to <- unlist(parameter)
  names(sample_parameters_to) <- sample_parameters_from



  structure_to_be_added_id <- sapply(structure_to_be_added, function(x) x$id)
  structure_to_be_added_folders_only_id <- sapply(structure_to_be_added_folders_only, function(x) x$id)



  depending <- c()
  for (i in 1:length(structure_to_be_added_folders_only)) {
    temp_index <- which(structure_to_be_added_id %in% structure_to_be_added_folders_only[[i]]$parameter$activate_data_id)

    if (length(temp_index) == 0) {
      depending[i] <- 0
    } else {
      depending[i] <- which(structure_to_be_added_folders_only_id %in% structure_to_be_added[[i]]$parent)
    }
  }
  output_file_time <- c()




  for (i in 1:length(structure_to_be_added_folders_only)) {


    # index =  which(activate_data_id%in% structure_to_be_added_folders_only_activated_data_id[i] & structure_to_be_added_icons %in% "fa fa-folder")



    index <- which(structure_to_be_added_ids %in% structure_to_be_added_folders_only[[i]]$id)

    current_parameter <- structure_to_be_added[[index]]$parameter

     if(!depending[i] == 0){

       temp_id = current_parameter$activate_data_id

       temp_split = strsplit(temp_id,"\\.")[[1]]


       current_parameter$activate_data_id = paste0(substr(temp_split[[1]],1,nchar(temp_split[[1]])-11+1),output_file_time[depending[i]],".",temp_split[length(temp_split)])
     }



    # old_time <- substr(project_id, nchar(project_id) - 11 + 1, nchar(project_id))
    # new_time <- as.integer(Sys.time())




    for (j in 1:length(current_parameter)) {
      if (current_parameter[[j]] %in% sample_parameters_to) {
        current_parameter[[j]] <- plyr::revalue(current_parameter[[j]], sample_parameters_to)
      }
    }
    current_parameter$project_id <- project_id


    call_fun(parameter = current_parameter)

    # save results
    sources <- sapply(structure_to_be_added[[index]]$files_sources, function(x) {
      strsplit(x, "files/")[[1]][2]
    }, simplify = T)
    children <- structure_to_be_added[structure_to_be_added_parents %in% structure_to_be_added[[index]]$id & !structure_to_be_added_icons %in% "fa fa-folder"]
    children_file_names <- sapply(children, function(x) {
      x$text
    })




    saved_result <- save_results_to_project(
      project_id ,
      selected_folder = parents[ids %in% selected_data],
      files_names = children_file_names,
      files_sources = sources,
      files_sources_data = "not_useful",
      files_types = unlist(structure_to_be_added[[index]]$files_types),
      fold_name = structure_to_be_added[[index]]$text,
      parameters = current_parameter,
      epf_index = structure_to_be_added[[index]]$epf_index
    )
    output_file_time[i] <- saved_result$current_time



  }


  # print(round)
  # # print(being_activated_data_id2)
  # being_activated_data_id2 <- id2[activate_data_ids2 %in% being_activated_data_id2]
  # round <- round + 1







  return(TRUE)
}
