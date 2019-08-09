update_tree_structure = function(project_id, project_structure){

  save(project_id, project_structure, file = "update_tree_structure.RData")

  load("update_tree_structure.RData")
  projectUrl <- URLencode(paste0("http://metda:metda@localhost:5985/metda_project/", project_id))
  projectList <- jsonlite::fromJSON(projectUrl, simplifyVector = F)




  for(i in 1:length(projectList$project_structure)){
    projectList$project_structure[[i]]$text = project_structure$text[i]
  }







  RCurl::getURL(projectUrl, customrequest = "PUT", httpheader = c("Content-Type" = "application/json"), postfields = jsonlite::toJSON(projectList, auto_unbox = TRUE, force = TRUE))


  return(project_structure)

  return(TRUE)


}
