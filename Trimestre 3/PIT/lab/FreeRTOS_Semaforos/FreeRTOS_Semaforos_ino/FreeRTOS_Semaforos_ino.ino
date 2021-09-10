/*
   Example of a FreeRTOS mutex
   https://www.freertos.org/Real-time-embedded-RTOS-mutexes.html
*/

#include <stdio.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "freertos/queue.h"
#include "freertos/semphr.h"
#include "esp_system.h"



static const int pcTextForTask1 = 1000;

/*
   Declaring a global variable of type SemaphoreHandle_t

*/
SemaphoreHandle_t mutex;

int globalCount = 0;

void TaskMutex(void *pvParameters)
{
  int t_delay = *((int*)pvParameters); // Use task parameters to define delay

  while (1)
  {
    /**
       Take mutex
       https://www.freertos.org/a00122.html
    */
    if (xSemaphoreTake(mutex, 10) == pdTRUE)
    {
      Serial.print(pcTaskGetTaskName(NULL));
      Serial.println();
      /**
         Give mutex
         https://www.freertos.org/a00123.html
      */
      xSemaphoreGive(mutex);
    }

    vTaskDelay(30);
  }
}

void setup() {

  Serial.begin(115200);

  /**
       Create a mutex.
       https://www.freertos.org/CreateMutex.html
  */
  mutex = xSemaphoreCreateMutex();
  if (mutex != NULL) {
    Serial.println("Mutex created");
  }

  /**
     Create tasks
  */
  xTaskCreate(TaskMutex, // Task function
              "tarea_1", // Task name for humans
              1000,
              (void*)pcTextForTask1, // Task parameter
              1, // Task priority
              NULL);

    xTaskCreate(TaskMutex, // Task function
              "tarea_2", // Task name for humans
              1000,
              (void*)pcTextForTask1, // Task parameter
              5, // Task priority
              NULL);
         
  /*     
  xTaskCreatePinnedToCore(
    TaskMutex,                       // Task function. 
    "tarea_1",                     // name of task. 
    10000,                            // Stack size of task 
    NULL,                             // parameter of the task 
    2,                                // priority of the task
    NULL,                // Task handle to keep track of created task
    0);

  xTaskCreatePinnedToCore(
    TaskMutex,
    "tarea_2",                
    10000,                     
    NULL,                             
    5,             
    NULL,                
    0);
  */

}

void loop() {
  vTaskDelay(10 / portTICK_RATE_MS);
}
