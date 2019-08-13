

  e = t(apply(e, 1, function(x){

  # for(i in 1:nrow(e)){

    # x = e[i,]
    temp_index = is.na(x)
    temp_mean = mean(x, na.rm = TRUE)
    if(is.na(temp_mean)){
      stop("You have at least one compounds with no value. Please use Missing Value Imputation to filter these compounds first.")
      # print(i)
    }
    x[temp_index] = 1/2 * rnorm(sum(temp_index), mean = 0.5 * temp_mean, sd = temp_mean/10)
  # }






    return(x)
  }))

  result = e

