#include <WiFi.h>
#include <FirebaseESP32.h>

// Replace with your network credentials
const char* ssid = "wifi nila ky";
const char* password = "WALAkangpake00554900";

// Firebase project credentials
#define FIREBASE_HOST "fever-scan.firebaseio.com"
#define FIREBASE_AUTH "bT5dPVtF48u84p79VJD3EZmQwJTzWJStgtSrjj3d"

// Firebase Data object
FirebaseData firebaseData;

void setup() {
  Serial.begin(115200);
  
  // Connect to Wi-Fi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");

  // Initialize Firebase
  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  Firebase.reconnectWiFi(true);
}

void loop() {
  // Example data to store
  float temperature = 25.0;
  String path = "/temperatures/" + String(millis());

  // Store data in Firestore
  if (Firebase.setFloat(firebaseData, path, temperature)) {
    Serial.println("Data stored successfully");
  } else {
    Serial.println("Failed to store data");
    Serial.println("Reason: " + firebaseData.errorReason());
  }

  // Wait for 10 seconds before sending the next data
  delay(10000);
}
