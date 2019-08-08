# result = list(a = defination_of_missing_value)


# http://localhost:5656/ocpu/tmp/x08f655c87c/

pacman::p_load(data.table, missForest, tmvtnorm, magrittr)


data = read_data_from_projects(project_id, activate_data_id)
e = data$e
f = data$f
p = data$p

# Summarize the information about missing values.
# data = wcmc::read_data("GCTOF_Abraham_CM_v_M_heart_NoSwim.xlsx")
# e = data$e_matrix
# f = data$f
# p = data$p

summary = list()
## Here, we want to replace missing values.

summary[["empty cells"]] = apply(e,1,function(x){
  sum(is.na(x))
})

if('zeros' %in% defination_of_missing_value){
  summary[["zeros"]] = apply(e,1,function(x){
    sum(x==0, na.rm = TRUE)
  })
  e[e==0] = NA
}
if('negative values' %in% defination_of_missing_value){
  summary[["negative values"]] = apply(e,1,function(x){
    sum(x==0, na.rm = TRUE)
  })
  e[e<0] = NA
}
if('characters' %in% defination_of_missing_value){
  summary[["characters"]] = apply(e,1,function(x){
    sum(is.na(as.numeric(x[!is.na(x)])))
  })
  e[is.na(as.numeric(e))] = NA
}
defination_of_missing_value_values_less_than = as.numeric(defination_of_missing_value_values_less_than)
if('values less than ...' %in% defination_of_missing_value){
  summary[[gsub("\\.\\.\\.",defination_of_missing_value_values_less_than,"values less than ...")]] = apply(e,1,function(x){
    sum(x < defination_of_missing_value_values_less_than, na.rm = TRUE)
  })
  e[ e < defination_of_missing_value_values_less_than] = NA
}

# remove too many missing value compounds.

if(remove_missing_values_more_than){
  temp_missing_count = as.numeric(remove_missing_values_more_than_value)/100 * ncol(e)
  e_imp = e[apply(e, 1, function(x){
    sum(is.na(x))<temp_missing_count
  }), ]
}else{
  e_imp = e
}


# remove too many missing value compounds.
if(missing_value_imputation_method %in% c("replace by half minimum", "replace by 1/10 minimum", "replace by minimum", "replace by mean", "replace by median")){

  if(grepl("minimum",missing_value_imputation_method)){
    key_fun = min

    if(grepl("half",missing_value_imputation_method)){
      coef = 0.5
    }else if(grepl("1/10",missing_value_imputation_method)){
      coef = 0.1
    }else{
      coef = 1
    }

  }else if(grepl("mean",missing_value_imputation_method)){
    key_fun = mean
    coef = 1
  }else if(grepl("median",missing_value_imputation_method)){
    key_fun = median
    coef = 1
  }

  e_imp = t(apply(e_imp, 1, function(x){
    temp_NA_index  = is.na(x)
    temp_num_NA = sum(temp_NA_index)
    if(temp_num_NA){
      temp_mean = key_fun(x, na.rm = TRUE)
      x[temp_NA_index] = rnorm(temp_num_NA, mean = coef * temp_mean, sd = temp_mean/10)
    }
    return(x)
  }))
}else if(missing_value_imputation_method %in% "imputed by kNN"){
  e_imp<-t(impute::impute.knn(t(e_imp))$data)
}else if(grepl("BPCA", missing_value_imputation_method)){
  e_imp<-pcaMethods::pca(e_imp, nPcs = 5, method="bpca", center=T)@completeObs;
}else if(grepl("PPCA", missing_value_imputation_method)){
  e_imp<-pcaMethods::pca(e_imp, nPcs = 5, method="ppca", center=T)@completeObs;
}else if(grepl("SVD", missing_value_imputation_method)){
  e_imp<-pcaMethods::pca(e_imp, nPcs = 5, method="svdImpute", center=T)@completeObs;
}else if(missing_value_imputation_method == 'missForest'){
  e_imp <- t(missForest(data.table(t(e_imp)))[[1]])
}else if(missing_value_imputation_method == "QRILC"){
  e_imp[e_imp==0]=1
  e_imp <- t(data.frame(t(e_imp)) %>% log %>% impute.QRILC.moderate %>% extract2(1) %>% exp)
}

# we should only save the e.csv
# result_dataset =  aggregate_p_f_e(p, f, e)
rownames_e_imp = rownames(e_imp)
e_imp = data.frame(e_imp)
colnames(e_imp) = p$label
rownames(e_imp) = rownames_e_imp
result_dataset = e_imp
fwrite(result_dataset, "result_dataset.csv", col.names = TRUE, row.names = TRUE)

summary_data = data.table(label = rownames(e))
summary_data_matrix = do.call("cbind",summary)
summary_data_total = apply(summary_data_matrix, 1, sum, na.rm = TRUE)
summary_data = cbind(summary_data, summary_data_matrix)
summary_data = data.frame(summary_data)
summary_data$total = summary_data_total
summary_data$excluded = rep("No", nrow(summary_data))
summary_data$excluded[!rownames(e) %in% rownames_e_imp] = "Yes"

summary_data = data.table(index = 1:nrow(summary_data), summary_data)
fwrite(summary_data, "summary_data.csv", col.names = TRUE)




if(grepl("temp_project_", project_id)){ # this means this is in and out, and we need to put everything to the metda_project so that the report generaters can make reports.


  # RCurl::base64Encode(readBin('temp_e.csv', "raw", file.info('temp_e.csv')[1, "size"]), "txt")
  # RCurl::base64Encode(readBin(paste0(filename, suffix), "raw", file.info(paste0(filename, suffix))[1, "size"]), "txt")

  projectUrl <- URLencode(paste0("http://metda:metda@localhost:5985/metda_project/", project_id))
  projectList <- jsonlite::fromJSON(projectUrl, simplifyVector = T)
  temp_time = substr(project_id, nchar(project_id)-10+1, nchar(project_id))

  fold_id = paste0("Missing Value Imputation", temp_time)
  data1_id = "result_dataset.csv"
  data2_id = "summary_data.csv"

  projectList[["project_structure"]] <- list(
    list(
      id = project_id,
      parent = "#",
      text = "",
      icon = "fa fa-folder"
    ),
    list(
      id = "e.csv",
      parent = project_id,
      text = "e.csv",
      icon = "fa fa-file-excel-o",
      with_attachment = TRUE,
      epf = "e",
      parameter = list(
        r_function = "create_new_project",
        parameters = ""
      )
    ),
    list(
      id = "f.csv",
      parent = project_id,
      text = "f.csv",
      icon = "fa fa-file-excel-o",
      with_attachment = TRUE,
      epf = "f",
      parameter = list(
        r_function = "create_new_project",
        parameters = ""
      )
    ),
    list(
      id = "p.csv",
      parent = project_id,
      text = "p.csv",
      icon = "fa fa-file-excel-o",
      with_attachment = TRUE,
      epf = "p",
      parameter = list(
        r_function = "create_new_project",
        parameters = ""
      )
    ),
    list(
      id = fold_id,
      parent = project_id,
      text = "Missing Value Imputation",
      icon = "fa fa-folder",
      with_attachment = TRUE,
      epf = "p",
      parameter = list(
        defination_of_missing_value = defination_of_missing_value,
        defination_of_missing_value_values_less_than = defination_of_missing_value_values_less_than,
        defination_of_missing_other_than = defination_of_missing_other_than,
        remove_missing_values_more_than_value = remove_missing_values_more_than_value,
        missing_value_imputation_method = missing_value_imputation_method,
        remove_missing_values_more_than = remove_missing_values_more_than,
        project_id = project_id,
        fun_name = fun_name,
        activate_data_id = activate_data_id
      ),
      files_sources = "",
      files_types = "",
      epf_index = 1
    ),
    list(
      id = data1_id,
      parent = fold_id,
      text = "result dataset.csv",
      icon = "fa fa-file-excel-o",
      with_attachment = TRUE,
      epf = "e",
      parameter = list(
        activate_data_id= "e.csv"
      )
    ),
    list(
      id = data2_id,
      parent = fold_id,
      text = "result summary.csv",
      icon = "fa fa-file-excel-o",
      with_attachment = TRUE,
      parameter = list(
        activate_data_id= "e.csv"
      )
    )
  )

  attname = c('p.csv', 'f.csv', 'e.csv', data1_id, data2_id)
  write.csv(p, 'p.csv')
  write.csv(f, 'f.csv')
  write.csv(e, 'e.csv')
  content_types = c("application/vnd.ms-excel","application/vnd.ms-excel","application/vnd.ms-excel","application/vnd.ms-excel","application/vnd.ms-excel")
  projectList[["_attachments"]] <- list()
  for (i in 1:length(attname)) {
    projectList[["_attachments"]][[attname[i]]] <- list(
      content_type = content_types[i],
      data = strsplit(markdown:::.b64EncodeFile(attname[i]), "base64,")[[1]][2]
    )
  }
  RCurl::getURL(projectUrl, customrequest = "PUT", httpheader = c("Content-Type" = "application/json"), postfields = jsonlite::toJSON(projectList, auto_unbox = TRUE, force = TRUE))

  report_missing_value_imputation(project_id, fold_id)

  filename = "report_missing_value_imputation"
  suffix = '.docx'

  result = list(results_description = paste0(nrow(e) - nrow(e_imp), " compounds excluded."), report_base64 = as.character(RCurl::base64Encode(readBin(paste0(filename, suffix), "raw", file.info(paste0(filename, suffix))[1, "size"]), "txt")))
}else{
  result = list(results_description = paste0(nrow(e) - nrow(e_imp), " compounds excluded."))
}
















