# result = list(a = defination_of_missing_value)


# http://localhost:5656/ocpu/tmp/x08f655c87c/

pacman::p_load(data.table)


data = call_fun(parameter = list(project_id=project_id,activate_data_id=activate_data_id,fun_name="read_data_from_projects"))
e = data$e
f = data$f
p = data$p



if(method == "log10"){
  result = log((e + sqrt(e^2 + 4)) * 0.5, base  = 10)
}else if(method == "log2"){
  result = log((e + sqrt(e^2 + 4)) * 0.5, base  = 2)
}else if(method == "square root"){
  result = e^(1/2)
}else if(method == "cubic root"){
  result = e^(1/3)
}else{ # boxcox


  if(length(treatment_group)==0){
    stop("For boxcox method, please select at least one Treatment Group.")
  }
  mins = apply(e,1,min,na.rm = TRUE)
  result = e-(mins-1)

  lambdas = apply(result,1,function(x){

    # for(i in 1:nrow(e)){
    # x = e[i,]
    dta = data.table(x,p[,treatment_group])
    bc = tryCatch({boxcox(x ~ ., data = dta, plotit = FALSE)}, error = function(error){
      return(list(y =1,x = 1))
    })
    lambda = bc$x[which.max(bc$y)]
    # }

    return(lambda)
  })

  for(i in 1:nrow(result)){
    if(lambdas[i] == 0){
      result[i,] = log(result[i,] + 0)
    }else{
      result[i,] = (((result[i,] + 0)^lambdas[i] ) - 1) / lambdas[i]
    }
  }

  result = result+(mins-1)

}
e_tran = result

rownames_e_tran = rownames(e_tran)
e_tran = data.frame(e_tran)
colnames(e_tran) = p$label
rownames(e_tran) = rownames_e_tran
result_dataset = e_tran
write.csv(result_dataset, "e.csv", col.names = TRUE, row.names = TRUE)





report_html = call_fun(parameter = list(
  method = method,
  treatment_group = treatment_group,
  type = "result_summary",
  result = result,
  doc = NULL,
  type = "result_summary",
  fun_name = "report_data_transformation"
))$text_html


result = list(results_description = report_html)











