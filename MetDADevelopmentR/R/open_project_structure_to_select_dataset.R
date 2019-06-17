open_project_structure_to_select_dataset = function(
  project_id = "new project31560542628",
  selected_data = ""
  ){


  projectList <- jsonlite::fromJSON(URLencode(
    paste0(
      "http://metda:metda@localhost:5985/metda_project/",
      project_id
    )
  ),simplifyVector = FALSE)


  project_structure = projectList$project_structure


  epf = sapply(project_structure,function(x){x$epf})
  id = sapply(project_structure,function(x){x$id})
  parent = sapply(project_structure,function(x){x$parent})



  needed_id = id[epf %in% "e"]
  parents = parent[epf %in% "e"]

  while(length(parents)>0){

    needed_id = c(needed_id, parents)

    parents = parent[id %in% parents]


  }

  if(selected_data == ""){
    result_project_structure = project_structure[id %in% needed_id]
  }else{
    result_project_structure = project_structure[id %in% needed_id]

    result_project_structure[[which(id %in% selected_data)]]$state = list(
      opened = TRUE,
      selected = TRUE
    )


  }

  return(result_project_structure)



}
