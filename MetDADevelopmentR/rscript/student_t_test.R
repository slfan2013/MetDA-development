# result = list(a = defination_of_missing_value)


# http://localhost:5656/ocpu/tmp/x08f655c87c/

pacman::p_load(data.table)


f = read.csv(paste0(
  "http://metda:metda@localhost:5985/metda_project/",
  project_id,
  "/f.csv"
))
p = read.csv(paste0(
  "http://metda:metda@localhost:5985/metda_project/",
  project_id,
  "/p.csv"
))
e = data.matrix(read.csv(
  paste0(
    "http://metda:metda@localhost:5985/metda_project/",
    project_id,
    "/",activate_data_id
  )
))[, -1]

# Summarize the information about missing values.
# data = wcmc::read_data("GCTOF_Abraham_CM_v_M_heart_NoSwim.xlsx")
# e = data$e_matrix
# f = data$f
# p = data$p


## Here, calculate the p-values and FDRs.






groups = factor(p[[treatment_group]])
levels = levels(groups)

alternative = 'two.sided'
p_values = apply(e,1,function(x){
  tryCatch(t.test(x~groups, alternative = alternative, var.equal = equal_variance_assumption)$p.value,error = function(e){return(1)})
})


result = data.table(index = 1:nrow(f), label = f$label, p_values = p_values, p_values_adjusted = p.adjust(p_values, method = fdr))


report_html = paste0("<h4>Student's t test (",ifelse(equal_variance_assumption,"assuming equal variance","not assuming equal variance"),") was performed on each compound to test if the mean average of <code>",levels[1],"</code> ",ifelse(alternative=='two.sided',"different from", ifelse(alternative=='greater', "greater than", "less than")), " <code>", levels[2],"</code>. Out of <code>",nrow(f),"</code> compounds, <code>", sum(result$p_values<0.05,na.rm = TRUE),"</code> are significant with p_value < 0.05. To control the false disvoery rate (FDR), the <code>",fdr,"</code> procedure was used and <code>",sum(result$p_values_adjusted<0.05,na.rm = TRUE),"</code> compounds are significant after FDR correction.</h4>")




# result =list(
#   result = result,
#   report_html =report_html
# )

# result_dataset =  aggregate_p_f_e(p, f, e)
fwrite(result, "summary_data.csv", col.names = TRUE)
# summary_data = data.table(index = 1:nrow(iris), iris)
# fwrite(summary_data, "summary_data.csv", col.names = TRUE)


result = list(results_description = report_html)
















