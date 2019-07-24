test_pca <- function(full_data = NULL, full_layout = NULL, data = NULL, layout = NULL) {
  save(full_data, full_layout, data, layout, file = "plot.RData")


  pacman::p_load(ggplot2, plotly)
  load("plot.RData")
  df <- data.frame()


  g <- ggplot(df) + geom_point()

  g <- ggplotly(g)

  p <- plotly_build(g)


  layout$traces <- NULL
  layout$xaxis$autorange <- NULL
  layout$yaxis$autorange <- NULL


  p$x$layout <- layout
  p



  from_dataframe_to_list <- function(x) {
    return(
      sapply(x, function(y) {
        return(y)
      }, simplify = F)
    )
  }

  data_candidates <- sapply(from_dataframe_to_list(data), function(x) {
    if (class(x) == "data.frame") {
      return(from_dataframe_to_list(x))
    } else {
      return(x)
    }
  })



  datas <- sapply(1:nrow(data), function(i) {
    sapply(data_candidates, function(x) {
      if (class(x) == "list") {
        if (identical(names(x), NULL)) {
          return(x[[i]])
        } else {
          return(sapply(x, function(x) x[i], simplify = F))
        }
      } else {
        return(x[i])
      }
    })
  }, simplify = FALSE)


  for (i in 1:length(datas)) {
    p$x$data[[i]] <- list()
    if (is.na(datas[[i]]$showlegend)) {
      datas[[i]]$showlegend <- TRUE
    }

    p$x$data[[i]]$visible <- TRUE
    p$x$data[[i]]$x <- datas[[i]]$x
    p$x$data[[i]]$y <- datas[[i]]$y
    p$x$data[[i]]$mode <- datas[[i]]$mode
    p$x$data[[i]]$name <- datas[[i]]$name
    p$x$data[[i]]$text <- datas[[i]]$text
    p$x$data[[i]]$legendgroup <- datas[[i]]$legendgroup
    if (any(!is.na(sapply(datas[[i]]$line, function(x) {
      return(x)
    })))) {
      p$x$data[[i]]$line <- datas[[i]]$line
    }
    if (any(!is.na(sapply(datas[[i]]$marker, function(x) {
      return(x)
    })))) {
      p$x$data[[i]]$marker <- datas[[i]]$marker
    }
    p$x$data[[i]]$fill <- datas[[i]]$fill
    p$x$data[[i]]$fillcolor <- datas[[i]]$fillcolor
    p$x$data[[i]]$showlegend <- datas[[i]]$showlegend
    p$x$data[[i]]$hoverinfo <- datas[[i]]$hoverinfo
  }


  p












  return(TRUE)
}
