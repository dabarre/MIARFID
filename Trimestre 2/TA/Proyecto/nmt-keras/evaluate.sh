
# Calculate test in nmt-keras docker

echo "Embedding 128 Encoder-Decoder 128" >> resultados.txt &&
python sample_ensemble.py \
        --models trained_models/Europarl_enes_AttentionRNNEncoderDecoder_src_emb_128_bidir_True_enc_LSTM_128_dec_LSTM_128_deepout_linear_trg_emb_128_Adam_0.001/epoch_5 \
        --dataset datasets/Dataset_Europarl_enes.pkl \
        --text Data/Europarl/test.en \
	--dest /opt/nmt-keras/hyp.test.es \
&& /opt/nmt-keras/multi-bleu.perl -lc /opt/nmt-keras/Data/Europarl/test.es < /opt/nmt-keras/hyp.test.es | tail -n 1  >> resultados.txt

echo "Embedding 256 Encoder-Decoder 64" >> resultados.txt
python sample_ensemble.py \
        --models trained_models/Europarl_enes_AttentionRNNEncoderDecoder_src_emb_256_bidir_True_enc_LSTM_64_dec_LSTM_64_deepout_linear_trg_emb_256_Adam_0.001/epoch_5 \
        --dataset datasets/Dataset_Europarl_enes.pkl \
        --text Data/Europarl/test.en \
	--dest /opt/nmt-keras/hyp.test.es \
&& /opt/nmt-keras/multi-bleu.perl -lc /opt/nmt-keras/Data/Europarl/test.es < /opt/nmt-keras/hyp.test.es | tail -n 1 >> resultados.txt

echo "Embedding 256 Encoder-Decoder 128" >> resultados.txt
python sample_ensemble.py \
        --models trained_models/Europarl_enes_AttentionRNNEncoderDecoder_src_emb_256_bidir_True_enc_LSTM_128_dec_LSTM_128_deepout_linear_trg_emb_256_Adam_0.001/epoch_5 \
        --dataset datasets/Dataset_Europarl_enes.pkl \
        --text Data/Europarl/test.en \
	--dest /opt/nmt-keras/hyp.test.es \
&& /opt/nmt-keras/multi-bleu.perl -lc /opt/nmt-keras/Data/Europarl/test.es < /opt/nmt-keras/hyp.test.es | tail -n 1 >> resultados.txt

echo "Embedding 512 Encoder-Decoder 128" >> resultados.txt
python sample_ensemble.py \
        --models trained_models/Europarl_enes_AttentionRNNEncoderDecoder_src_emb_512_bidir_True_enc_LSTM_128_dec_LSTM_128_deepout_linear_trg_emb_512_Adam_0.001/epoch_5 \
        --dataset datasets/Dataset_Europarl_enes.pkl \
        --text Data/Europarl/test.en \
	--dest /opt/nmt-keras/hyp.test.es \
&& /opt/nmt-keras/multi-bleu.perl -lc /opt/nmt-keras/Data/Europarl/test.es < /opt/nmt-keras/hyp.test.es | tail -n 1 >> resultados.txt

echo "Embedding 512 Encoder-Decoder 256" >> resultados.txt
python sample_ensemble.py \
        --models trained_models/Europarl_enes_AttentionRNNEncoderDecoder_src_emb_512_bidir_True_enc_LSTM_256_dec_LSTM_256_deepout_linear_trg_emb_512_Adam_0.001/epoch_5 \
        --dataset datasets/Dataset_Europarl_enes.pkl \
        --text Data/Europarl/test.en \
	--dest /opt/nmt-keras/hyp.test.es \
&& /opt/nmt-keras/multi-bleu.perl -lc /opt/nmt-keras/Data/Europarl/test.es < /opt/nmt-keras/hyp.test.es | tail -n 1 >> resultados.txt

echo "Embedding 128 Transformer 128" >> resultados.txt
python sample_ensemble.py \
        --models trained_models/Europarl_enes_Transformer_model_size_128_ff_size_512_num_heads_8_encoder_blocks_4_decoder_blocks_4_deepout_linear_Adam_0.001/epoch_5 \
        --dataset datasets/Dataset_Europarl_enes.pkl \
        --text Data/Europarl/test.en \
	--dest /opt/nmt-keras/hyp.test.es \
	--changes MODEL_TYPE='Transformer' MODEL_SIZE=128 SOURCE_TEXT_EMBEDDING_SIZE=128 TARGET_TEXT_EMBEDDING_SIZE=128 \
&& /opt/nmt-keras/multi-bleu.perl -lc /opt/nmt-keras/Data/Europarl/test.es < /opt/nmt-keras/hyp.test.es | tail -n 1 >> resultados.txt

echo "Embedding 256 Transformer 256" >> resultados.txt
python sample_ensemble.py \
        --models trained_models/Europarl_enes_Transformer_model_size_256_ff_size_1024_num_heads_8_encoder_blocks_4_decoder_blocks_4_deepout_linear_Adam_0.001/epoch_5 \
        --dataset datasets/Dataset_Europarl_enes.pkl \
        --text Data/Europarl/test.en \
	--dest /opt/nmt-keras/hyp.test.es \
	--changes MODEL_TYPE='Transformer' MODEL_SIZE=256 SOURCE_TEXT_EMBEDDING_SIZE=256 TARGET_TEXT_EMBEDDING_SIZE=256 \
&& /opt/nmt-keras/multi-bleu.perl -lc /opt/nmt-keras/Data/Europarl/test.es < /opt/nmt-keras/hyp.test.es | tail -n 1 >> resultados.txt




echo "Embedding 256 Encoder-Decoder 64" >> resultados.txt
python sample_ensemble.py \
        --models trained_models/Europarl_enes_AttentionRNNEncoderDecoder_src_emb_256_bidir_True_enc_LSTM_64_dec_LSTM_64_deepout_linear_trg_emb_256_Adam_0.001/epoch_5 \
        --dataset datasets/Dataset_Europarl_enes.pkl \
        --text Data/europarl-v7.es-en-test-hidden.en \
	--dest /opt/nmt-keras/hyp.test.es








