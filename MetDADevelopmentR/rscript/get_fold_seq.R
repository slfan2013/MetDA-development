# get_fold_seq = function(project_id, file_id){
  projectUrl <- URLencode(paste0("http://metda.fiehnlab.ucdavis.edu/db/metda_project/", project_id))
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


  fold_seq = unique(fold_seq)


  fold_seq_folders = paste0(fold_seq[1:(length(fold_seq)-length(file_id))], collapse = " -> ")

  fold_seq_files = paste0(fold_seq[((length(fold_seq)-length(file_id))+1):length(fold_seq)], collapse = " & ")


  result = paste0(fold_seq_folders, " -> ", fold_seq_files)
  # result = sapply(by(fold_seq, rep(unlist(file_id)[1:length(file_id)], (length(fold_seq)/length(file_id))), function(x) x, simplify = T), function(x) as.character(x), simplify = F)




# }
