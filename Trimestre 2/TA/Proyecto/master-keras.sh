cd nmt-keras/

# PREPARE DATA

#sh prepare_data.sh

# TRAINING

# Create different config files
# Embedding 32-64-128-256-512 -> (SOURCE_TEXT_EMBEDDING_SIZE, TARGET_TEXT_EMBEDDING_SIZE)
# LSTM Units 32-64-128-256-512 -> (ENCODER_HIDDEN_SIZE, DECODER_HIDDEN_SIZE)
# Adagrad y Adadelta ??? -> OPTIMIZER
# Transformer 32-64-128-256-512 -> (MODEL_TYPE, MODEL_SIZE) -> Change linkName


# REDUCIR BATCH_SIZE
for CONFIG in "config_emb512_encDec128"; do
	python3 free_memory.py
	echo "Training" $CONFIG
	docker container run -it --rm --gpus all \
		-v ${PWD}/Data:/opt/nmt-keras/Data \
	    -v ${PWD}/$CONFIG.py:/opt/nmt-keras/config.py \
	    -v ${PWD}/datasets:/opt/nmt-keras/datasets \
	    -v ${PWD}/trained_models:/opt/nmt-keras/trained_models \
	    nmt-keras
	
	#echo "Generating predictions"
	###sh generate_predictions.sh

	#DELETED
	#echo "Evaluating predictions"
	##sh evaluate.sh >> resultados.txt
done

exit

#################################################################################

# What I did at the lab
# train
python "$NMT"/nmt-keras/main.py -c config.py 2>traza
# create link to folder of trained model
ln -s trained_models/EuTrans_esen_AttentionRNNEncoderDecoder_src_emb_64_bidir_True_enc_LSTM_32_dec_ConditionalLSTM_32_deepout_linear_trg_emb_64_Adam_0.001 trained_model
# test
python "$NMT"/nmt-keras/sample_ensemble.py --models trained_model/epoch_5 --dataset datasets/Dataset_EuTrans_esen.pkl --text Data/EuTrans/test.es --dest hyp.test_ex2_1.en
# evaluate test
"$NMT"/nmt-keras/utils/multi-bleu.perl -lc Data/EuTrans/test.en < hyp.test_ex2_1.en
# remove link to folder of trained model
unlink trained_model

#################################################################################

python "$NMT"/nmt-keras/main.py -c config.py 2>traza 

ln -s trained_models/EuTrans_esen_Transformer_model_size_256_ff_size_1024_num_heads_8_encoder_blocks_1_decoder_blocks_1_deepout_linear_Adam_0.001 trained_model 

python "$NMT"/nmt-keras/sample_ensemble.py --models trained_model/epoch_5 --dataset datasets/Dataset_EuTrans_esen.pkl --text Data/EuTrans/test.es --dest hyp.test_ex4_4.en --changes MODEL_TYPE='Transformer' MODEL_SIZE=256 SOURCE_TEXT_EMBEDDING_SIZE=256 TARGET_TEXT_EMBEDDING_SIZE=256

"$NMT"/nmt-keras/utils/multi-bleu.perl -lc Data/EuTrans/test.en < hyp.test_ex4_4.en

unlink trained_model





