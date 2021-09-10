#!/usr/bin/octave

# Obtener un clasificador final lo más preciso posible con optimal parameters
# Diapositiva 8

# Evaluar el clasificador final w*
# Diapositiva 10

# Elaborar tabla con resultados del clasificador final
# Tarea, error, intervalo, alpha*, beta*

# Entrenar clasificador final con alpha* y beta*
# Guardar todos los ficheros de pesos relevantes
# Diapositiva 13

# Añadir igual un comentario relevante
# No es realista hacer una exploracion completa ya que computacionalmente no es
# la mejor opcion y es mejor optar por un maximo local?

# Si no se solapa el intervalo de confianza entre clasificadores
# se puede decir que hay una diferencia significativa entre clasificadores
# Alpha pequeño es una convergencia más suave

# Cuando haya convergencia o error similar, elegir una beta elevada

if (nargin != 1)
  printf("Usage: ./experiment <Data>");
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

# Print headers
printf("#       a        b   E   k Ete       Interval\n");
printf("#-------- -------- --- --- --- --------------\n");

for a = [.1 1 10 100 1000 10000 100000]
  for b = [.1 1 10 100 1000 10000 100000]
    # Train
    # Max iterations = 200 (default) 
    [w,E,k] = perceptron(data(1:round(.7*N),:), b, a);
    
    # Test 
    rl = zeros(M,1);
    for n = 1:M 
      rl(n) = ll(linmach(w, [1 te(n,1:D)]'));
    end
    
    # Obtain insight
    [nerr m] = confus(te(:,L),rl);
    
    output_precision(2);
    
    m = nerr / M;         # Mean error    
    s = sqrt(m*(1-m)/M);  # Standard deviation      
    r = 1.96 * s;         # Confidence interval diference
    
    printf(" %8.1f %8.1f %3d %3d %3d [%.3f, %.3f]\n", a, b, E, k, nerr, m-r, m+r);
    
  endfor
  printf("\n");
endfor





