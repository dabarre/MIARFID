docker container run -it --rm -v ${PWD}/data/:/data moses \
/opt/srilm/lm/bin/i686-m64/ngram-count -order $NGRAMS -unk -interpolate $DISCOUNT \
-text /data/dataset/tr.tgt -lm /data/model-$NGRAMS$DISCOUNT.lm
