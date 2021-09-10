docker container run -it --rm --gpus all \
	-v ${PWD}/data:/opt/opennmt-py/data \
	opennmt-py \
	onmt_train -data data/dataset/preprocess --save_model data/models/emb256_encDec64 \
	--word_vec_size 256 --rnn_size 64 --layers 4 -dropout 0 -global_attention mlp \
	-gpu_ranks 0 -batch_size 16 -optim adam -learning_rate 0.001 \
	--train_steps 13437 -valid_steps 13437 \
	-log_file data/log_emb256_encDec64

docker container run -it --rm --gpus all \
	-v ${PWD}/data:/opt/opennmt-py/data \
	opennmt-py \
	onmt_train -data data/dataset/preprocess --save_model data/models/emb128_encDec128 \
	--word_vec_size 128 --rnn_size 128 --layers 4 -dropout 0 -global_attention mlp \
	-gpu_ranks 0 -batch_size 16 -optim adam -learning_rate 0.001 \
	--train_steps 13437 -valid_steps 13437 \
	-log_file data/log_emb128_encDec128
	 
exit
# -dropout 0 -train_steps 100000  -valid_steps 1000 -save_checkpoint_steps 1000 \
# -save_checkpoint_steps 1000 -label_smoothing 0.1 
# 43000
# 7000
# 47408 / 16 -> 2963

# batch_size 16 o 12


	-layers 1 -global_attention mlp\

docker container run -it --rm --gpus all -v "$(pwd)"/data:/opt/opennmt-py/data opennmt-py \
onmt_train -src_word_vec_size 512 -tgt_word_vec_size 512 \
-rnn_size 512 -data data/dataset/preprocess -save_model data/models/model_name \
-gpu_ranks 0 -batch_size 50 -optim adam -learning_rate 0.0002 -learning_rate_decay 1.0 \
-log_file data/log  -dropout 0 -train_steps 100000 -layers 1 -valid_steps 1000 \
-save_checkpoint_steps 1000 -label_smoothing 0.1 -global_attention mlp


