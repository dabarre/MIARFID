echo "Embedding 256 Encoder-Decoder 64" >> resultados.txt

/opt/nmt-keras/multi-bleu.perl -lc /opt/nmt-keras/Data/Europarl/test.es < /opt/nmt-keras/hyp.test.es | tail -n 1 >> resultados.txt
