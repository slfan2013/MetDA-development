get_fold_seq = function(project_id, file_id){
  projectUrl <- URLencode(paste0("http://metda:metda@localhost:5985/metda_project/", project_id))
  projectList <- jsonlite::fromJSON(projectUrl, simplifyVector = T)
  id <- projectList$project_structure$id
  parent <- projectList$project_structure$parent
  text <- projectList$project_structure$text
  needed_id <- file_id
  active_id <- file_id
  while (length(active_id) > 0) {
    active_id <- parent[which(id %in% active_id)]
    needed_id <- c(needed_id, active_id)
  }
  fold_seq <- text[match(needed_id, id)]
  fold_seq <- rev(fold_seq[!is.na(fold_seq)])
  return(fold_seq)
}
