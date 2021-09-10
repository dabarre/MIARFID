docker container run -it --rm --gpus all -v \
	${PWD}/data:/opt/opennmt-py/data \
	opennmt-py \
	onmt_translate -model /opt/opennmt-py/data/models/emb128_encDec128_step_10000.pt \
	-src /opt/opennmt-py/data/dataset/test.src -tgt /opt/opennmt-py/data/dataset/test.tgt \
	-output /opt/opennmt-py/data/dataset/test.hyp \
	-replace_unk -gpu 0


# emb256_encDec64_step_10000
