# result = list(a = defination_of_missing_value)


# http://localhost:5656/ocpu/tmp/x08f655c87c/

pacman::p_load(data.table, missForest, tmvtnorm, magrittr)


data = call_fun(parameter = list(project_id=project_id,activate_data_id=activate_data_id,fun_name="read_data_from_projects"))
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
write.csv(result_dataset, "e.csv", col.names = TRUE, row.names = TRUE)

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



report_html = call_fun(parameter = list(
  defination_of_missing_other_than = defination_of_missing_other_than,
  defination_of_missing_value = defination_of_missing_value,
  defination_of_missing_value_values_less_than = defination_of_missing_value_values_less_than,
  missing_value_imputation_method = missing_value_imputation_method,
  remove_missing_values_more_than = remove_missing_values_more_than,
  remove_missing_values_more_than_value = remove_missing_values_more_than_value,
  summary_data = summary_data,
  type = "result_summary",
  fun_name = "report_missing_value_imputation"
))$text_html



result = list(results_description = report_html)















