get_compound_sample_info = function(project_id="statistics21565892249"){



  projectUrl <- URLencode(paste0("http://metda.fiehnlab.ucdavis.edu/db/metda_project/", project_id))
  projectList <- jsonlite::fromJSON(projectUrl, simplifyVector = T)
  result = projectList$project_structure



  sample_id = result$id[result$subset %in% 'sample']
  sample_related_info = list()
  for(i in 1:length(sample_id)){
    temp_data = read.csv(
      paste0(
        "http://metda.fiehnlab.ucdavis.edu/db/metda_project/",
        project_id,
        "/", sample_id[i]
      ),
      row.names = 1
    )

    sample_related_info[[sample_id[i]]] <- list(
      id = sample_id[i],
      text = paste0(call_fun(parameter = list(project_id=project_id, file_id = sample_id[i], fun_name="get_fold_seq"))[[1]], collapse = "->"),
      column_names = colnames(temp_data),
      column_levels = sapply(temp_data, unique, simplify = FALSE),
      column_type = sapply(temp_data, function(x){
        if(class(x) %in% c('factor','character')){
          return('character')
        }else{
          return('numeric')
        }
      }, simplify = FALSE)
    )
  }



  compound_id = result$id[result$subset %in% 'compound']
  compound_related_info = list()
  for(i in 1:length(compound_id)){
    temp_data = read.csv(
      paste0(
        "http://metda.fiehnlab.ucdavis.edu/db/metda_project/",
        project_id,
        "/", compound_id[i]
      ),
      row.names = 1
    )

    compound_related_info[[compound_id[i]]] <- list(
      id = compound_id[i],
      text = paste0(call_fun(parameter = list(project_id=project_id, file_id = compound_id[i], fun_name="get_fold_seq"))[[1]], collapse = "->"),
      column_names = colnames(temp_data),
      column_levels = sapply(temp_data, unique, simplify = FALSE),
      column_type = sapply(temp_data, function(x){
        if(class(x) %in% c('factor','character')){
          return('character')
        }else{
          return('numeric')
        }
      }, simplify = FALSE)
    )
  }

  return(list(sample_related_info = sample_related_info, compound_related_info= compound_related_info))






}
