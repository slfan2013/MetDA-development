# result = list(a = defination_of_missing_value)


# http://localhost:5656/ocpu/tmp/x08f655c87c/

pacman::p_load(data.table)


data = call_fun(parameter = list(project_id=project_id,activate_data_id=activate_data_id,fun_name="read_data_from_projects"))
e = data$e
f = data$f
p = data$p

# Summarize the information about missing values.
# data = wcmc::read_data("GCTOF_Abraham_CM_v_M_heart_NoSwim.xlsx")
# e = data$e_matrix
# f = data$f
# p = data$p


## Here, calculate the p-values and FDRs.

groups = factor(p[[treatment_group]])
levels = levels(groups)

if(test_type %in% c("t-test", "paired t-test")){
  if(!length(levels)==2){
    stop(paste0("For the power analysis for ",test_type,", the Treatment Group (",treatment_group,") you've selected has ",length(levels)," level(s). Only two levels is allowed."))
  }
}else{
  if(length(levels)>2){
    stop(paste0("The Treatment Group (",treatment_group,") you've selected has less than 3 level(s). It has ",length(levels)," level(s). You should have at least three levels."))
  }
}


n = as.numeric(n)

sig.level = as.numeric(sig_level)
power = as.numeric(power)/100


# p_val = apply(e,1,function(x){
#   t.test(x~groups, var.equal = TRUE)$p.value
# })



# sd
if(test_type == "t-test"){
  sd = sqrt(apply(e, 1, function(x){
    anova(lm(x ~ groups))["Residuals", "Mean Sq"]
  }))
}else{

}
# delta
if(test_type %in% c("t-test", "paired t-test")){

  delta = rowMeans(e[,groups %in% levels[1]]) - rowMeans(e[,groups %in% levels[2]])


}else{

}

#1 power
if(test_type == "t-test"){
  powers = power.t.test(n = n, delta = delta,
               sd = sd, sig.level = sig.level, power = NULL, type = "two.sample",
               alternative = "two.sided")$power
}else{

}

#2 ns
if(test_type == "t-test"){
  ns = mapply(function(sdi,deltai){
    power.t.test(power = power, delta = deltai,
                 sd = sdi, sig.level = sig.level, n = NULL, type = "two.sample",
                 alternative = "two.sided")$n
  },sd,delta)
}else{

}




result = data.table(index = 1:nrow(f), label = f$label, powers = powers, ns = ns)
colnames(result)[3] = paste0("power (n=",n,")")
colnames(result)[4] = paste0("n (power=",power,")")

fwrite(result, "ssize.csv", col.names = TRUE)













