sys_put_methods <- function() {
  methods_structure <- list(
    "Data Subsetting" = list(
      "data_subsetting" = list(
        "Method Name" = "Data Subsetting",
        "Description" = "Subset your data according to criterions (e.g. p-values).",
        "Example" = "paper1",
        "Example link" = ""
      )
    ),
    "DATA PROCESSING" = list(
      "missing_value_imputation" = list(
        "Method Name" = "Missing Value Imputation",
        "Description" = "Replace or impute missing values.",
        "Example" = "paper1",
        "Example link" = ""
      )
    ),
    "UNIVARIATE ANALYSIS" = list(
      "fold_change" = list(
        "Method Name" = "Fold Change",
        "Description" = "Calculate the average ratio between two groups..",
        "Example" = "paper3",
        "Example link" = ""
      ),
      "student_t_test" = list(
        "Method Name" = "Student's t-test",
        "Description" = "The Student's t-test is for testing if the two group means are statistically siginificantly different.",
        "Example" = "paper3",
        "Example link" = ""
      ),
      "mann_whitney_test" = list(
        "Method Name" = "Mann-Whitney U test",
        "Description" = "The Mann-Whitney U test is for testing if the two group medians are statistically siginificantly different.",
        "Example" = "paper3",
        "Example link" = ""
      ),
      "boxplot" = list(
        "Method Name" = "Boxplot",
        "Description" = "To draw a beautiful boxplot for each compound.",
        "Example" = "paper2",
        "Example link" = ""
      ),
      "volcano" = list(
        "Method Name" = "Volcano Plot",
        "Description" = "To visualize the significancy and fold change at once.",
        "Example" = "paper2",
        "Example link" = ""
      )
    ),
    "MULTIVARIATE ANALYSIS" = list(
      "pca" = list(
        "Method Name" = "Principal Component Analysis (PCA)",
        "Description" = "To reduce a larger set of variables into a smaller set of 'artificial' variables that account for most of the variance in the original variables.",
        "Example" = "paper2",
        "Example link" = ""
      ),
      "plsda" = list(
        "Method Name" = "Partial Least Square - Discriminant Analysis (PLSDA)",
        "Description" = "Prediction",
        "Example" = "paper2",
        "Example link" = ""
      ),
	  "heatmap" = list(
        "Method Name" = "Heatmap",
        "Description" = "To draw a beautiful heatmap.",
        "Example" = "paper2",
        "Example link" = ""
      )
    ),
    "POWER ANALYSIS" = list(
      "sample_size_calculator" = list(
        "Method Name" = "Sample Size Calculator",
        "Description" = "Calculate Sample Size for an Individual Variable.",
        "Example" = "paper3",
        "Example link" = ""
      ),
      "ssize" = list(
        "Method Name" = "Sample Size Estimation for Microarray Experiments",
        "Description" = "Sample Size Estimation for Microarray Experiments. Post-hoc power analysis.",
        "Example" = "paper3",
        "Example link" = ""
      )

    )
  )

  methodsUrl <- URLencode(paste0("http://metda:metda@localhost:5985/templates/methods"))
  methodsList <- jsonlite::fromJSON(methodsUrl)
  methodsList[["methods_structure"]] <- methods_structure

  RCurl::getURL(methodsUrl, customrequest = "PUT", httpheader = c("Content-Type" = "application/json"), postfields = jsonlite::toJSON(methodsList, auto_unbox = TRUE, force = TRUE))
}
