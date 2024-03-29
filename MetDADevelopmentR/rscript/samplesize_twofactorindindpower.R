#
# samplesize_twofactorindindpower <- function(k1=3,k2=3,effectsize=0.8,sig_level = 0.05,power=0.8,forplot=FALSE,samplerange=NULL,effectsizerange=NULL){
  k=k1*k2
  library(pwr);library(jsonlite)
  if(!forplot){
    result = ceiling(pwr.anova.test(k = k, f = effectsize, sig.level = sig_level, power = power)$n)
  }else{
    if(is.null(effectsizerange)){
      effectsizes = c(0.2,0.5,0.8)
    }else{
      effectsizes = as.numeric(strsplit(effectsizerange, ",")[[1]])
    }
    if(is.null(samplerange)){
      n = seq(5,100,by=5)
    }else{
      forn = as.numeric(unlist(strsplit(strsplit(samplerange, ",")[[1]],"-")))
      n=seq(forn[1],forn[2],by=forn[3])
    }
    ns = list()
    powers = list()

    for(i in 1:length(effectsizes)){
      df1 = k-1
      df2 = k*n-k
      ncp = effectsizes[i]^2 * k*n
      power = pf(qf(sig_level,df1,df2,lower.tail = F),df1,df2,ncp,lower.tail = F)
      ns[[as.character(effectsizes[i])]] = n
      powers[[as.character(effectsizes[i])]] = power
    }

    # ceiling(power.t.test(delta = effectsize,power = power, sig.level = sig_level)$n)
    result = list(ns = ns, powers = powers)
  }
# }
