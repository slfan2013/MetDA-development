open_project_structure_to_select_p_value_and_fold_change = function(
  project_id = "test volcano1565046464"
){
  save(project_id, file = "open_project_structure_to_select_p_value_and_fold_change.RData")

  projectList <- jsonlite::fromJSON(URLencode(
    paste0(
      "http://metda.fiehnlab.ucdavis.edu/db/metda_project/",
      project_id
    )
  ),simplifyVector = FALSE)


  project_structure = projectList$project_structure


  functions = sapply(project_structure, function(x){
    x$parameter$fun_name
  })
  icons = sapply(project_structure, function(x){
    x$icon
  })

  # epf = sapply(project_structure,function(x){x$epf})
  id = sapply(project_structure,function(x){x$id})
  parent = sapply(project_structure,function(x){x$parent})



  p_val_folder_id = id[functions %in% c("student_t_test","mann_whitney_u_test)")]
  p_val_needed_id = id[functions %in% c("student_t_test","mann_whitney_u_test)")]
  p_val_parents = parent[functions %in% c("student_t_test","mann_whitney_u_test)")]

  fold_change_folder_id = id[functions %in% "fold_change"]
  fold_change_needed_id = id[functions %in% "fold_change"]
  fold_change_parents = parent[functions %in% "fold_change"]

  while(length(p_val_parents)>0){
    p_val_needed_id = c(p_val_needed_id, p_val_parents)
    p_val_parents = parent[id %in% p_val_parents]
  }



  while(length(fold_change_parents)>0){
    fold_change_needed_id = c(fold_change_needed_id, fold_change_parents)
    fold_change_parents = parent[id %in% fold_change_parents]
  }


  p_val_needed_id = c(p_val_needed_id, sapply(project_structure[parent %in% p_val_folder_id & icons %in% 'fa fa-file-excel-o'],function(x) x$id))

  fold_change_needed_id = c(fold_change_needed_id, sapply(project_structure[parent %in% fold_change_folder_id & icons %in% 'fa fa-file-excel-o'], function(x) x$id))


  p_val_project_structure = project_structure[id %in% p_val_needed_id]
  fold_change_project_structure = project_structure[id %in% fold_change_needed_id]



  return(list(p_val_project_structure = p_val_project_structure, fold_change_project_structure = fold_change_project_structure))

  # return(TRUE)



}
