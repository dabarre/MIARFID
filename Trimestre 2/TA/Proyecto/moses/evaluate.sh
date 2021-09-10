docker container run -i --rm -v ${PWD}/data/:/data moses \
/opt/moses/scripts/generic/multi-bleu.perl -lc /data/dataset/test.tgt < data/test.hyp | tail -n 1