test_pca = function(full_data=NULL, full_layout=NULL, data=NULL, layout=NULL){
  save(full_data, full_layout, data, layout, file = "plot.RData")


  load("~/GitHub/MetDA-development/MetDADevelopmentR/plot.RData")
  df <- data.frame()


  g <- ggplot(df) + geom_point()

  g <- ggplotly(g)

  p <- plotly_build(g)


  layout$traces = NULL
  # layout$xaxis = NULL
  # layout$yaxis = NULL
  layout$xaxis$autorange = NULL
  layout$yaxis$autorange = NULL


  p$x$layout = layout
  p

  p$x$data[[1]]$visible = TRUE
  p$x$data[[1]]$x = oo[[1]]$x
  p$x$data[[1]]$y = oo[[1]]$y
  p$x$data[[1]]$mode = oo[[1]]$mode
  p$x$data[[1]]$name = oo[[1]]$name
  p$x$data[[1]]$text = oo[[1]]$text
  p$x$data[[1]]$marker = oo[[1]]$marker
  p$x$data[[1]]$legendgroup = oo[[1]]$legendgroup
  # p$x$data[[1]]$line = oo[[1]]$line
  p$x$data[[1]]$fill = oo[[1]]$fill
  p$x$data[[1]]$fillcolor = oo[[1]]$fillcolor
  p$x$data[[1]]$showlegend = TRUE


  p$x$data[[2]] = list()
  p$x$data[[2]]$visible = TRUE
  p$x$data[[2]]$x = oo[[2]]$x
  p$x$data[[2]]$y = oo[[2]]$y
  p$x$data[[2]]$mode = oo[[2]]$mode
  p$x$data[[2]]$name = oo[[2]]$name
  p$x$data[[2]]$text = oo[[2]]$text
  p$x$data[[2]]$marker = oo[[2]]$marker
  p$x$data[[2]]$legendgroup = oo[[2]]$legendgroup
  # p$x$data[[2]]$line = oo[[2]]$line
  p$x$data[[2]]$fill = oo[[2]]$fill
  p$x$data[[2]]$fillcolor = oo[[2]]$fillcolor
  p$x$data[[2]]$showlegend = TRUE


  p$x$data[[3]] = list()
  oo[[3]]$marker = NULL
  p$x$data[[3]]$visible = TRUE
  p$x$data[[3]]$x = oo[[3]]$x
  p$x$data[[3]]$y = oo[[3]]$y
  p$x$data[[3]]$mode = oo[[3]]$mode
  p$x$data[[3]]$name = oo[[3]]$name
  p$x$data[[3]]$text = oo[[3]]$text
  p$x$data[[3]]$marker = oo[[3]]$marker
  p$x$data[[3]]$legendgroup = oo[[3]]$legendgroup
  p$x$data[[3]]$line = oo[[3]]$line
  p$x$data[[3]]$fill = oo[[3]]$fill
  p$x$data[[3]]$fillcolor = oo[[3]]$fillcolor
  p$x$data[[3]]$showlegend = FALSE
  p$x$data[[3]]$hoverinfo = "skip"


  p




  from_dataframe_to_list = function(x){
    return(
      sapply(x, function(y){
        return(y)
      }, simplify = F)
    )
  }

  data_candidates = sapply(from_dataframe_to_list(data),function(x){
    if(class(x)=='data.frame'){
      return(from_dataframe_to_list(x))
    }else{
      return(x)
    }
  })



  oo=sapply(1:4, function(i){
    sapply(data_candidates, function(x){
      if(class(x)=="list"){
        if(identical(names(x),NULL)){
          return(x[[i]])
        }else{
          return(sapply(x, function(x) x[i], simplify = F))
        }
      }else{
        return(x[i])
      }

    })
  }, simplify = FALSE)






  # p$x$data[[1]] = oo[[1]]


  p$x$data[[1]]$mode = "markers"
  p$x$data[[1]]$x = oo[[1]]$x
  p$x$data[[1]]$y = oo[[1]]$y
  p$x$data[[1]]$name = oo[[1]]$name
  p$x$data[[1]]$text = oo[[1]]$text
  p$x$data[[1]]$marker = oo[[1]]$marker
  p$x$data[[1]]$legendgroup = oo[[1]]$legendgroup
  p$x$data[[1]]$line = oo[[1]]$line
  p$x$data[[1]]$fill = oo[[1]]$fill
  p$x$data[[1]]$fillcolor = oo[[1]]$fillcolor
  p$x$data[[1]]$showlegend = TRUE
  p




  return(TRUE)
}
