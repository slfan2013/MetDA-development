save_results_to_project <- function(project_id = "dadfasfdas1560556027",
                                    selected_folder = "dadfasfdas1560556027",
                                    files_names = c("missing_value_imputation_result_dataset.csv", "missing_value_imputation_result_summary.csv"),
                                    files_sources = c("http://localhost:5656/ocpu/tmp/x0f07610ed4/files/result_dataset.csv", "http://localhost:5656/ocpu/tmp/x0f07610ed4/files/summary_data.csv"),
                                    files_types = c("application/vnd.ms-excel","application/vnd.ms-excel"),
                                    fold_name = "Missing Value Imputation",
                                    parameters = '"defination_of_missing_value":["empty cells"],"defination_of_missing_value_values_less_than":"","defination_of_missing_other_than":"","remove_missing_values_more_than":"on","remove_missing_values_more_than_value":"50","missing_value_imputation_method":"replace by half minimum","project_id":"dadfasfdas1560556027","fun_name":"missing_value_imputation"',
                                    epf_index = c(1)) {

save(project_id, selected_folder, files_names, files_sources, files_types, fold_name, parameters, epf_index, file = "test.RData")
if(class(files_sources) == "list"){# this means this is localhost.https://github.com/opencpu/opencpu/issues/345
  for(file_source in 1:length(files_sources)){
    data.table::fwrite(files_sources[[file_source]],files_names[file_source])
    # download.file(URLencode(files_sources[file_source]),files_names[file_source],mode = 'wb')
  }
}else{
  # 1 download all the results.
  for(file_source in 1:length(files_sources)){
    download.file(URLencode(files_sources[file_source]),files_names[file_source],mode = 'wb')
  }
}


  # 2 put the attachments
  projectUrl <- URLencode(paste0("http://metda:metda@localhost:5985/metda_project/", project_id))
  projectList <- jsonlite::fromJSON(projectUrl, simplifyVector = FALSE)

  current_time = as.integer(Sys.time())
  attachments_ids = paste0(files_names, current_time)
  for(file_source in 1:length(files_sources)){
    projectList$`_attachments`[[attachments_ids[file_source]]] = list(
      content_type = files_types[file_source],
      data = strsplit(markdown:::.b64EncodeFile(files_names[file_source]), "base64,")[[1]][2]
    )
  }


  # 3 update tree
  project_structure = projectList$project_structure
  folder_id = paste0(fold_name,current_time)
  project_structure[[length(project_structure)+1]] = list(
    id = folder_id,
    parent = selected_folder,
    text = fold_name,
    icon = "fa fa-folder",
    parameter = parameters
  )

  for(file_source in 1:length(files_sources)){

    project_structure[[length(project_structure)+1]] = list(
      id = attachments_ids[file_source],
      parent = folder_id,
      text = files_names[file_source],
      icon = revalue(files_types[file_source],c("application/vnd.ms-excel"),c("fa fa-file-excel-o")),
      with_attachment = TRUE,
      parameter = parameters
    )

    if(file_source%in%epf_index){
      project_structure[[length(project_structure)]]$epf = "e"
    }



  }
  projectList$project_structure = project_structure



  RCurl::getURL(projectUrl, customrequest = "PUT", httpheader = c("Content-Type" = "application/json"), postfields = jsonlite::toJSON(projectList, auto_unbox = TRUE, force = TRUE))
  return(TRUE)


}
