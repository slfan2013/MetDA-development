# result = list(a = defination_of_missing_value)


# http://localhost:5656/ocpu/tmp/x08f655c87c/

pacman::p_load(data.table)


data = call_fun(parameter = list(project_id=project_id,activate_data_id=activate_data_id,fun_name="read_data_from_projects"))
e = data$e
f = data$f
p = data$p

sample_index = rep(TRUE, ncol(e))
if(subset_by_sample){
  sample_i = 1
  while(paste0(exists(paste0("sample_criterion_data_id__",sample_i)))){
    sample_i = sample_i + 1
  }
  sample_i = sample_i-1
  for(i in 1:sample_i){
    sample_criterion_data = read.csv(paste0(
      "http://metda.fiehnlab.ucdavis.edu/db/metda_project/",
      project_id,
      "/",eval(parse(text = paste0("sample_criterion_data_id__",i)))
    ), stringsAsFactors = FALSE)

    sample_criterion_data = sample_criterion_data[sample_criterion_data$label%in%colnames(e),]

    if(eval(parse(text = paste0("sample_criterion_type__",i))) == 'numeric'){
      sample_index = sample_index & (sample_criterion_data[[eval(parse(text = paste0("sample_criterion_column__",i)))]] > eval(parse(text = paste0("sample_criterion_level_min__",i))) & sample_criterion_data[[eval(parse(text = paste0("sample_criterion_column__",i)))]] < eval(parse(text = paste0("sample_criterion_level_max__",i))))
    }else{
      sample_index = sample_index & sample_criterion_data[[eval(parse(text = paste0("sample_criterion_column__",i)))]]%in%eval(parse(text = paste0("sample_criterion_level__",i)))
    }



  }
}

compound_index = rep(TRUE, nrow(e))
if(subset_by_compound){
  compound_i = 1
  while(paste0(exists(paste0("compound_criterion_data_id__",compound_i)))){
    compound_i = compound_i + 1
  }
  compound_i = compound_i-1
  for(i in 1:compound_i){
    compound_criterion_data = read.csv(paste0(
      "http://metda.fiehnlab.ucdavis.edu/db/metda_project/",
      project_id,
      "/",eval(parse(text = paste0("compound_criterion_data_id__",i)))
    ), stringsAsFactors = FALSE)


    compound_criterion_data = compound_criterion_data[compound_criterion_data$label%in%rownames(e),]

    if(eval(parse(text = paste0("compound_criterion_type__",i))) == 'numeric'){
      compound_index = compound_index & (compound_criterion_data[[eval(parse(text = paste0("compound_criterion_column__",i)))]] > eval(parse(text = paste0("compound_criterion_level_min__",i))) & compound_criterion_data[[eval(parse(text = paste0("compound_criterion_column__",i)))]] < eval(parse(text = paste0("compound_criterion_level_max__",i))))
    }else{
      compound_index = compound_index & compound_criterion_data[[eval(parse(text = paste0("compound_criterion_column__",i)))]]%in%eval(parse(text = paste0("compound_criterion_level__",i)))
    }


  }
}

e_subset = e[compound_index,sample_index]


write.csv(e_subset, "data_subsetting.csv", col.names = TRUE, row.names = TRUE)


result = list(results_description = "This is data_subsetting result.")











