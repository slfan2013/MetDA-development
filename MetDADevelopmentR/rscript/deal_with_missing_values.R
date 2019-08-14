

  ncol_e = ncol(e)
  result = t(apply(e, 1, function(x){

  # for(i in 1:nrow(e)){

    # x = e[i,]
    temp_index = is.na(x)

    if(sum(temp_index)>(ncol_e-1)){
      stop("You have at least one compounds with no value. Please use Missing Value Imputation to filter these compounds first.")
      # print(i)
    }
    temp_mean = mean(x, na.rm = TRUE)
    x[temp_index] = 1/2 * rnorm(sum(temp_index), mean = 0.5 * temp_mean, sd = temp_mean/10)
  # }

    return(x)
  }))

