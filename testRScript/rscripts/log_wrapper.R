args <- commandArgs(TRUE)
a <- as.double(args[1])
b <- as.double(args[2])

source("./rscripts/log_a_b.R")

val <- log_a_b(a,b)
cat(val)