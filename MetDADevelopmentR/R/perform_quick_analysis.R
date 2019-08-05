perform_quick_analysis <- function(
                                   project_id = "boxplot b41564966343",
                                   selected_data = "e.csv",
                                   project_id2 = "boxplot a41564966178",
                                   selected_data2 = "e.csv",
                                   parameter) {
  save(project_id, selected_data, project_id2, selected_data2, parameter, file = "local.RData") # for debugging


  load("local.RData")
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


  compound_parameters_from <- gsub("compound_parameters_global_id_", "", names(parameter))
  compound_parameters_to <- unlist(parameter)
  names(compound_parameters_to) <- compound_parameters_from







  structure_to_be_added_id <- sapply(structure_to_be_added, function(x) x$id)
  old_id = sapply(structure_to_be_added_folders_only, function(x) x$id)
  structure_to_be_added_folders_only_id <- old_id

  structure_to_be_added_folders_only_parents = sapply(structure_to_be_added_folders_only, function(x) x$parent)



  depending <- c()
  for (i in 1:length(structure_to_be_added_folders_only)) {
    temp_index <- which(structure_to_be_added_id %in% structure_to_be_added_folders_only[[i]]$parameter$activate_data_id)

    if (length(temp_index) == 0) {
      depending[i] <- 0
    } else {
      depending[i] <- which(structure_to_be_added_folders_only_id %in% structure_to_be_added_folders_only[[i]]$parent)
    }
  }
  output_file_time <- c()



  old_id_to_new_id_matches=c(1:length(structure_to_be_added_folders_only))
  old_id_to_new_id_matches = structure_to_be_added_folders_only_id
  names(old_id_to_new_id_matches) = structure_to_be_added_folders_only_id



  result = TRUE
  results = list()
  for (i in 1:length(structure_to_be_added_folders_only)) {


    index <- which(structure_to_be_added_ids %in% structure_to_be_added_folders_only[[i]]$id)

    current_parameter <- structure_to_be_added[[index]]$parameter




    if (!depending[i] == 0) {
      temp_id <- current_parameter$activate_data_id

      temp_split <- strsplit(temp_id, "\\.")[[1]]


      current_parameter$activate_data_id <- paste0(substr(temp_split[[1]], 1, nchar(temp_split[[1]]) - 11 + 1), output_file_time[depending[i]], ".", temp_split[length(temp_split)])

    }



    # current_parameter$fun_name
    if (current_parameter$fun_name %in% c("pca")) {
      for (j in 1:length(current_parameter$score_plot)) {
        if (current_parameter$score_plot[[j]] %in% names(sample_parameters_to)) {
          print(j)
          current_parameter$score_plot[[j]] <- plyr::revalue(current_parameter$score_plot[[j]], sample_parameters_to)
        }
      }
    } else if(current_parameter$fun_name %in% c("heatmap")){
      for (j in 1:length(current_parameter$heatmap_plot)) {
        if(length(current_parameter$heatmap_plot[[j]])>0){
          if (current_parameter$heatmap_plot[[j]] %in% names(sample_parameters_to)) {
            current_parameter$heatmap_plot[[j]] <- plyr::revalue(unlist(current_parameter$heatmap_plot[[j]]), sample_parameters_to)
          }
         }
      }


      for (j in 1:length(current_parameter$heatmap_plot)) {
        if(length(current_parameter$heatmap_plot[[j]])>0){
          if (current_parameter$heatmap_plot[[j]] %in% names(compound_parameters_to)) {
            print(j)
            current_parameter$heatmap_plot[[j]] <- plyr::revalue(unlist(current_parameter$heatmap_plot[[j]]), compound_parameters_to)
          }
        }
      }



    } else if(current_parameter$fun_name %in% c("boxplot")){



      for (j in 1:length(current_parameter$boxplot_plot)) {
        if(length(current_parameter$boxplot_plot[[j]])>0){
          if (current_parameter$boxplot_plot[[j]] %in% names(sample_parameters_to)) {
            current_parameter$boxplot_plot[[j]] <- plyr::revalue(unlist(current_parameter$boxplot_plot[[j]]), sample_parameters_to)
          }
        }
      }




      # stop("Needs to figure out what to do on boxplot.")


    }else{
      for (j in 1:length(current_parameter)) {
        if (current_parameter[[j]] %in% names(sample_parameters_to)) {
          # print(j)
          current_parameter[[j]] <- plyr::revalue(current_parameter[[j]], sample_parameters_to)
        }
      }
    }




    current_parameter$project_id <- project_id


    result = call_fun(parameter = current_parameter)# now go to the call_fun and run line by line. The parameter is ready.





    children <- structure_to_be_added[structure_to_be_added_parents %in% structure_to_be_added[[index]]$id & !structure_to_be_added_icons %in% "fa fa-folder"]
    children_file_names <- sapply(children, function(x) {
      x$text
    })


    # structure_to_be_added_folders_only[[3]]$parent


    # save results
    sources <- sapply(structure_to_be_added[[index]]$files_sources, function(x) {
      # result = strsplit(x, "files/")[[1]][2]
      # if(is.na(result)){ # this means this should be a base64.
      #   result = x
      # }
      # return(result)
      return(strsplit(x, "files/")[[1]][2])
    }, simplify = T)
    # base64encode("score_plot.svg")

    names(sources)[1] = "quick_analysis" #this is for save_results_to_project to determin if the call is from the quick analysis.

    if(current_parameter$fun_name %in% c("heatmap","pca",'boxplot')){
      if(any(is.na(sources))){
        children_texts = sapply(children, function(x) x$text)
        for(j in which(is.na(sources))){
          sources[j] = base64enc::base64encode(1:100)
        }
      }

      need_plot = TRUE # needs the js to draw the plot and save.

    }else{
      if(any(is.na(sources))){
        children_texts = sapply(children, function(x) x$text)
        for(j in which(is.na(sources))){
          sources[j] = base64enc::base64encode(children_texts[j])
        }
      }

      need_plot = FALSE

    }





    saved_result <- save_results_to_project(
      project_id ,
      selected_folder = plyr::revalue(structure_to_be_added_folders_only_parents[[i]],old_id_to_new_id_matches),
      files_names = children_file_names,
      files_sources = sources,
      files_sources_data = "not_useful",
      files_types = unlist(structure_to_be_added[[index]]$files_types),
      fold_name = structure_to_be_added[[index]]$text,
      parameters = current_parameter,
      epf_index = structure_to_be_added[[index]]$epf_index
    )
    output_file_time[i] <- saved_result$current_time


    old_id_to_new_id_matches[i] = gsub(substr(old_id_to_new_id_matches[i],nchar(old_id_to_new_id_matches[i])-9,nchar(old_id_to_new_id_matches[i])),output_file_time[i],old_id_to_new_id_matches[i])

    if(need_plot){
      results[[as.character(output_file_time[i])]] = result
    }

  }
  return(results)

  # print(round)
  # # print(being_activated_data_id2)
  # being_activated_data_id2 <- id2[activate_data_ids2 %in% being_activated_data_id2]
  # round <- round + 1

return(TRUE)






}
