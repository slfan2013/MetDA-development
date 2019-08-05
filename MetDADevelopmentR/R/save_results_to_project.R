save_results_to_project <- function(project_id = "aaa1560462496",
                                    selected_folder = "aaa1560462496",
                                    files_names = c("missing_value_imputation_result_dataset.csv", "missing_value_imputation_result_summary.csv"),
                                    files_sources = c("http://localhost:5656/ocpu/tmp/x0009da5b92/files/result_dataset.csv", "http://localhost:5656/ocpu/tmp/x0009da5b92/files/summary_data.csv"),
                                    files_sources_data = c("http://localhost:5656/ocpu/tmp/x0009da5b92/files/result_dataset.csv", "http://localhost:5656/ocpu/tmp/x0009da5b92/files/summary_data.csv"),
                                    files_types = c("application/vnd.ms-excel", "application/vnd.ms-excel"),
                                    fold_name = "Missing Value Imputation",
                                    parameters = '"defination_of_missing_value":["empty cells"],"defination_of_missing_value_values_less_than":"","defination_of_missing_other_than":"","remove_missing_values_more_than":"on","remove_missing_values_more_than_value":"50","missing_value_imputation_method":"replace by half minimum","project_id":"dadfasfdas1560556027","fun_name":"missing_value_imputation"',
                                    epf_index = c(1)) {
  save(project_id, selected_folder, files_names, files_sources, files_types, fold_name, parameters, epf_index, files_sources_data, file = "test.RData")

  load('test.RData')
  if (class(files_sources_data) %in% c("list",'data.frame')) { # this means this is localhost.https://github.com/opencpu/opencpu/issues/345
    for (file_source in 1:length(files_sources_data)) {
      if (is.null(ncol(files_sources_data[[file_source]]))) { # this means this is a base6 (pca score plot)

      } else {
        if (ncol(files_sources_data[[file_source]]) > 1) {
          data.table::fwrite(files_sources_data[[file_source]], files_names[file_source])
        } else {
          stop("CHECK HERE. I FORGOT WHAT THIS ELSE IS DOING.")

          current_string <- paste0(files_sources_data[[file_source]][1:nrow(files_sources_data[[file_source]]), ], collapse = "\n")


          if (file_source %in% epf_index) {
            data.table::fwrite(data.table::fread(text = current_string), files_names[file_source], col.names = FALSE)

            inputFile(files_names[file_source])

            e <- read.csv("e.csv")[, -1]
            rownames(e) <- read.csv("f.csv")$label

            data.table::fwrite(e, files_names[file_source], col.names = TRUE, row.names = TRUE)
          } else {
            data.table::fwrite(data.table::fread(text = current_string), files_names[file_source], col.names = FALSE)
          }
        }
      }
    }
  } else {
    if (!identical(names(files_sources)[1],'quick_analysis')) {
      # !!! base64 (pca score plot) may not work for this.
      for (file_source in 1:length(files_sources)) {
        download.file(URLencode(files_sources[file_source]), files_names[file_source], mode = "wb")
      }
    } else { # this means it is from the perform_quick_analysis.
      for (file_source in 1:length(files_sources)) {

        if (nchar(files_sources[file_source])>100) { # this means this is a base6 (pca score plot)。 Maybe there can be a better criterion.




        }else{
          dta <- data.table::fread(files_sources[file_source])
          if (colnames(dta)[1] == "V1") { # this means that the first column of the csv is the rownames of the data.
            rownames(dta) <- dta$V1
            # dta[,V1:=NULL]
            dta$V1 <- NULL
            data.table::fwrite(dta, files_names[file_source], row.names = TRUE, col.names = TRUE)
          } else {
            data.table::fwrite(dta, files_names[file_source], row.names = FALSE, col.names = TRUE)
          }
        }






      }
    }
  }


  # 2 put the attachments
  projectUrl <- URLencode(paste0("http://metda:metda@localhost:5985/metda_project/", project_id))
  projectList <- jsonlite::fromJSON(projectUrl, simplifyVector = FALSE)

  current_time <- as.integer(Sys.time())

  suffix <- paste0(".", sapply(files_names, function(x) {
    tail(strsplit(x, "\\.")[[1]], n = 1)
  }))
  files_names_without_suffix <- sapply(1:length(files_names), function(i) {
    gsub(suffix[i], "", files_names[i])
  })


  attachments_ids <- paste0(files_names_without_suffix, current_time, suffix)

  # stringr::str_replace(string = c("abc","abc"), pattern = c("a","b"), replacement = "")

  for (file_source in 1:length(files_names)) {
    if(grepl(".svg|.png|.zip",files_names[file_source])){
      projectList$`_attachments`[[attachments_ids[file_source]]] <- list(
        content_type = files_types[file_source],
        data =
          files_sources[file_source]
          # strsplit(markdown:::.b64EncodeFile(files_names[1]), "base64,")[[1]][2]
        # paste0("'data:image/svg+xml;base64,'",files_sources[file_source])
      )
    }else{
      projectList$`_attachments`[[attachments_ids[file_source]]] <- list(
        content_type = files_types[file_source],
        data = strsplit(markdown:::.b64EncodeFile(files_names[file_source]), "base64,")[[1]][2]
      )
    }
  }


  # 3 update tree
  project_structure <- projectList$project_structure
  # folder_id <- paste0(fold_name, current_time)


  from_fun_name_to_folder_id = c("fold_change"="Fold Change","heatmap" = "Heatmap", "boxplot" = "Boxplot", "pca" = "PCA", "missing_value_imputation" = 'Missing Value Imputation', "student_t_test" = "Student t-test")

  folder_id = paste0(plyr::revalue(parameters$fun_name,from_fun_name_to_folder_id), current_time)


  # check if the fold_name is taken.




  project_structure[[length(project_structure) + 1]] <- list(
    id = folder_id,
    parent = selected_folder,
    text = fold_name,
    icon = "fa fa-folder",
    parameter = parameters,
    files_sources = files_sources,
    files_types = files_types,
    epf_index = epf_index
  )


  for (file_source in 1:length(files_sources)) {
    parameters_for_chilren = list()
    parameters_for_chilren$activate_data_id= parameters$activate_data_id # this will be used in the quick analysis line 45
    project_structure[[length(project_structure) + 1]] <- list(
      id = attachments_ids[file_source],
      parent = folder_id,
      text = files_names[file_source],
      icon = plyr::revalue(files_types[file_source], c("application/vnd.ms-excel" = "fa fa-file-excel-o","image/svg+xml"="fa fa-file-image-o","application/x-zip-compressed" = "file-archive-o")),
      with_attachment = TRUE,
      parameter = parameters_for_chilren
      # since the parameters are already saved in the folder. We may do not need to save it in these children.
    )

    if (file_source %in% epf_index) {
      project_structure[[length(project_structure)]]$epf <- "e"
    }
  }
  projectList$project_structure <- project_structure
  #
  #
  #
  RCurl::getURL(projectUrl, customrequest = "PUT", httpheader = c("Content-Type" = "application/json"), postfields = jsonlite::toJSON(projectList, auto_unbox = TRUE, force = TRUE))
  return(list(status = TRUE, current_time = current_time))
  return(TRUE)
}
