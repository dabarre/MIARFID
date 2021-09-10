#include "Config.h"

// Web server constructor
WebServer server(80);

// Declaring a global variable of type SemaphoreHandle_t
SemaphoreHandle_t xSensorSemaphore;
SemaphoreHandle_t xPredictSemaphore;
SemaphoreHandle_t xShowSemaphore;

void read_samples(void *pvParameter)
{
  Serial.println(pcTaskGetTaskName(NULL));
  while (1)
  {
    // Take mutex
    if (xSemaphoreTake(xSensorSemaphore, 10) == pdTRUE)
    {
      //Serial.println(pcTaskGetTaskName(NULL));
      samples_read = read_mems();
      init_array();
      init_sample_array();

      // Give mutex
      xSemaphoreGive(xSensorSemaphore);
    }
    vTaskDelay(1);
  }
}

void classify_samples(void *pvParameter)
{
  //Serial.println(pcTaskGetTaskName(NULL));
  while (1)
  {
    // Take mutex
    if (xSemaphoreTake(xPredictSemaphore, 10) == pdTRUE)
    {
      //Serial.println(pcTaskGetTaskName(NULL));
      preprocessing_data(samples_read);
      print_paramerters();
      classify_sound();

      /* System prints
        int index = -1;
        float value = 0.0;

        for (int i = 0; i < NUMBER_OF_OUTPUTS; i++) {
        if (output_vector[i] > value) {
          index = i;
          value = output_vector[i];
        }
        }
        String label = labels[index];
        Serial.printf("Label: %s\n", label);
      */

      delay(2000);

      // Give mutex
      xSemaphoreGive(xPredictSemaphore);
    }
    vTaskDelay(1);
  }
}

void setup() {
  /***************** NO TOCAR *******************/
  //M5.begin(true, false, true);
  //M5.dis.clear();

  Serial.println("Init Spaker");
  init_mems(MODE_MIC);
  delay(100);

  //M5.dis.drawpix(0, CRGB(0, 128, 0));
  size_t bytes_written;

  //M5.dis.drawpix(0, CRGB(128, 0, 0));

  Serial.begin(115200);

  init_sample_array();
  init_array();

  Serial.println("Configuring I2S...");
  tf_model.begin(model_data);
  delay(4000);
  /**********************************************/

  // Init Wifi
  //init_wifi();
  //delay(2000);

  // Init web server
  init_web_server();
  delay(2000);

  // Create semaphores
  xSensorSemaphore = xSemaphoreCreateMutex();
  if (xSensorSemaphore != NULL) {
    Serial.println("xSensorSemaphore created");
  }
  xPredictSemaphore = xSemaphoreCreateMutex();
  if (xPredictSemaphore != NULL) {
    Serial.println("xPredictSemaphore created");
  }

  // Create Tasks
  // Greater # higher priority
  // Only one core with xTaskCreate

  xTaskCreate(&read_samples, "read_samples", 2048, NULL, 3, NULL);
  xTaskCreate(&classify_samples, "classify_samples", 2048, NULL, 2, NULL);
}

void loop() {
  vTaskDelay(10 / portTICK_RATE_MS);

  server.handleClient();
}
