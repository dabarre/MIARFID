
void tarea_1(void *pvParameter)
{
  while(1)
  {
    Serial.println("Hola FreeRTOS, soy la tarea 1!");
    vTaskDelay(100 / portTICK_RATE_MS);
  }
}

void tarea_2(void *pvParameter)
{
  while(1)
  {
    Serial.println("Hola FreeRTOS, soy la tarea 2!");
    vTaskDelay(100 / portTICK_RATE_MS);
  }
}

void setup()
{
  Serial.begin(115200);

  

  xTaskCreate(&tarea_1, "tarea_1", 512, NULL, 0, NULL);
  xTaskCreate(&tarea_2, "tarea_2", 512, NULL, 5, NULL);
}

void loop(){}
