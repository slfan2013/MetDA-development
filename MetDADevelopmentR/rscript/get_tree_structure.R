# get_tree_structure = function(project_id = "report 11565112203"){
  projectUrl <- URLencode(paste0("http://metda:metda@localhost:5985/metda_project/", project_id))
  projectList <- jsonlite::fromJSON(projectUrl, simplifyVector = T)

  result = projectList$project_structure


# }
