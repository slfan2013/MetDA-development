# result = list(a = defination_of_missing_value)


# http://localhost:5656/ocpu/tmp/x08f655c87c/

pacman::p_load(data.table, qvalue)


data <- call_fun(parameter = list(project_id = project_id, activate_data_id = activate_data_id, fun_name = "read_data_from_projects"))
e <- data$e
f <- data$f
p <- data$p

# Summarize the information about missing values.
# data = wcmc::read_data("GCTOF_Abraham_CM_v_M_heart_NoSwim.xlsx")
# e = data$e_matrix
# f = data$f
# p = data$p


## Here, calculate the p-values and FDRs.

groups <- factor(p[[treatment_group]])
levels <- levels(groups)

if (test_type %in% c("t-test", "paired t-test")) {
  if (!length(levels) == 2) {
    stop(paste0("For the power analysis for ", test_type, ", the Treatment Group (", treatment_group, ") you've selected has ", length(levels), " level(s). Only two levels is allowed."))
  }
} else {
  if (length(levels) > 2) {
    stop(paste0("The Treatment Group (", treatment_group, ") you've selected has less than 3 level(s). It has ", length(levels), " level(s). You should have at least three levels."))
  }
}


n <- as.numeric(n)

sig.level <- as.numeric(sig_level)
power <- as.numeric(power) / 100
fdr_criterion = as.numeric(fdr_criterion)

# p_val = apply(e,1,function(x){
#   t.test(x~groups, var.equal = TRUE)$p.value
# })



# sd
if (test_type == "t-test") {

  model_anovas = apply(e,1,function(x){
    anova(lm(x ~ groups))
  })

  sd = sqrt(sapply(model_anovas, function(x){
    x["Residuals", "Mean Sq"]
  }))

} else if (test_type == "paired t-test") {
  sample_id <- factor(p[[sample_id]])

  group1_index <- levels %in% levels[1]
  group2_index <- levels %in% levels[2]

  e1 <- e[, group1_index]
  e2 <- e[, group2_index]
  e1_sorted <- e1[, order(sample_id[group1_index])]
  e2_sorted <- e2[, order(sample_id[group2_index])]
  e_diff <- e1_sorted - e2_sorted

  sd <- apply(e_diff, 1, sd, na.rm = TRUE)
} else if (test_type == "ANOVA") {
  stop("We are still developing the ANOVA power analysis.")
  within_between_var <- t(apply(e, 1, function(x) {
    temp_anova <- anova(lm(x ~ groups))
    return(c(temp_anova["Residuals", "Mean Sq"], temp_anova["group", "Mean Sq"]))
  }))
}else if (test_type == 'repeated ANOVA'){
  stop("We are still developing the repeated ANOVA power analysis.")
}



# delta
if (test_type %in% c("t-test", "paired t-test")) {
  delta <- rowMeans(e[, groups %in% levels[1]]) - rowMeans(e[, groups %in% levels[2]])
} else {

}
# n_seq = round(c(n*0.8, n, n*1.2))
n_seq = round(n)

# power_seq = c(max(power-0.1,0), power, min(power+0.1,1))
power_seq = power


if(fdr_check){

  if (test_type == "t-test") {


    p_vals = sapply(model_anovas, function(x){
      x$`Pr(>F)`[1]
    })
    pi0 = pi0est(p_vals)$pi0
    #https://www4.stat.ncsu.edu/~jaosborn/research/microarray/software/usses-ky.pdf

    alpha_adjusted = sig.level
    FDR_alphas = c()
    FDR_alpha = (pi0 * length(p_vals) * alpha_adjusted)/sum(p_vals<alpha_adjusted)
    while(FDR_alpha>fdr_criterion){

      alpha_adjusted = alpha_adjusted - 0.00001

      FDR_alpha = (pi0 * length(p_vals) * alpha_adjusted)/sum(p_vals<alpha_adjusted)
      # print(alpha_adjusted)
      # print(FDR_alpha)

      FDR_alphas[length(FDR_alphas)+1] = FDR_alpha

    }

    sig.level = alpha_adjusted




  } else if (test_type == "paired t-test") {


   stop("CHECK HERE")


  } else if (test_type == "ANOVA"){

  } else if (test_type == "repeated ANOVA"){

  }





}



# 1 power
powers = list()
if (test_type == "t-test") {

  for(i in 1:length(n_seq)){
    powers[[as.character(n_seq[i])]] <- power.t.test(
      n = n_seq[i], delta = delta,
      sd = sd, sig.level = sig.level, power = NULL, type = "two.sample",
      alternative = "two.sided"
    )$power
  }


} else if (test_type == "paired t-test") {


  for(i in 1:length(n_seq)){
    powers[[as.character(n_seq[i])]] <- power.t.test(
      n = n, delta = delta,
      sd = sd, sig.level = sig.level, power = NULL, type = "paired",
      alternative = "two.sided"
    )$power
  }


} else if (test_type == "ANOVA") {


  for(i in 1:length(n_seq)){
    powers[[as.character(n_seq[i])]] <- power.anova.test(
      groups = length(levels), n = n,
      between.var = within_between_var[, 2], within.var = within_between_var[, 1],
      sig.level = sig.level, power = NULL
    )$power
  }


} else if (test_type == "repeated ANOVA") {
  pwr.repeated.anova.test(k = length(levels), n = n, f = NULL, sig.level = 0.05, power = NULL, corr = 0.5, epsilon = 1)
}


# set.seed(1)
# x <- rnorm(100)
# groups <- rep(c("A", "B"), each = 50)
# power.t.test(n = 10, delta = mean(x[groups == "A"]) - mean(x[groups == "B"]), sd = sqrt(anova(lm(x ~ groups))["Residuals", "Mean Sq"]))
# power.anova.test(groups = 2, n = 10, within.var = anova(lm(x ~ groups))["Residuals", "Mean Sq"], between.var = anova(lm(x ~ groups))["group", "Mean Sq"])






inv_power = sapply(powers, function(pow){
  inv <- list()
  inv$x <- sort(pow)
  inv$y <- ecdf(pow)(inv$x)
  inv$y <- 1 - inv$y
  inv_power <- inv
  return(inv_power)
}, simplify = FALSE)




# 2 ns
ns = list()
if (test_type == "t-test") {


  for(i in 1:length(power_seq)){
    ns[[as.character(power_seq[i])]] <- mapply(function(sdi, deltai) {
      power.t.test(
        power = power_seq[i], delta = deltai,
        sd = sdi, sig.level = sig.level, n = NULL, type = "two.sample",
        alternative = "two.sided"
      )$n
    }, sd, delta)
  }



} else if (test_type == "paired t-test") {


  for(i in 1:length(power_seq)){
    ns[[as.character(power_seq[i])]] <- mapply(function(sdi, deltai) {
      power.t.test(
        power = power, delta = deltai,
        sd = sdi, sig.level = sig.level, n = NULL, type = "paired",
        alternative = "two.sided"
      )$n
    }, sd, delta)
  }



}
# inv <- list()
# inv$x <- sort(ns)
# inv$y <- ecdf(ns)(inv$x)
# inv_n <- inv

inv_n = sapply(ns, function(n_){
  inv <- list()
  inv$x <- sort(n_)
  inv$y <- ecdf(n_)(inv$x)
  inv_n <- inv
  return(inv_n)
}, simplify = FALSE)





result <- data.table(index = 1:nrow(f), label = f$label, powers = unlist(powers[[as.character(n)]]), ns = unlist(ns[[as.character(power)]]))
colnames(result)[3] <- paste0("power (n=", n, ")")
colnames(result)[4] <- paste0("n (power=", power, ")")

# fread(result, "ssize.csv", col.names = TRUE)

fwrite(result, "ssize.csv", col.names = TRUE)




if (!exists("sample_id")) {
  sample_id <- NULL
}
report_html = call_fun(parameter = list(
  treatment_group = treatment_group,
  test_type = test_type,
  n = n,
  sig_level = sig_level,
  power = power,
  sample_id = sample_id,
  result = result,
  groups = groups,
  fdr_check = fdr_check,
  fdr_criterion = fdr_criterion,
  type = "result_summary",
  fun_name = "report_ssize"
))$text_html

if(grepl("temp_project_",project_id)){
  # report_html = ""
}




if (exists("ssize_plot")) { # this means this call is from quick_analysis. Here we are going to draw score plot and loading plot.
  # heatmap_plot_style = get_heatmap_plot_style("slfan") # !!! HERE WE NEED TO CHANGE 'SLFAN' TO NEW ID.
  ssize_plot_style <- call_fun(parameter = list(user_id = "slfan", fun_name = "get_ssize_plot_style"))



  layout <- ssize_plot$layout

  result <- jsonlite::toJSON(list("ssize_plot.svg" = list(
    x = sapply(inv_n,function(x) x$x),
    y =  sapply(inv_n,function(x) x$y),
    names = names(inv_n),
    title = paste0("Sample Size for ", power * 100, "% Power"),
    y_lab = paste0("Proportion of Compounds with Power >= ", power * 100, "%"),
    layout = layout,
    plot_id = ""
  ),"power_plot.svg" = list(
    x = sapply(inv_power,function(x) x$x),
    y =  sapply(inv_power,function(x) x$y),
    names = names(inv_power),
    title = paste0("Power of ", n, " Samples"),
    y_lab = paste0("Proportion of Compounds with Sample Size >= ", n, ""),
    layout = layout,
    plot_id = ""
  )), auto_unbox = TRUE, force = TRUE)


} else {
  result <- list(results_description = report_html, p = p, f = f, ns = ns, powers = powers, inv_power = inv_power, inv_n = inv_n, n_title = paste0("Sample Size for ", power * 100, "% Power"), n_ylab = paste0("Proportion of Compounds with Power >= ", power * 100, "%"), power_title = paste0("Power of ", n, " Samples"), power_ylab = paste0("Proportion of Compounds with Sample Size >= ", n, ""))
}
