get_tree_structure = function(project_id = "report 11565112203"){
  projectUrl <- URLencode(paste0("http://metda.fiehnlab.ucdavis.edu/db/metda_project/", project_id))
  projectList <- jsonlite::fromJSON(projectUrl, simplifyVector = T)

  return(projectList$project_structure)


}
