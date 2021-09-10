bool init_mems(int mode)
{
  esp_err_t err = ESP_OK;

  i2s_driver_uninstall(SPEAK_I2S_NUMBER);
  i2s_config_t i2s_config = {
    .mode = (i2s_mode_t)(I2S_MODE_MASTER),
    .sample_rate = 16000,
    .bits_per_sample = I2S_BITS_PER_SAMPLE_16BIT, // is fixed at 12bit, stereo, MSB
    .channel_format = I2S_CHANNEL_FMT_ALL_RIGHT,
    .communication_format = I2S_COMM_FORMAT_I2S,
    .intr_alloc_flags = ESP_INTR_FLAG_LEVEL1,
    .dma_buf_count = 6,
    .dma_buf_len = 60,
  };
  if (mode == MODE_MIC)
  {
    i2s_config.mode = (i2s_mode_t)(I2S_MODE_MASTER | I2S_MODE_RX | I2S_MODE_PDM);
  }
  else
  {
    i2s_config.mode = (i2s_mode_t)(I2S_MODE_MASTER | I2S_MODE_TX);
    i2s_config.use_apll = false;
    i2s_config.tx_desc_auto_clear = true;
  }

  Serial.println("Init i2s_driver_install");

  err += i2s_driver_install(SPEAK_I2S_NUMBER, &i2s_config, 0, NULL);
  i2s_pin_config_t tx_pin_config;

  tx_pin_config.bck_io_num = CONFIG_I2S_BCK_PIN;
  tx_pin_config.ws_io_num = CONFIG_I2S_LRCK_PIN;
  tx_pin_config.data_out_num = CONFIG_I2S_DATA_PIN;
  tx_pin_config.data_in_num = CONFIG_I2S_DATA_IN_PIN;

  Serial.println("Init i2s_set_pin");
  err += i2s_set_pin(SPEAK_I2S_NUMBER, &tx_pin_config);
  Serial.println("Init i2s_set_clk");
  err += i2s_set_clk(SPEAK_I2S_NUMBER, 16000, I2S_BITS_PER_SAMPLE_16BIT, I2S_CHANNEL_MONO);

  return true;
}

int read_mems() {
  // Read a single sample and log it for the Serial Plotter.
  int32_t sample = 0;
  int bytes_read = i2s_pop_sample(I2S_PORT, (char *)&sample, portMAX_DELAY); // no timeout
  if (bytes_read > 0) {

    float data_sound = sample  / 10000.0;

    // Se guardan los datos del microfono en el array temp_data
    temp_data[i_raw_data] = data_sound;

    // Mostrar señal recogida
    //Serial.print("Raw: ");
    //Serial.println(temp_data[i_raw_data]);

    if (i_raw_data == NUMBER_OF_INPUTS) {
      i_raw_data = 0;
      j_raw_data = 0;
      min_value = getMinSoundValue(temp_data, sizeof(temp_data));
      max_value = getMaxSoundValue(temp_data, sizeof(temp_data));
      for (int i = 0; i < NUMBER_OF_INPUTS; i++) {
        input_vector[i] = (temp_data[i] - min_value) * (1.0 - (-1.0)) / (max_value - min_value) + (-1);

        // Mostrar señal recogida
        //Serial.print("Signal: ");
        //Serial.println(input_vector[i]);
      }
    }
    i_raw_data = i_raw_data + 1 ;
  }
}

void preprocessing_data(int samples_read) {
  if (samples_read > 0) {
    for (int i = 0; i < samples_read; ++i) {
      temp_data[i_raw_data] = samples[i] / 10000.0;
      i_raw_data = i_raw_data + 1 ;
    }

    if (i_raw_data == NUMBER_OF_INPUTS) {
      i_raw_data = 0;
      j_raw_data = 0;
      min_value = getMinSoundValue(temp_data, sizeof(temp_data));
      max_value = getMaxSoundValue(temp_data, sizeof(temp_data));

      for (int i = 0; i < NUMBER_OF_INPUTS; i++) {
        input_vector[i] = (temp_data[i] - min_value) * (1.0 - (-1.0)) / (max_value - min_value) + (-1);
      }
    }
    Serial.println("Preprocessing Complete");
  }
}
