# samplesize_onefactormultipairedgroupspower <- function(m = 3,effectsize=0.8,sig_level = 0.05,power=0.8,corr=0.5,epsilon=0.75,
# forplot=FALSE,samplerange=NULL,effectsizerange=NULL){
library(jsonlite)
if (!forplot) {
  df1 <- (m - 1) * epsilon
  mu <- m / (1 - corr)
  p.body <- quote({
    ncp <- effectsize^2 * mu * N * epsilon
    df2 <- (N - 1) * (m - 1) * epsilon
    pf(qf(sig_level, df1, df2, lower.tail = F), df1, df2, ncp, lower.tail = F)
  })
  result <- tryCatch(ceiling(uniroot(function(N) eval(p.body) - power, c(m +
    1e-10, 1e+05))$root * 1), error = function(e) {
    return(
      "Error: Effect Size too BIG. In this case, 2 samples for each group is enough."
    )
  })
} else {
  if (is.null(effectsizerange)) {
    effectsizes <- c(0.2, 0.5, 0.8)
  } else {
    effectsizes <- as.numeric(strsplit(effectsizerange, ",")[[1]])
  }
  if (is.null(samplerange)) {
    n <- seq(5, 100, by = 5)
  } else {
    forn <- as.numeric(unlist(strsplit(strsplit(samplerange, ",")[[1]], "-")))
    n <- seq(forn[1], forn[2], by = forn[3])
  }

  ns <- list()
  powers <- list()

  for (i in 1:length(effectsizes)) {
    k <- 1
    df1 <- (m - 1) * epsilon
    df2 <- (k * n - k) * (m - 1) * epsilon
    mu <- m / (1 - corr)
    ncp <- effectsizes[i]^2 * mu * n * k * epsilon
    power <- pf(qf(sig_level, df1, df2, lower.tail = F), df1, df2, ncp, lower.tail = F)
    ns[[as.character(effectsizes[i])]] <- n
    powers[[as.character(effectsizes[i])]] <- power
  }

  # ceiling(power.t.test(delta = effectsize,power = power, sig.level = sig_level)$n)
  result <- list(ns = ns, powers = powers)
}

# }
