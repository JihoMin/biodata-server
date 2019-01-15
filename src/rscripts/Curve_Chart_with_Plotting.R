library(ggplot2)
library(dplyr)
library(hflights)
library(readxl)
library(gridExtra)
library(ggthemes)
library(directlabels)
library(reshape)

# dataset<- read_excel("/Users/minjiho/dev/vue/biodata-server/src/rscripts/Clinical_Data.xlsx")
dataset<- read.csv("/Users/minjiho/dev/vue/biodata-server/src/rscripts/clinical.csv")
print(dataset)
dataset[dataset==99999]<-NA 
data_p1 <- read_excel("/Users/minjiho/dev/vue/biodata-server/src/rscripts/histogram_ahn2.xlsx")
# data_p1 <- read.csv("/Users/minjiho/dev/vue/biodata-server/src/rscripts/histogram.csv")
# print(data_p1$AGE)
print(data_p1)

# args <- commandArgs(TRUE)
# # a <- as.double(args[1])
# # b <- as.double(args[2])
# print(args[1])

# WEIGHT graph

#### individual data_weight ####
age <- data_p1$AGE
weight <- data_p1$WEIGHT
##############
library(dict)

d <- dict()

d[[1]] <- 42
d[[c(2, 3)]] <- "Hello!"
d[["foo"]] <- "bar"
d[[1]]
d[[c(2, 3)]]
d$get("not here", "default")

d$keys()
d$values()
d$items()


quantile_vector5 <- c(0)
length(quantile_vector5) <- 51

quantile_vector50 <- c(0)
length(quantile_vector50) <- 51

quantile_vector95 <- c(0)
length(quantile_vector95) <- 51

for (i in 1:51){
  df_weight <- dataset %>% filter(AGE == i+38) %>% select(WEIGHT)
  quantile_vector5[i] <- quantile(df_weight$WEIGHT, probs = c(0.05), na.rm = TRUE)
  # print(quantile_vector5[i])
}

for (i in 1:51){
  df_weight <- dataset %>% filter(AGE == i+38) %>% select(WEIGHT)
  quantile_vector50[i] <- quantile(df_weight$WEIGHT, probs = c(0.50), na.rm = TRUE)
  # print(quantile_vector50[i])
}

for (i in 1:51){
  df_weight <- dataset %>% filter(AGE == i+38) %>% select(WEIGHT)
  quantile_vector95[i] <- quantile(df_weight$WEIGHT, probs = c(0.95), na.rm = TRUE)
  # print(quantile_vector95[i])
}

df_quantile_vector <- data.frame(five = quantile_vector5, fifty = quantile_vector50, ninetyfive = quantile_vector95, age = c(39:89))

colnames(df_quantile_vector) <- c("5th","50th", "95th", "AGE")

###individual data_weight###
client <- c(0)
length(client) <- 51

for (i in 1:51) {
  for (j in 1:11)
    if (df_quantile_vector$AGE[i] == data_p1$AGE[j]) {
      client[i] <- data_p1$WEIGHT[j]
    }
}

df_quantile_vector$client <- client
##########

df_q <- melt(df_quantile_vector, measure.vars = c("5th", "50th", "95th"))


p_weight <- ggplot(data=df_q, aes(x=df_q$AGE, y=value, colour = variable, group = variable)) + geom_smooth() + xlab("만 나이(세)") + ylab  ("체중 (kg)") + scale_x_continuous(breaks = seq(40, 80, 5)) + scale_y_continuous(breaks = seq(30, 110, 10), sec.axis = dup_axis(~.-0, name = "")) + coord_cartesian(xlim   = c(40, 80), ylim = c(30, 110)) + geom_dl(aes(label=variable),method="last.points") + theme(legend.position="none")

p_weight <- p_weight + geom_point(data = df_q, aes(x=df_q$AGE, y=df_q$client), colour = "purple")

p_weight
##############################################################################################

# BMI graph

#### individual data_BMI ####
age <- data_p1$AGE
bmi <- data_p1$BMI
##############

quantile_vector5 <- c(0)
length(quantile_vector5) <- 51

quantile_vector50 <- c(0)
length(quantile_vector50) <- 51

quantile_vector95 <- c(0)
length(quantile_vector95) <- 51

for (i in 1:51){
  df_bmi <- dataset %>% filter(AGE == i+38) %>% select(BMI)
  quantile_vector5[i] <- quantile(df_bmi$BMI, probs = c(0.05), na.rm = TRUE)
  # print(quantile_vector5[i])
}

for (i in 1:51){
  df_bmi <- dataset %>% filter(AGE == i+38) %>% select(BMI)
  quantile_vector50[i] <- quantile(df_bmi$BMI, probs = c(0.50), na.rm = TRUE)
  # print(quantile_vector50[i])
}

for (i in 1:51){
  df_bmi <- dataset %>% filter(AGE == i+38) %>% select(BMI)
  quantile_vector95[i] <- quantile(df_bmi$BMI, probs = c(0.95), na.rm = TRUE)
  # print(quantile_vector95[i])
}

df_quantile_vector <- data.frame(five = quantile_vector5, fifty = quantile_vector50, ninetyfive = quantile_vector95, age = c(39:89))

colnames(df_quantile_vector) <- c("5th","50th", "95th", "AGE")

###individual data_BMI###
client <- c(0)
length(client) <- 51

for (i in 1:51) {
  for (j in 1:11)
    if (df_quantile_vector$AGE[i] == data_p1$AGE[j]) {
      client[i] <- data_p1$BMI[j]
    }
}

df_quantile_vector$client <- client
##########

df_q <- melt(df_quantile_vector, measure.vars = c("5th", "50th", "95th"))

p_bmi <- ggplot(data=df_q, aes(x=df_q$AGE, y=value, colour = variable, group = variable)) + geom_smooth() + xlab("만 나이(세)") + ylab  ("BMI") + scale_x_continuous(breaks = seq(40, 80, 5)) + scale_y_continuous(breaks = seq(16, 32, 4), sec.axis = dup_axis(~.-0, name = "")) + coord_cartesian(xlim = c(40, 80), ylim = c(16, 32))  + geom_dl(aes(label=variable),method="last.points") + theme(legend.position="none") 

p_bmi <- p_bmi + geom_point(data = df_q, aes(x=df_q$AGE, y=df_q$client), colour = "purple")

p_bmi
#########################################################################################################

# GLUCOSE graph

#### individual data_GLUCOSE ####
age <- data_p1$AGE
glu <- data_p1$GLU
##############

quantile_vector5 <- c(0)
length(quantile_vector5) <- 51

quantile_vector50 <- c(0)
length(quantile_vector50) <- 51

quantile_vector95 <- c(0)
length(quantile_vector95) <- 51

for (i in 1:51){
  df_GLU0 <- dataset %>% filter(AGE == i+38) %>% select(GLU)
  quantile_vector5[i] <- quantile(df_GLU0$GLU, probs = c(0.05), na.rm = TRUE)
  # print(quantile_vector5[i])
}

for (i in 1:51){
  df_GLU0 <- dataset %>% filter(AGE == i+38) %>% select(GLU)
  quantile_vector50[i] <- quantile(df_GLU0$GLU, probs = c(0.50), na.rm = TRUE)
  # print(quantile_vector50[i])
}

for (i in 1:51){
  df_GLU0 <- dataset %>% filter(AGE == i+38) %>% select(GLU)
  quantile_vector95[i] <- quantile(df_GLU0$GLU, probs = c(0.95), na.rm = TRUE)
  # print(quantile_vector95[i])
}

df_quantile_vector <- data.frame(five = quantile_vector5, fifty = quantile_vector50, ninetyfive = quantile_vector95, age = c(39:89))

colnames(df_quantile_vector) <- c("5th","50th", "95th", "AGE")

###individual data_GLUCOSE###
client <- c(0)
length(client) <- 51

for (i in 1:51) {
  for (j in 1:11)
    if (df_quantile_vector$AGE[i] == data_p1$AGE[j]) {
      client[i] <- data_p1$GLU[j]
    }
}

df_quantile_vector$client <- client
##########

df_q <- melt(df_quantile_vector, measure.vars = c("5th", "50th", "95th"))

p_glu <- ggplot(data=df_q, aes(x=df_q$AGE, y=value, colour = variable, group = variable)) + geom_smooth() + xlab("만 나이(세)") + ylab  ("혈당 수치") +scale_x_continuous(breaks = seq(40, 80, 5)) + scale_y_continuous(breaks = seq(70, 160, 10), sec.axis = dup_axis(~.-0, name = "")) + coord_cartesian(xlim = c(40, 80), ylim = c(70, 160))  + geom_dl(aes(label=variable),method="last.points") + theme(legend.position="none")

p_glu <- p_glu + geom_point(data = df_q, aes(x=df_q$AGE, y=df_q$client), colour = "purple")

p_glu
############################################################################################

# SBP graph

#### individual data_SBP ####
age <- data_p1$AGE
sbp <- data_p1$SBP
##############

quantile_vector5 <- c(0)
length(quantile_vector5) <- 51

quantile_vector50 <- c(0)
length(quantile_vector50) <- 51

quantile_vector95 <- c(0)
length(quantile_vector95) <- 51

for (i in 1:51){
  df_SBP <- dataset %>% filter(AGE == i+38) %>% select(SBP)
  quantile_vector5[i] <- quantile(df_SBP$SBP, probs = c(0.05), na.rm = TRUE)
  # print(quantile_vector5[i])
}

for (i in 1:51){
  df_SBP <- dataset %>% filter(AGE == i+38) %>% select(SBP)
  quantile_vector50[i] <- quantile(df_SBP$SBP, probs = c(0.50), na.rm = TRUE)
  # print(quantile_vector50[i])
}

for (i in 1:51){
  df_SBP <- dataset %>% filter(AGE == i+38) %>% select(SBP)
  quantile_vector95[i] <- quantile(df_SBP$SBP, probs = c(0.95), na.rm = TRUE)
  # print(quantile_vector95[i])
}

df_quantile_vector <- data.frame(five = quantile_vector5, fifty = quantile_vector50, ninetyfive = quantile_vector95, age = c(39:89))

colnames(df_quantile_vector) <- c("5th","50th", "95th", "AGE")

###individual data_SBP###
client <- c(0)
length(client) <- 51

for (i in 1:51) {
  for (j in 1:11)
    if (df_quantile_vector$AGE[i] == data_p1$AGE[j]) {
      client[i] <- data_p1$SBP[j]
    }
}

df_quantile_vector$client <- client
##########

df_q <- melt(df_quantile_vector, measure.vars = c("5th", "50th", "95th"))

p_sbp <- ggplot(data=df_q, aes(x=df_q$AGE, y=value, colour = variable, group = variable)) + geom_smooth() + xlab("만 나이(세)") + ylab  ("혈압(수축기) (mmHg)") + scale_x_continuous(breaks = seq(40, 80, 5)) + scale_y_continuous(breaks = seq(90, 160, 10), sec.axis = dup_axis(~.-0, name = "")) + coord_cartesian(xlim = c(40, 80), ylim = c(90, 160)) + geom_dl(aes(label=variable),method="last.points") + theme(legend.position="none")

p_sbp <- p_sbp + geom_point(data = df_q, aes(x=df_q$AGE, y=df_q$client), colour = "purple")

p_sbp
###########################################################################################################

# DBP graph

####individual data_DBP ####
age <- data_p1$AGE
dbp <- data_p1$DBP
##############

quantile_vector5 <- c(0)
length(quantile_vector5) <- 51

quantile_vector50 <- c(0)
length(quantile_vector50) <- 51

quantile_vector95 <- c(0)
length(quantile_vector95) <- 51

for (i in 1:51){
  df_DBP <- dataset %>% filter(AGE == i+38) %>% select(DBP)
  quantile_vector5[i] <- quantile(df_DBP$DBP, probs = c(0.05), na.rm = TRUE)
  print(quantile_vector5[i])
}

for (i in 1:51){
  df_DBP <- dataset %>% filter(AGE == i+38) %>% select(DBP)
  quantile_vector50[i] <- quantile(df_DBP$DBP, probs = c(0.50), na.rm = TRUE)
  print(quantile_vector50[i])
}

for (i in 1:51){
  df_DBP <- dataset %>% filter(AGE == i+38) %>% select(DBP)
  quantile_vector95[i] <- quantile(df_DBP$DBP, probs = c(0.95), na.rm = TRUE)
  print(quantile_vector95[i])
}

df_quantile_vector <- data.frame(five = quantile_vector5, fifty = quantile_vector50, ninetyfive = quantile_vector95, age = c(39:89))

colnames(df_quantile_vector) <- c("5th","50th", "95th", "AGE")

###individual data_DBP###
client <- c(0)
length(client) <- 51

for (i in 1:51) {
  for (j in 1:11)
    if (df_quantile_vector$AGE[i] == data_p1$AGE[j]) {
      client[i] <- data_p1$DBP[j]
    }
}

df_quantile_vector$client <- client
##########

df_q <- melt(df_quantile_vector, measure.vars = c("5th", "50th", "95th"))

p_dbp <- ggplot(data=df_q, aes(x=df_q$AGE, y=value, colour = variable, group = variable)) + geom_smooth() + xlab("만 나이(세)") + ylab  ("혈압(이완기) (mmHg)") + scale_x_continuous(breaks = seq(40, 80, 5)) + scale_y_continuous(breaks = seq(50, 100, 10), sec.axis = dup_axis(~.-0, name = "")) +  coord_cartesian(xlim = c(40, 80), ylim = c(50, 100))  + geom_dl(aes(label=variable),method="last.points") + theme(legend.position="none")

p_dbp <- p_dbp + geom_point(data = df_q, aes(x=df_q$AGE, y=df_q$client), colour = "purple")

p_dbp
###########################################################################################################

# CHOL graph

####individual data_CHOL ####
age <- data_p1$AGE
CHOL <- data_p1$TCHL
##############

quantile_vector5 <- c(0)
length(quantile_vector5) <- 51

quantile_vector50 <- c(0)
length(quantile_vector50) <- 51

quantile_vector95 <- c(0)
length(quantile_vector95) <- 51

for (i in 1:51){
  df_CHOL <- dataset %>% filter(AGE == i+38) %>% select(TCHL)
  quantile_vector5[i] <- quantile(df_CHOL$TCHL, probs = c(0.05), na.rm = TRUE)
  # print(quantile_vector5[i])
}

for (i in 1:51){
  df_CHOL <- dataset %>% filter(AGE == i+38) %>% select(TCHL)
  quantile_vector50[i] <- quantile(df_CHOL$TCHL, probs = c(0.50), na.rm = TRUE)
  # print(quantile_vector50[i])
}

for (i in 1:51){
  df_CHOL <- dataset %>% filter(AGE == i+38) %>% select(TCHL)
  quantile_vector95[i] <- quantile(df_CHOL$TCHL, probs = c(0.95), na.rm = TRUE)
  # print(quantile_vector95[i])
}

df_quantile_vector <- data.frame(five = quantile_vector5, fifty = quantile_vector50, ninetyfive = quantile_vector95, age = c(39:89))

colnames(df_quantile_vector) <- c("5th","50th", "95th", "AGE")

###individual data_CHOL###
client <- c(0)
length(client) <- 51

for (i in 1:51) {
  for (j in 1:11)
    if (df_quantile_vector$AGE[i] == data_p1$AGE[j]) {
      client[i] <- data_p1$TCHL[j]
    }
}

df_quantile_vector$client <- client
##########

df_q <- melt(df_quantile_vector, measure.vars = c("5th", "50th", "95th"))

p_chol <- ggplot(data=df_q, aes(x=df_q$AGE, y=value, colour = variable, group = variable)) + geom_smooth() + xlab("만 나이(세)") + ylab  ("콜레스테롤 (mg/dL)") + scale_x_continuous(breaks = seq(40, 80, 5)) + scale_y_continuous(breaks = seq(120, 300, 45), sec.axis = dup_axis(~.-0, name = "")) +  coord_cartesian(xlim = c(40, 80), ylim = c(50, 100))  + geom_dl(aes(label=variable),method="last.points") + theme(legend.position="none")

p_chol <- p_chol + geom_point(data = df_q, aes(x=df_q$AGE, y=df_q$client), colour = "purple")

p_chol
###########################################################################################################

# HDL Chol graph

####individual data_HDL ####
age <- data_p1$AGE
HDL <- data_p1$HDL
##############

quantile_vector5 <- c(0)
length(quantile_vector5) <- 51

quantile_vector50 <- c(0)
length(quantile_vector50) <- 51

quantile_vector95 <- c(0)
length(quantile_vector95) <- 51

for (i in 1:51){
  df_HDL <- dataset %>% filter(AGE == i+38) %>% select(HDL)
  quantile_vector5[i] <- quantile(df_HDL$HDL, probs = c(0.05), na.rm = TRUE)
  # print(quantile_vector5[i])
}

for (i in 1:51){
  df_HDL <- dataset %>% filter(AGE == i+38) %>% select(HDL)
  quantile_vector50[i] <- quantile(df_HDL$HDL, probs = c(0.50), na.rm = TRUE)
  # print(quantile_vector50[i])
}

for (i in 1:51){
  df_HDL <- dataset %>% filter(AGE == i+38) %>% select(HDL)
  quantile_vector95[i] <- quantile(df_HDL$HDL, probs = c(0.95), na.rm = TRUE)
  # print(quantile_vector95[i])
}

df_quantile_vector <- data.frame(five = quantile_vector5, fifty = quantile_vector50, ninetyfive = quantile_vector95, age = c(39:89))

colnames(df_quantile_vector) <- c("5th","50th", "95th", "AGE")

###individual data_HDL###
client <- c(0)
length(client) <- 51

for (i in 1:51) {
  for (j in 1:11)
    if (df_quantile_vector$AGE[i] == data_p1$AGE[j]) {
      client[i] <- data_p1$HDL[j]
    }
}

df_quantile_vector$client <- client
##########

df_q <- melt(df_quantile_vector, measure.vars = c("5th", "50th", "95th"))

p_HDL <- ggplot(data=df_q, aes(x=df_q$AGE, y=value, colour = variable, group = variable)) + geom_smooth() + xlab("만 나이(세)") + ylab  ("고밀도지단백 콜레스테롤 (mg/dL)") + scale_x_continuous(breaks = seq(40, 80, 5)) + scale_y_continuous(breaks = seq(20, 90, 10), sec.axis = dup_axis(~.-0, name = "")) +  coord_cartesian(xlim = c(40, 80), ylim = c(20, 90))  + geom_dl(aes(label=variable),method="last.points") + theme(legend.position="none")

p_HDL <- p_HDL + geom_point(data = df_q, aes(x=df_q$AGE, y=df_q$client), colour = "purple")

p_HDL

###########################################################################################################

# TG graph

####individual data_TG ####
age <- data_p1$AGE
TG <- data_p1$TG
##############

quantile_vector5 <- c(0)
length(quantile_vector5) <- 51

quantile_vector50 <- c(0)
length(quantile_vector50) <- 51

quantile_vector95 <- c(0)
length(quantile_vector95) <- 51

for (i in 1:51){
  df_TG <- dataset %>% filter(AGE == i+38) %>% select(TG)
  quantile_vector5[i] <- quantile(df_TG$TG, probs = c(0.05), na.rm = TRUE)
  # print(quantile_vector5[i])
}

for (i in 1:51){
  df_TG <- dataset %>% filter(AGE == i+38) %>% select(TG)
  quantile_vector50[i] <- quantile(df_TG$TG, probs = c(0.50), na.rm = TRUE)
  print(quantile_vector50[i])
}

for (i in 1:51){
  df_TG <- dataset %>% filter(AGE == i+38) %>% select(TG)
  quantile_vector95[i] <- quantile(df_TG$TG, probs = c(0.95), na.rm = TRUE)
  print(quantile_vector95[i])
}

df_quantile_vector <- data.frame(five = quantile_vector5, fifty = quantile_vector50, ninetyfive = quantile_vector95, age = c(39:89))

colnames(df_quantile_vector) <- c("5th","50th", "95th", "AGE")

###individual data_TG###
client <- c(0)
length(client) <- 51

for (i in 1:51) {
  for (j in 1:11)
    if (df_quantile_vector$AGE[i] == data_p1$AGE[j]) {
      client[i] <- data_p1$TG[j]
    }
}

df_quantile_vector$client <- client
##########

df_q <- melt(df_quantile_vector, measure.vars = c("5th", "50th", "95th"))

p_TG <- ggplot(data=df_q, aes(x=df_q$AGE, y=value, colour = variable, group = variable)) + geom_smooth() + xlab("만 나이(세)") + ylab  ("중성지방 (mg/dL)") + scale_x_continuous(breaks = seq(40, 80, 5)) + scale_y_continuous(breaks = seq(30, 600, 30), sec.axis = dup_axis(~.-0, name = "")) +  coord_cartesian(xlim = c(40, 80), ylim = c(30, 600))  + geom_dl(aes(label=variable),method="last.points") + theme(legend.position="none")

p_TG <- p_TG + geom_point(data = df_q, aes(x=df_q$AGE, y=df_q$client), colour = "purple")

p_TG

