# result = list(a = defination_of_missing_value)


# http://localhost:5656/ocpu/tmp/x08f655c87c/

pacman::p_load(data.table)


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
if('zeros' %in% defination_of_missing_value){
  summary[["zeros"]] = apply(e,1,function(x){
    sum(x==0)
  })
  e[e==0] = NA
}
if('negative values' %in% defination_of_missing_value){
  e[e<0] = NA
}

# we should only save the e.csv
# result_dataset =  aggregate_p_f_e(p, f, e)
e = data.table(e)
colnames(e) = p$label
rownames(e) = f$label
result_dataset = e
fwrite(result_dataset, "result_dataset.csv", col.names = TRUE, row.names = TRUE)
summary_data = data.table(index = 1:nrow(iris), iris)
fwrite(summary_data, "summary_data.csv", col.names = TRUE)


result = list(results_description = "Here is the missing value summary.")
