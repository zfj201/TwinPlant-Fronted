import { getMqttClient } from "./connection";
import { topicGwStatus, topicGwData, topicDevData } from "./config";

export function registerMqttHandlers() {
  const client = getMqttClient();

  if (!client) return;

  client.on("message", (topic, payload) => {
    try {
      const message = JSON.parse(payload.toString());
      console.log("MQTT message received:", topic, message);

      switch (topic) {
        case topicGwStatus(message.gatewayId):
          break;
        case topicGwData(message.gatewayId):
          break;
        case topicDevData(message.deviceId):
          break;
      }
    } catch (error) {
      console.error("[MQTT] message parse failed:", error);
    }
  });
}
