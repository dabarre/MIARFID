#!/usr/bin/octave

# Elegir un alpha efectivo, un beta efectivo
# Hold-out 70% 30% para buscar optimal parameters
# Then make a final training with all data and optimal parameters

if (nargin != 1)
  printf("Usage: ./finalWeights.m <Data>\n ");
  exit(1);
endif

arg_list = argv();
data = arg_list{1};

# Load data and prepare for usage
load(data);
[N,L] = size(data); 
D = L-1;
ll = unique(data(:, L)); 
C = numel(ll);
rand("seed", 23);
data = data(randperm(N), :);

# Train and test data
M = N - round(0.7*N);
te = data(N-M+1:N, :);

a = 10;
b = 100000;

[w,E,k] = perceptron(data, b, a);

save_precision(4);
save("news_w", "w");