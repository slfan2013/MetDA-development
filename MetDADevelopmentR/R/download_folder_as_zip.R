download_folder_as_zip = function(
  project_id="a11564608959",
  id = c("a11564608959", "e.csv", "f.csv", "p.csv"),
  path = c("a1", "a1/e.csv", "a1/f.csv", "a1/p.csv")){


  save(project_id, id, path, file = "download_folder_as_zip.RData")

  load("download_folder_as_zip.RData")
  downloadFileName = paste0(path[1],".zip")



  projectUrl <- URLencode(paste0("http://metda:metda@localhost:5985/metda_project/", project_id))
  project = jsonlite::fromJSON(projectUrl, simplifyVector = F)


  project_structure_id = sapply(project$project_structure, function(x) x$id)





  fold_index = sapply(project$project_structure[match(id, project_structure_id)], function(x) x$icon)=="fa fa-folder"


  for(i in 1:length(id)){
    if(fold_index[i]){ # this means that the ith element is a folder.
      dir.create(path[i],recursive = T, showWarnings  = F)
    }else{ # this means that the ith element is a file.
      download.file(URLencode(paste0("http://metda:metda@localhost:5985/metda_project/",project_id,"/",gsub("\\+","%2B",id[i]))),path[i],mode = 'wb')
    }
  }

  zip(zipfile = downloadFileName, files = path[1])



  return(downloadFileName)
  return(TRUE)


}
