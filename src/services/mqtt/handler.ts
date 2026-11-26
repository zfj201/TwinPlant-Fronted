import { getMqttClient } from "./connection";
import { topicGwStatus, topicGwHeartbeat,topicGwError, topicDevData, topicDevCtrlAck, topicDevCtrlReq } from "./config";

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
        case topicGwHeartbeat(message.gatewayId):
          break;
        case topicGwError(message.gatewayId):
          break;
        case topicDevData(message.deviceId):
          break;
        case topicDevCtrlAck(message.deviceId):
          break;
        case topicDevCtrlReq(message.deviceId):
          break;
      }
    } catch (error) {
      console.error("[MQTT] message parse failed:", error);
    }
  });
}
