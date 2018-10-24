#library 불러오기 
#install.packages("ggplot2")
#install.packages("dplyr")
#install.packages("hflights")
#install.packages("readxl")
#install.packages("gridExtra")
#install.packages("ggthemes")
#install.packages("directlabels")
#install.packages("reshape")
library(ggplot2)
library(dplyr)
library(hflights)
library(readxl)
library(gridExtra)
library(ggthemes)
library(directlabels)
library(reshape)

#나이, 체중, bmi, 혈당, 혈압(수축기/이완기) data가 들어있는 excel 파일 불러오기
#excel 파일이 있는 위치로 working directory 설정해야하
dataset<- read_excel("/Users/minjiho/Bio Data Lab/histogram/DB_Histogram.xlsx")
#dataset<- DB_Histogram

#존재하지 않는 데이터 값 null처리
dataset[dataset==99999]<-NA 

##나이별 체중이 5%, 50%, 95%인 사람의 data 뽑아내기
#상위 5%, 50%, 95%에 속한 사람들의 data를 담기 위한 변수 선언
#상위 5%
quantile_vector5 <- c(0)
length(quantile_vector5) <- 51 #51개의 data값을 담을 수 있는 vector (나이별로 값을 받기 위해) 

#상위 50%(median값)
quantile_vector50 <- c(0)
length(quantile_vector50) <- 51

#상위 95%
quantile_vector95 <- c(0)
length(quantile_vector95) <- 51

#df_weight에 나이별로 weight값만 추출하고, 위에서 선언한 vector에 나이별(i) 체중이 5%에 속한 사람의 data를 뽑아낸다. 
for (i in 1:51){
  df_weight <- dataset %>% filter(AGE == i+38) %>% select(WEIGHT)
  quantile_vector5[i] <- quantile(df_weight$WEIGHT, probs = c(0.05), na.rm = TRUE)
  print(quantile_vector5[i])
}

for (i in 1:51){
  df_weight <- dataset %>% filter(AGE == i+38) %>% select(WEIGHT)
  quantile_vector50[i] <- quantile(df_weight$WEIGHT, probs = c(0.50), na.rm = TRUE)
  print(quantile_vector50[i])
}

for (i in 1:51){
  df_weight <- dataset %>% filter(AGE == i+38) %>% select(WEIGHT)
  quantile_vector95[i] <- quantile(df_weight$WEIGHT, probs = c(0.95), na.rm = TRUE)
  print(quantile_vector95[i])
}

#나이별 5%,50%,95%에 속한 사람의 data를 가지고 matrix와 비슷한 개념인 data frame을 선언
df_quantile_vector <- data.frame(five = quantile_vector5, fifty = quantile_vector50, ninetyfive = quantile_vector95, age = c(39:89))

#열 이름 지정
colnames(df_quantile_vector) <- c("5th","50th", "95th", "AGE")

#fitting
df_q <- melt(df_quantile_vector, measure.vars = c("5th", "50th", "95th"))

#나이별 체중이 5%,50%,95%의 값을 그래프화해서 변수에 저장  
p1 <- ggplot(data=df_q, aes(x=df_q$AGE, y=value, colour = variable, group = variable)) + geom_smooth() + xlab("AGE") + ylab  ("WEIGHT (kg)") + scale_x_continuous(breaks = seq(40, 80, 5)) + scale_y_continuous(breaks = seq(30, 110, 10), sec.axis = dup_axis(~.-0, name = "")) + coord_cartesian(xlim   = c(40, 80), ylim = c(30, 110)) + geom_dl(aes(label=variable),method="last.points"+theme(legend.position="none"))  

#########################################################################
#BMI(같은 방식으로 그래프화)

quantile_vector5 <- c(0)
length(quantile_vector5) <- 51

quantile_vector50 <- c(0)
length(quantile_vector50) <- 51

quantile_vector95 <- c(0)
length(quantile_vector95) <- 51

for (i in 1:51){
  df_BMI <- dataset %>% filter(AGE == i+38) %>% select(BMI)
  quantile_vector5[i] <- quantile(df_BMI$BMI, probs = c(0.05), na.rm = TRUE)
  print(quantile_vector5[i])
}

for (i in 1:51){
  df_BMI <- dataset %>% filter(AGE == i+38) %>% select(BMI)
  quantile_vector50[i] <- quantile(df_BMI$BMI, probs = c(0.50), na.rm = TRUE)
  print(quantile_vector50[i])
}

for (i in 1:51){
  df_BMI <- dataset %>% filter(AGE == i+38) %>% select(BMI)
  quantile_vector95[i] <- quantile(df_BMI$BMI, probs = c(0.95), na.rm = TRUE)
  print(quantile_vector95[i])
}

df_quantile_vector <- data.frame(five = quantile_vector5, fifty = quantile_vector50, ninetyfive = quantile_vector95, age = c(39:89))

colnames(df_quantile_vector) <- c("5th","50th", "95th", "AGE")

df_q <- melt(df_quantile_vector, measure.vars = c("5th", "50th", "95th"))

p2 <- ggplot(data=df_q, aes(x=df_q$AGE, y=value, colour = variable, group = variable)) + geom_smooth() + xlab("AGE") + ylab  ("BMI") + scale_x_continuous(breaks = seq(40, 80, 5)) + scale_y_continuous(breaks = seq(16, 32, 4), sec.axis = dup_axis(~.-0, name = "")) + coord_cartesian(xlim = c(40, 80), ylim = c(16, 32))  + geom_dl(aes(label=variable),method="last.points"+theme(legend.position="none"))  

#########################################################################
#혈당

quantile_vector5 <- c(0)
length(quantile_vector5) <- 51

quantile_vector50 <- c(0)
length(quantile_vector50) <- 51

quantile_vector95 <- c(0)
length(quantile_vector95) <- 51

for (i in 1:51){
  df_GLU0 <- dataset %>% filter(AGE == i+38) %>% select(GLU0)
  quantile_vector5[i] <- quantile(df_GLU0$GLU0, probs = c(0.05), na.rm = TRUE)
  print(quantile_vector5[i])
}

for (i in 1:51){
  df_GLU0 <- dataset %>% filter(AGE == i+38) %>% select(GLU0)
  quantile_vector50[i] <- quantile(df_GLU0$GLU0, probs = c(0.50), na.rm = TRUE)
  print(quantile_vector50[i])
}

for (i in 1:51){
  df_GLU0 <- dataset %>% filter(AGE == i+38) %>% select(GLU0)
  quantile_vector95[i] <- quantile(df_GLU0$GLU0, probs = c(0.95), na.rm = TRUE)
  print(quantile_vector95[i])
}

df_quantile_vector <- data.frame(five = quantile_vector5, fifty = quantile_vector50, ninetyfive = quantile_vector95, age = c(39:89))

colnames(df_quantile_vector) <- c("5th","50th", "95th", "AGE")

df_q <- melt(df_quantile_vector, measure.vars = c("5th", "50th", "95th"))

p3 <- ggplot(data=df_q, aes(x=df_q$AGE, y=value, colour = variable, group = variable)) + geom_smooth() + xlab("AGE") + ylab  ("GLUCOSE") +scale_x_continuous(breaks = seq(40, 80, 5)) + scale_y_continuous(breaks = seq(70, 160, 10), sec.axis = dup_axis(~.-0, name = "")) + coord_cartesian(xlim = c(40, 80), ylim = c(70, 160))  + geom_dl(aes(label=variable),method="last.points"+theme(legend.position="none"))  

#########################################################################
#수축기 혈압

quantile_vector5 <- c(0)
length(quantile_vector5) <- 51

quantile_vector50 <- c(0)
length(quantile_vector50) <- 51

quantile_vector95 <- c(0)
length(quantile_vector95) <- 51

for (i in 1:51){
  df_SBP <- dataset %>% filter(AGE == i+38) %>% select(SBP)
  quantile_vector5[i] <- quantile(df_SBP$SBP, probs = c(0.05), na.rm = TRUE)
  print(quantile_vector5[i])
}

for (i in 1:51){
  df_SBP <- dataset %>% filter(AGE == i+38) %>% select(SBP)
  quantile_vector50[i] <- quantile(df_SBP$SBP, probs = c(0.50), na.rm = TRUE)
  print(quantile_vector50[i])
}

for (i in 1:51){
  df_SBP <- dataset %>% filter(AGE == i+38) %>% select(SBP)
  quantile_vector95[i] <- quantile(df_SBP$SBP, probs = c(0.95), na.rm = TRUE)
  print(quantile_vector95[i])
}

df_quantile_vector <- data.frame(five = quantile_vector5, fifty = quantile_vector50, ninetyfive = quantile_vector95, age = c(39:89))

colnames(df_quantile_vector) <- c("5th","50th", "95th", "AGE")

df_q <- melt(df_quantile_vector, measure.vars = c("5th", "50th", "95th"))

p4 <- ggplot(data=df_q, aes(x=df_q$AGE, y=value, colour = variable, group = variable)) + geom_smooth() + xlab("AGE") + ylab  ("SBP") + scale_x_continuous(breaks = seq(40, 80, 5)) + scale_y_continuous(breaks = seq(90, 160, 10), sec.axis = dup_axis(~.-0, name = "")) + coord_cartesian(xlim = c(40, 80), ylim = c(90, 160)) + geom_dl(aes(label=variable),method="last.points"+theme(legend.position="none"))  

#########################################################################
#이완기혈압

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

df_q <- melt(df_quantile_vector, measure.vars = c("5th", "50th", "95th"))

p5 <- ggplot(data=df_q, aes(x=df_q$AGE, y=value, colour = variable, group = variable)) + geom_smooth() + xlab("AGE") + ylab  ("DBP") + scale_x_continuous(breaks = seq(40, 80, 5)) + scale_y_continuous(breaks = seq(50, 100, 10), sec.axis = dup_axis(~.-0, name = "")) +  coord_cartesian(xlim = c(40, 80), ylim = c(50, 100))  + geom_dl(aes(label=variable),method="last.points"+theme(legend.position="none"))  

###########################################################################
#변수에 저장한 그래프들을 모두 한 화면에 표시하기

grid.arrange(p1, p2, p3, p4, p5, ncol = 3, nrow = 2, top = "Growth Curve")

