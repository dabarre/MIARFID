export DISCOUNT="-kndiscount"
export ITERATIONS=15
export NGRAMS=5
export WEIGHTS_ADJ=""

docker container run -it --rm -v ${PWD}/data/:/data moses \
/opt/moses/scripts/training/mert-moses.pl $WEIGTHS_ADJ \
/data/dataset/dev.src /data/dataset/dev.tgt \
/opt/moses/bin/moses /data/alignment/model/moses-$NGRAMS$DISCOUNT.ini \
-threads=20 \
--maximum-iterations=$ITERATIONS \
--working-dir /data/mert \
--mertdir /opt/moses/bin/ \
--decoder-flags "-threads 20"

sudo mv data/mert/moses.ini data/mert/moses-lm$NGRAMS$DISCOUNT$WEIGTHS_ADJ$ITERATIONS.ini
