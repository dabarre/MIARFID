
void classify_sound() {
  float prediction[NUMBER_OF_OUTPUTS];

  // input_vector -> temp_data
  tf_model.predict(temp_data, prediction);

  Serial.println("=================================================");
  //Serial.println(sizeof(temp_data));
  //Serial.println(samples_read);
  //Serial.println(sizeof(samples));

  // Print predictions softmax
  for (int i = 0; i < NUMBER_OF_OUTPUTS; i++) {
    Serial.print("Label ");
    Serial.print(i);
    Serial.print(" = ");
    Serial.println(prediction[i]);
    
    output_vector[i] = prediction[i];
  }
  
  delay(2000);
}
