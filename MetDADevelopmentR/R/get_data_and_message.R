get_data_and_message <- function(path) {
  pacman::p_load(data.table, stringr)
  # read data and split data into sample_info, compound_info, and expression_data
  if (str_sub(path, -5, -1) == ".xlsx") {
    data <- readxl::read_excel(path, col_names = FALSE)
    data <- data.table(data)
  } else {
    data <- fread(path, header = FALSE)
  }
  data[data == ""] <- NA

  # find where the label is
  data_matrix <- sapply(data, as.character)
  label_index <- which(data_matrix == "label", arr.ind = TRUE)

  # if there are two 'label's, stop. Tell use, there can only have one label in the dataset..
  if (!nrow(label_index) == 1) {
    stop(paste0("Error: There are ", nrow(label_index), " 'label's in your dataset. Exactly one 'label' is allowed because the 'label' will be used to determine part of the data is sample information, compound information and data values."))
  }

  # warning message
  warning_message <- list()

  p_matrix <- t(data_matrix[1:label_index[1], label_index[2]:ncol(data_matrix)])
  colnames(p_matrix) <- p_matrix[1, ]
  p <- data.table(p_matrix[-1, ])
  # make p label unique.
  if (sum(duplicated(p$label)) > 0) {
    warning_message[[length(warning_message) + 1]] <- paste0("Warning: ", sum(duplicated(p$label)), " duplicated sample labels were found. They will be made unique by R function `make.unique()`.")
  }



  f_matrix <- data_matrix[label_index[1]:nrow(data_matrix), 1:label_index[2]]
  colnames(f_matrix) <- f_matrix[1, ]
  f <- data.table(f_matrix[-1, ])
  # make f label unique.
  if (sum(duplicated(f$label)) > 0) {
    warning_message[[length(warning_message) + 1]] <- paste0("Warning: ", sum(duplicated(f$label)), " duplicated compound labels were found. They will be made unique by R function `make.unique()`.")
  }

  e_matrix <- data_matrix[(label_index[1] + 1):nrow(data_matrix), (label_index[2] + 1):ncol(data_matrix)]
  e_matrix <- apply(e_matrix, 2, as.numeric)

  if (sum(is.na(e_matrix)) > 0) {
    warning_message[[length(warning_message) + 1]] <- paste0("Warning: ", sum(is.na(e_matrix)), " empty cells were found in your dataset. They will be replaced by half-minimum of non-mising value for each compound by default.")
  }

  if (sum(e_matrix == 0, na.rm = TRUE) > 0) {
    warning_message[[length(warning_message) + 1]] <- paste0("Warning: ", sum(e_matrix == 0), " zero values were found in your dataset. They will NOT be treated as missing value by default. However, you can defined them as missing value in the 'missing value imputation' section.")
  }

  sds <- apply(e_matrix, 1, sd, na.rm = TRUE)
  sds[is.na(sds)] <- 0
  if (sum(sds == 0) > 0) {
    warning_message[[length(warning_message) + 1]] <- paste0("Warning: ", sum(sds == 0), " compounds were found to be constant variable, i.e. only one value in this compound. They will be discarded by default.")
  }




  num_sample <- nrow(p)
  num_compound <- nrow(f)
  ncol_p <- ncol(p)
  ncol_f <- ncol(f)



  colnames(e_matrix) <- p$label

  success_message <- paste0("Success: Your data has ", num_sample, " samples and ", num_compound, " compounds. There are ", ncol_p, " sample informations and ", ncol_f, " compound informations.")

  message <- list(warning_message = warning_message, success_message = success_message)

  return(list(message = message, e_matrix = e_matrix, f = f, p = p))
}
