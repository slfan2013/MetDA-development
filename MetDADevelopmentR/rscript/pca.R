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





if(scaling_method=='none'){
  sds = rep(1,nrow(f))
}else if(scaling_method=="standard"){
  sds = apply(e,1,sd,na.rm = TRUE)
}else if(scaling_method=='pareto'){
  sds = sqrt(apply(e,1,sd,na.rm = TRUE))
}else if(scaling_method == "center"){
  sds = rep(1,nrow(f))
}

e_t = t(e)
e_scale = scale(e_t, center = !scaling_method=='none', scale = sds)

pca = prcomp(e_scale, center = FALSE)
variance = round(pca$sdev^2/sum(pca$sdev^2),4)


sample_scores = pca$x[,1:min(15,ncol(pca$x))]
sample_scores = data.table(sample_scores)
rownames(sample_scores) = make.unique(p$label)

compound_loadings = pca$rotation[,1:min(15,ncol(pca$rotation))]
compound_loadings = data.table(compound_loadings)
rownames(compound_loadings) = make.unique(f$label)

fwrite(sample_scores, "sample_scores.csv", col.names = TRUE,row.names = TRUE)
fwrite(compound_loadings, "compound_loadings.csv", col.names = TRUE,row.names = TRUE)


result = list(results_description = "Here is the PCA summary.",p = p, f = f, sample_scores = sample_scores, compound_loadings = compound_loadings, variance = variance)






















