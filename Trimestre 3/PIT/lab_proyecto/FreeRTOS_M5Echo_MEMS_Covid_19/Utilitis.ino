
float getMinSoundValue(float* sound_array, int array_size) {
  int32_t minIndex = 0;
  float min_value = sound_array[minIndex];

  for (int i = 0; i < array_size; i++) {
    if (sound_array[i] < min_value) {
      min_value = sound_array[i];
      minIndex = i;
    }
  }
  return min_value;
}

float getMaxSoundValue(float* sound_array, int array_size) {
  int32_t maxIndex = 0;
  float max_value = sound_array[maxIndex];

  for (int i = 0; i < array_size; i++) {
    if (sound_array[i] > max_value) {
      max_value = sound_array[i];
      maxIndex = i;
    }
  }
  return max_value;
}

void init_array() {
  // Complete
  for (int i=0; i<NUMBER_OF_INPUTS; i++) {
    input_vector[i] = 0.0;
  }
}

void init_sample_array() {
  // Complete
  for (int i=0; i<BLOCK_SIZE; i++) {
    samples[i] = 0;
  }
  //samples
}

void print_paramerters() {
  Serial.print("Length Sample Array: ");
  Serial.print(sizeof(samples));
  Serial.print(" Num bytes readed: ");
  Serial.print(num_bytes_read);
  Serial.print(" Samples readed: ");
  Serial.print(samples_read);
  Serial.print(" Length Input Vector: ");
  Serial.print(sizeof(input_vector));
  Serial.print(" Length Temp Vector: ");
  Serial.println(sizeof(temp_data));

}
