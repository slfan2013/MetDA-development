sys_put_methods = function(){

  methods_structure = list(
    "DATA PROCESSING" = list(
      "missing_value_imputation" = list(
        "Method Name"="Missing Value Imputation",
        "Description"="Replace or impute missing values.",
        "Example"="paper1",
        "Example link"=""
      )
    ),
    "MULTIVARIATE ANALYSIS" = list(
      "pca" = list(
        "Method Name"="Principal Component Analysis (PCA)",
        "Description"="To reduce a larger set of variables into a smaller set of 'artificial' variables that account for most of the variance in the original variables.",
        "Example"="paper2",
        "Example link"=""
      )
    )
  )

  methodsUrl = URLencode(paste0("http://metda:metda@localhost:5985/templates/methods"))
  methodsList = jsonlite::fromJSON(methodsUrl)
  methodsList[['methods_structure']] = methods_structure

  RCurl::getURL(methodsUrl,customrequest='PUT',httpheader=c('Content-Type'='application/json'),postfields=jsonlite::toJSON(methodsList,auto_unbox = TRUE, force = TRUE))







}
