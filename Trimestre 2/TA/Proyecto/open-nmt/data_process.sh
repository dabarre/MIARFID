docker container run -it --rm --gpus all \
	-v ${PWD}/data:/opt/opennmt-py/data \
	opennmt-py \
	onmt_preprocess -train_src data/dataset/train.src -train_tgt data/dataset/train.tgt \
	-valid_src data/dataset/dev.src -valid_tgt data/dataset/dev.tgt \
	-save_data data/dataset/preprocess -src_seq_length 60 -tgt_seq_length 60
