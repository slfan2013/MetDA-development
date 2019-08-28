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
  tryCatch(wilcox.test(x~groups, alternative = alternative,)$p.value,error = function(e){return(1)})
})


result = data.table(index = 1:nrow(f), label = f$label, p_values = p_values, p_values_adjusted = p.adjust(p_values, method = fdr))



report_html = call_fun(parameter = list(
  treatment_group = treatment_group,
  type = "result_summary",
  fdr = fdr,
  result = result,
  levels = levels,
  alternative = "two.sided",
  doc = NULL,
  type = "result_summary",
  fun_name = "report_mann_whitney_u_test"
))$text_html





# result =list(
#   result = result,
#   report_html =report_html
# )

# result_dataset =  aggregate_p_f_e(p, f, e)
fwrite(result, "mann_whitney_u_test.csv", col.names = TRUE)

result = list(results_description = report_html)











