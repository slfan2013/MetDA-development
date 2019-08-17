# result = list(a = defination_of_missing_value)


# http://localhost:5656/ocpu/tmp/x08f655c87c/

pacman::p_load(data.table)


data = call_fun(parameter = list(project_id=project_id,activate_data_id=activate_data_id,fun_name="read_data_from_projects"))
e = data$e
f = data$f
p = data$p

groups = factor(p[[treatment_group]])
levels = levels(groups)

if(!length(levels)==2){
  stop(paste0("The Treatment Group (",treatment_group,") you've selected has more (or less) than 2 level(s). It has ",length(levels)," level(s)."))
}

alternative = 'two.sided'
p_values = apply(e,1,function(x){
  tryCatch(t.test(x~groups, alternative = alternative, var.equal = equal_variance_assumption)$p.value,error = function(e){return(1)})
})


result = data.table(index = 1:nrow(f), label = f$label, p_values = p_values, p_values_adjusted = p.adjust(p_values, method = fdr))


# report_html = paste0("<h4>Student's t test (",ifelse(equal_variance_assumption,"assuming equal variance","not assuming equal variance"),") was performed on each compound to test if the mean average of <code>",levels[1],"</code> ",ifelse(alternative=='two.sided',"different from", ifelse(alternative=='greater', "greater than", "less than")), " <code>", levels[2],"</code>. Out of <code>",nrow(f),"</code> compounds, <code>", sum(result$p_values<0.05,na.rm = TRUE),"</code> are significant with p_value < 0.05. To control the false disvoery rate (FDR), the <code>",fdr,"</code> procedure was used and <code>",sum(result$p_values_adjusted<0.05,na.rm = TRUE),"</code> compounds are significant after FDR correction.</h4>")

# report_html = report_student_t_test(treatment_group,equal_variance_assumption,type = "result_summary",fdr,result,levels,alternative = "two.sided",doc = NULL, table_index = 1,figure_index = 1)$text_html

report_html = call_fun(parameter = list(
  treatment_group = treatment_group,
  equal_variance_assumption = equal_variance_assumption,
  type = "result_summary",
  fdr = fdr,
  result = result,
  levels = levels,
  alternative = "two.sided",
  fun_name = "report_student_t_test"
))$text_html

if(grepl("temp_project_",project_id)){
  # report_html = ""
}




# result =list(
#   result = result,
#   report_html =report_html
# )

# result_dataset =  aggregate_p_f_e(p, f, e)
fwrite(result, "student_t_test.csv", col.names = TRUE)

result = list(results_description = report_html)











