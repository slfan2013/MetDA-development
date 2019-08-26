
# report_missing_value_imputation = function(treatment_group,equal_variance_assumption,type,fdr,result,levels = NULL,alternative = "two.sided",doc = NULL, table_index = 1,figure_index = 1){



if(!exists("defination_of_missing_other_than")){defination_of_missing_other_than=NULL}
if(!exists("defination_of_missing_value")){defination_of_missing_value=NULL}
if(!exists("defination_of_missing_value_values_less_than")){defination_of_missing_value_values_less_than=NULL}
if(!exists("missing_value_imputation_method")){missing_value_imputation_method=NULL}
if(!exists("remove_missing_values_more_than")){remove_missing_values_more_than=NULL}
if(!exists("remove_missing_values_more_than_value")){remove_missing_values_more_than_value=NULL}
if(!exists("summary_data")){summary_data=NULL}

if(!exists("doc")){doc=NULL}
if(!exists("table_index")){table_index=1}
if(!exists("figure_index")){figure_index=1}
if(!exists("project_id")){project_id = ""}
if(!exists("fold_id")){fold_id = NULL}
if(!exists("report_generator")){report_generator = FALSE}

text_html = ""




# save(treatment_group,equal_variance_assumption,type,fdr,result, levels,alternative, doc,table_index ,  figure_index ,file = "report_missing_value_imputation.RData")

# load("report_missing_value_imputation.RData")
pacman::p_load(data.table, officer, magrittr)



if(type == "all"){
  projectUrl <- URLencode(paste0("http://metda.fiehnlab.ucdavis.edu/db/metda_project/", project_id))
  projectList <- jsonlite::fromJSON(projectUrl, simplifyVector = F)

  id <- sapply(projectList$project_structure, function(x) x$id)
  parent <- sapply(projectList$project_structure, function(x) x$parent)
  icon <- sapply(projectList$project_structure, function(x) x$icon)
  icon <- sapply(projectList$project_structure, function(x) x$icon)

  data_ids <- id[parent == fold_id & (!icon=="fa fa-folder")]



  result <- read.csv(
    URLencode(paste0(
      "http://metda.fiehnlab.ucdavis.edu/db/metda_project/",
      project_id,
      "/", data_ids[grepl("summary",data_ids)]
    )),
    row.names = 1
  )
  summary_data = result

  input_file_path <- sapply(call_fun(parameter = list(project_id=project_id, file_id = parameters$activate_data_id, fun_name="get_fold_seq")), paste0,collapse = "->")
  output_file_path = sapply(call_fun(parameter = list(project_id=project_id, file_id = data_ids, fun_name="get_fold_seq")), paste0,collapse = "->")


  defination_of_missing_value = parameters$defination_of_missing_value
  defination_of_missing_value_values_less_than = parameters$defination_of_missing_value_values_less_than
  defination_of_missing_other_than = parameters$defination_of_missing_other_than
  remove_missing_values_more_than = parameters$remove_missing_values_more_than
  remove_missing_values_more_than_value = parameters$remove_missing_values_more_than_value
  missing_value_imputation_method = parameters$missing_value_imputation_method




}



if(type %in% c("method_description", "all")){

  if (is.null(doc)) {

    doc <- read_docx()
  }
  if (type %in% "all") {

    doc <- doc %>%
      body_add_par("Missing Value Imputation Summary: ", style = "heading 1")
  }

  doc <- doc %>%
    body_add_par("Missing data in untargeted MS-based metabolomics data occur for various reasons. First, it is possible that the molecules are truly absent from the sample, a situation that may occur e.g. for drug metabolites that only appear in a subset of people taking that medication. On the other hand, there are several technical reasons that could result in missing values, including: (i) instrument sensitivity thresholds, below which concentrations of a specific metabolite might not be detectable in a sample (i.e., below the limit of detection, LOD); (ii) matrix effects that impede the quantification of a metabolite in a sample through other co-eluting compounds and ion suppression; (iii) declining separation ability of the chromatographic column and increasing contamination of the MS instrument; and (iv) limitations in computational processing of spectra, such as poor selection and alignment of the spectral peaks across samples. A widely used and flexible class of missing data strategies is imputation, which involves the replacement of missing values by reasonable substitute values. The most commonly used imputation approaches for metabolomics data assume that missing data occur because they are below the limit of detection (left-censoring, a variant of MNAR).[https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6153696/].", style = "Normal", pos = "after") %>%
    body_add_par("", style = "Normal", pos = "after")

  if (type %in% "method_description") {
    content = docx_summary(doc)
    par_data <- subset(content, content_type %in% "paragraph")
    par_data <- par_data[, c("doc_index", "style_name", "text", "level", "num_id") ]
    par_data = par_data[!is.na(par_data$style_name),]

    text_html = ""
    tags_begin = revalue(par_data$style_name,c("heading 3", "Normal"),c("<h3>","<p>"))
    tags_end = revalue(par_data$style_name,c("heading 3", "Normal"),c("</h3>","</p>"))
    for(i in 1:length(par_data$style_name)){
      text_html = paste0(text_html,tags_begin[i],par_data$text[i],tags_end[i])
    }
    text_html = strsplit(text_html,"<p>Figure")[[1]]
    text_html = unname(sapply(text_html, function(x){
      if(!is.na(as.numeric(substr(x,1,2)))){
        return(paste0("<p>Figure",x))
      }else{
        return(x)
      }
    }))
  }



}
if(type %in% c("parameter_settings_description","all")){

  if (is.null(doc)) {
    doc <- read_docx()
  }

  if(type == "all"){
    doc <- doc %>%
      body_add_par("Input Summary: ", style = "heading 3")%>%
      body_add_par("Input Dataset: ", style = "Normal")%>%
      slip_in_text(input_file_path, style = "Default Paragraph Font", pos = "after")

    doc <- doc %>%
      body_add_par("Output Datasets and Files: ", style = "Normal")%>%
      slip_in_text(output_file_path, style = "Default Paragraph Font", pos = "after")
  }




  doc <- doc %>%
    body_add_fpar(fpar(ftext(" - Defination of Missing Values: ", prop = fp_text(bold = TRUE))), style = "Normal")%>%
    slip_in_text(paste0(". What in your dataset can be treated as missing values. \"Empty cells\" is where there is no value in the excel sheet. \"Characters\" is where the value is a character but not a number. \"Zeros\" is when the value is 0. \"Negative Values\" is where the value is less than 0. Or you can also cusomize a threshold to determine the missing value by selecting the \"Values Less Than...\". Any value in the excel sheet less than the VALUES LESS THAN will be treated as missing values."), style = "Default Paragraph Font", pos = "after")

  doc <- doc %>%
    body_add_fpar(fpar(ftext(" - Values Less Than: ", prop = fp_text(bold = TRUE))), style = "Normal")%>%
    slip_in_text(paste0(". The the \"values less than...\" is selected, any value less than ",defination_of_missing_value_values_less_than," will be treated as missing value."), style = "Default Paragraph Font", pos = "after")

  doc <- doc %>%
    body_add_fpar(fpar(ftext(" - Remove Compounds with Too Many Missing Values: ", prop = fp_text(bold = TRUE))), style = "Normal")%>%
    slip_in_text(paste0("When the Remove compounds... is checked. The compounds with more than ",remove_missing_values_more_than_value,'% of missing values will be eliminated before imputation.'), style = "Default Paragraph Font", pos = "after")


  doc <- doc %>%
    body_add_fpar(fpar(ftext(" - Missing Value Imputation Method (with a disturb): ", prop = fp_text(bold = TRUE))), style = "Normal")%>%
    body_add_par("replace by half minimum: replace the missing values with random samples from a normal distribution with half-minimum of non-missing value as mean and 1/10 of half-minimum of non-missing value as standard deviation for each compound.", style = "Normal", pos = "after")%>%
    body_add_par("replace by 1/10 minimum: replace the missing values with random samples from a normal distribution with 1/10-minimum of non-missing value as mean and 1/10 of 1/10-minimum of non-missing value as standard deviation for each compound.", style = "Normal", pos = "after")%>%
    body_add_par("replace by minimum: replace the missing values with random samples from a normal distribution with minimum of non-missing value as mean and 1/10 of minimum of non-missing value as standard deviation for each compound.", style = "Normal", pos = "after")%>%
    body_add_par("replace by mean: replace the missing values with random samples from a normal distribution with mean of non-missing value as mean and 1/10 of mean of non-missing value as standard deviation for each compound.", style = "Normal", pos = "after")%>%
    body_add_par("replace by median: replace the missing values with random samples from a normal distribution with median of non-missing value as mean and 1/10 of median of non-missing value as standard deviation for each compound.", style = "Normal", pos = "after")%>%
    body_add_par("imputed by kNN: replace the missing values by k Nearest Neighbors Imputation method.  The original kNN imputation was developed for high-dimensional microarray gene expression data (n<p, n is the number of samples, and p is the number of variables). For each gene with missing values, this method finds the k nearest genes using Euclidean metric and imputes missing elements by averaging those non-missing elements of its neighbors. In metabolomics studies, we applied kNN to find k nearest samples instead and imputed the missing elements.", style = "Normal", pos = "after")%>%
    body_add_par("imputed by kNN: replace the missing values by k Nearest Neighbors Imputation method.  The original kNN imputation was developed for high-dimensional microarray gene expression data (n<p, n is the number of samples, and p is the number of variables). For each gene with missing values, this method finds the k nearest genes using Euclidean metric and imputes missing elements by averaging those non-missing elements of its neighbors. In metabolomics studies, we applied kNN to find k nearest samples instead and imputed the missing elements.", style = "Normal", pos = "after")%>%
    body_add_par("Bayesian PCA missing value estimation (BPCA): see [https://rdrr.io/bioc/pcaMethods/man/bpca.html]", style = "Normal", pos = "after")%>%
    body_add_par("probabilistic PCA (PPCA): see [https://ieeexplore.ieee.org/stamp/stamp.jsp?arnumber=5169998]", style = "Normal", pos = "after")%>%
    body_add_par("Single Value Decomposition imputation (SVD): SVD imputation will initialize all missing elements with zero then estimate them as a linear combination of the k most significant eigen-variables iteratively until reaches certain convergence threshold. In metabolomics data, we scaled and centralized the data matrix first and then applied this imputation approach with the number of PCs setting to five.", style = "Normal", pos = "after")%>%
    body_add_par("missForest (Imputation with Random Forest): This imputation method applies random forest, a powerful machine learning algorithm, to build a prediction model by setting particular target variable with non-missing values as the outcome and other variables as predictors, then to predict the target variable with missing values iteratively.", style = "Normal", pos = "after")%>%
    body_add_par("QRILC (Quantile Regression Imputation of Left-Censored data): QRILC imputation was specifically designed for left-censored data, data missing caused by lower than LOQ. This method imputes missing elements with randomly drawing from a truncated distribution estimated by a quantile regression. A beforehand log-transformation was conducted to improve the imputation accuracy.", style = "Normal", pos = "after")




  if(type == 'parameter_settings_description'){
    content = docx_summary(doc)
    par_data <- subset(content, content_type %in% "paragraph")
    par_data <- par_data[, c("doc_index", "style_name", "text", "level", "num_id") ]
    par_data = par_data[!is.na(par_data$style_name),]

    text_html = ""
    tags_begin = revalue(par_data$style_name,c("heading 3", "Normal"),c("<h3>","<p>"))
    tags_end = revalue(par_data$style_name,c("heading 3", "Normal"),c("</h3>","</p>"))
    for(i in 1:length(par_data$style_name)){
      text_html = paste0(text_html,tags_begin[i],par_data$text[i],tags_end[i])
    }
    text_html = strsplit(text_html,"<p>Figure")[[1]]
    text_html = unname(sapply(text_html, function(x){
      if(!is.na(as.numeric(substr(x,1,2)))){
        return(paste0("<p>Figure",x))
      }else{
        return(x)
      }
    }))

  }


}
if(type %in% c("result_summary","all")){

  if (is.null(doc)) {
    doc <- read_docx()
  }

  if("values less than ..." %in% defination_of_missing_value){
    defination_of_missing_value2 = defination_of_missing_value
    defination_of_missing_value2[defination_of_missing_value2 %in% "values less than ..."] = paste0("values less than ",defination_of_missing_value_values_less_than)


    doc <- doc %>%
      body_add_par("Result Summary: ", style = "heading 3")%>%
      body_add_par(paste0("The defination of missing values are ",paste0(defination_of_missing_value2,collapse = ", "),". In total, there are ",sum(summary_data$total)," missing values in the dataset. "), style = "Normal", pos = "after")%>%
      slip_in_text(paste0("Compounds with more than ",remove_missing_values_more_than_value,"% missing values were excluded. In total, there were ",sum(summary_data$excluded != "No")," compounds excluded. "), style = "Default Paragraph Font", pos = "after")%>%
      slip_in_text(paste0("Then the missing values in the dataset were imputed by the method of ",missing_value_imputation_method,". For more details, please see Table ",table_index,"."), style = "Default Paragraph Font", pos = "after")
  }else{
    doc <- doc %>%
      body_add_par("Result Summary: ", style = "heading 3")%>%
      body_add_par(paste0("The defination of missing values are ",paste0(defination_of_missing_value,collapse = ", "),". In total, there are ",sum(summary_data$total)," missing values in the dataset. "), style = "Normal", pos = "after")%>%
      slip_in_text(paste0("Compounds with more than ",remove_missing_values_more_than_value,"% missing values were excluded. In total, there were ",sum(summary_data$excluded != "No")," compounds excluded. "), style = "Default Paragraph Font", pos = "after")%>%
      slip_in_text(paste0("Then the missing values in the dataset were imputed by the method of ",missing_value_imputation_method,". For more details, please see Table ",table_index,"."), style = "Default Paragraph Font", pos = "after")
  }











  doc <- doc %>%
    body_add_par("Table Explanation.", style = "Normal", pos = "after") %>%
    body_add_par(" - index: the index of compounds, mainly for sorting the table.", style = "Normal", pos = "after") %>%
    body_add_par(" - label: compound labels.", style = "Normal", pos = "after")

  if("empty cells" %in% defination_of_missing_value){
    doc <- doc %>% body_add_par(" - empty.cells: the number of empty cell for each compound.", style = "Normal", pos = "after")
  }

  if("characters" %in% defination_of_missing_value){
    doc <- doc %>% body_add_par(" - characters: the number of character values for each compound.", style = "Normal", pos = "after")
  }

  if("zeros" %in% defination_of_missing_value){
    doc <- doc %>% body_add_par(" - zeros: the number of zeros for each compound.", style = "Normal", pos = "after")
  }
  if("negative values" %in% defination_of_missing_value){
    doc <- doc %>% body_add_par(" - negative.values: the number of negative values for each compound.", style = "Normal", pos = "after")
  }
  if("values less than ..." %in% defination_of_missing_value){
    doc <- doc %>% body_add_par(paste0(" - values.less.than.",defination_of_missing_value_values_less_than,": the number of values less than ",defination_of_missing_value_values_less_than," for each compound."), style = "Normal", pos = "after")
  }



  doc <- doc %>% body_add_par(" - total: the total number of missing values for each compound.", style = "Normal", pos = "after")
  doc <- doc %>% body_add_par(" - excluded: if Yes, the compound is excluded.", style = "Normal", pos = "after")



  if(type == 'result_summary'){
    content = docx_summary(doc)
    par_data <- subset(content, content_type %in% "paragraph")
    par_data <- par_data[, c("doc_index", "style_name", "text", "level", "num_id") ]
    par_data = par_data[!is.na(par_data$style_name),]

    text_html = ""
    tags_begin = revalue(par_data$style_name,c("heading 3", "Normal"),c("<h3>","<p>"))
    tags_end = revalue(par_data$style_name,c("heading 3", "Normal"),c("</h3>","</p>"))
    for(i in 1:length(par_data$style_name)){
      text_html = paste0(text_html,tags_begin[i],par_data$text[i],tags_end[i])
    }
    text_html = strsplit(text_html,"<p>Figure")[[1]]
    text_html = unname(sapply(text_html, function(x){
      if(!is.na(as.numeric(substr(x,1,2)))){
        return(paste0("<p>Figure",x))
      }else{
        return(x)
      }
    }))

  }

}


if(type=="all"){

  if(sum(result$total)>0){
    doc <- doc %>%
      body_add_table(value = result[order(result$total, decreasing = TRUE)[1:10],], style = "table_template")%>%
      body_add_par(value = paste0("Table ", table_index, ": several compounds with most missing values."), style = "table title")
  }else{
    doc <- doc %>%
      body_add_table(value = result[1:10,], style = "table_template")%>%
      body_add_par(value = paste0("Table ", table_index, ": Missing Value Imputation Summary Table (no missing values were found.)"), style = "table title")
  }


if(!report_generator){
  doc %>% print(target = "report_missing_value_imputation.docx")
}

}


if(!report_generator){
  result = list(text_html = text_html, method_name = "Missing Value Imputation", table_index = table_index+1, figure_index = figure_index)
}else{
  result = list(table_index = table_index+1, figure_index = figure_index, doc = doc)
}



# }

