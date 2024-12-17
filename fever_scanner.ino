#include <WiFi.h>
#include <FirebaseESP32.h>

// Replace these with your network credentials
#define WIFI_SSID "your-SSID"
#define WIFI_PASSWORD "your-PASSWORD"

// Replace these with your Firebase project credentials
#define FIREBASE_HOST "your-project-id.firebaseio.com"
#define FIREBASE_AUTH "your-database-secret"

FirebaseData firebaseData;

const int lm34Pin = 34; // Analog pin connected to LM34

void setup() {
  Serial.begin(115200);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }
  Serial.println();
  Serial.print("Connected with IP: ");
  Serial.println(WiFi.localIP());

  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  Firebase.reconnectWiFi(true);
}

void loop() {
  int analogValue = analogRead(lm34Pin);
  float temperature = (analogValue * 3.3 / 4095.0) * 100.0; // Convert analog value to temperature

  if (Firebase.setFloat(firebaseData, "/fever_scanner/temperature", temperature)) {
    Serial.println("Temperature data sent to Firebase");
  } else {
    Serial.println("Failed to send data to Firebase");
    Serial.println(firebaseData.errorReason());
  }

  delay(10000); // Send data every 10 seconds
}
