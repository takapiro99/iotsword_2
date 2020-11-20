/*
  iotsword_2
*/

#include <FastLED.h>
#include <PubSubClient.h>
#include <WiFi.h>

// Some for LEDs
#define LED_PIN 13
#define NUM_LEDS 28
#define BRIGHTNESS 150
#define LED_TYPE WS2812B
#define COLOR_ORDER GRB
#define UPDATES_PER_SECOND 65

// Update these with values suitable for your network.

const char* ssid = "takapiro2";
const char* password = "2kumifriends";
const char* mqtt_server = "153.126.160.230";

CRGB leds[NUM_LEDS];
CRGBPalette16 currentPalette;
TBlendType currentBlending;

WiFiClient espClient;
PubSubClient client(espClient);
long lastMsg = 0;
char msg[50];
int value = 0;

void setup_wifi() {
  delay(10);
  Serial.println("");
  Serial.print("Connecting to ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  randomSeed(micros());
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void ledsetup() {
  delay(2000);  // power-up safety delay
  FastLED.addLeds<LED_TYPE, LED_PIN, COLOR_ORDER>(leds, NUM_LEDS)
      .setCorrection(TypicalLEDStrip);
  FastLED.setBrightness(BRIGHTNESS);
  // Palette1();
  currentBlending = LINEARBLEND;
}

void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message arrived [");
  if ((char)topic[0] == 'c') {
    int num = ((int)topic[6] - 48) * 10 + (int)topic[7] - 48;
    // chr to int, but there must be a better way
    Serial.print(num);
    Serial.print(": ");
    int r = ((int)payload[0] - 48) * 100 + ((int)payload[1] - 48) * 10 +
            (int)payload[2] - 48;
    int g = ((int)payload[3] - 48) * 100 + ((int)payload[4] - 48) * 10 +
            (int)payload[5] - 48;
    int b = ((int)payload[6] - 48) * 100 + ((int)payload[7] - 48) * 10 +
            (int)payload[8] - 48;
    Serial.print(r);
    Serial.print(",");
    Serial.print(g);
    Serial.print(",");
    Serial.print(b);
    Serial.print("] ");
    Serial.println();
    leds[num].r = r;
    leds[num].g = g;
    leds[num].b = b;
    FastLED.show();
  }
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Create a random client ID
    String clientId = "ESP8266Client-";
    clientId += String(random(0xffff), HEX);
    if (client.connect(clientId.c_str())) {
      Serial.println("connected");
      // Once connected, publish an announcement...
      client.subscribe("inTopic");
      client.subscribe("color/+");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);  // Wait 5 seconds before retrying
    }
  }
}

void setup() {
  Serial.begin(115200);
  setup_wifi();
  ledsetup();
  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();
}
