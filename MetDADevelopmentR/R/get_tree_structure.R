get_tree_structure = function(project_id = "a11564608959"){
  projectUrl <- URLencode(paste0("http://metda:metda@localhost:5985/metda_project/", project_id))
  projectList <- jsonlite::fromJSON(projectUrl, simplifyVector = T)


  return(projectList$project_structure)


}
