//#include "M5Atom.h"
#include <WiFi.h>
#include <driver/i2s.h>
#include <HTTPClient.h>
#include <WiFiClient.h>
#include <WebServer.h>
#include <ESPmDNS.h>
#include "EloquentTinyML.h"
#include "CovidModel.h"

#define NUMBER_OF_INPUTS 128
#define NUMBER_OF_OUTPUTS 3
// in future projects you may need to tweak this value
// it's a trial and error process
#define TENSOR_ARENA_SIZE 5*1024

//Eloquent::TinyML::TfLite<NUMBER_OF_INPUTS, NUMBER_OF_OUTPUTS, TENSOR_ARENA_SIZE> ml(model_data);
Eloquent::TinyML::TfLite<NUMBER_OF_INPUTS, NUMBER_OF_OUTPUTS, TENSOR_ARENA_SIZE> tf_model;

#define CONFIG_I2S_BCK_PIN 0 // 19
#define CONFIG_I2S_LRCK_PIN 33
#define CONFIG_I2S_DATA_PIN 22
#define CONFIG_I2S_DATA_IN_PIN 34 // 23

#define SPEAK_I2S_NUMBER I2S_NUM_0

#define MODE_MIC 0
#define MODE_SPK 1

int i_raw_data = 0;
int j_raw_data = 0;

const i2s_port_t I2S_PORT = I2S_NUM_0;
const int BLOCK_SIZE = 1024;

int32_t samples[BLOCK_SIZE];
float input_vector[NUMBER_OF_INPUTS]; 
float temp_data[NUMBER_OF_INPUTS]; 
float output_vector[NUMBER_OF_OUTPUTS] = {0, 0, 0};
String labels[NUMBER_OF_OUTPUTS] = {"covid", "noise", "not_covid"};

float min_value = 0.0;
float max_value = 0.0;

int num_bytes_read = 0;
int samples_read = 0;

// To check at home try my one wifi
const char* ssid = "Dr.Jarain78";
const char* password = "pit_2021";
//const char* ssid = "devolo-435";
//const char* password = "XOONBULHTQLMUPLI";
