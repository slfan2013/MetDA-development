get_test_data = function(){
  data(AMSsurvey, package = "carData")

  AMSsurvey = rbind(AMSsurvey,AMSsurvey)
  AMSsurvey = rbind(AMSsurvey,AMSsurvey)

  AMSsurvey$count  = rnorm(length(AMSsurvey$count ))
  AMSsurvey$count11 = rnorm(length(AMSsurvey$count11))




  return(AMSsurvey)
}
