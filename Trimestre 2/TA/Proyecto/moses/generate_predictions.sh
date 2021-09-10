export DISCOUNT="-kndiscount"
export ITERATIONS=5
export NGRAMS=5
export WEIGHTS_ADJ=""
export TEST="europarl-v7.es-en-test-hidden.en" # test.src

docker container run -i --rm -v ${PWD}/data/:/data moses \
/opt/moses/bin/moses -threads 10 -f \
/data/mert/moses-lm$NGRAMS$DISCOUNT$WEIGTHS_ADJ$ITERATIONS.ini < data/dataset/$TEST \
> data/test.hyp

############

docker container run -it --rm \
	-v ${PWD}/data/:/data \
	moses /bin/bash


/opt/moses/bin/moses -threads 20 -f /data/mert/moses-lm5-kndiscount.ini < /data/dataset/europarl-v7.es-en-test-hidden.en > /data/test.hyp

docker container run -it --rm --gpus all \
	-v ${PWD}/data:/opt/moses/data \
	    moses /bin/bash

