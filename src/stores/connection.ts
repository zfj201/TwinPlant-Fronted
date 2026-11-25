import { acceptHMRUpdate, defineStore } from "pinia";
import { ref } from "vue";

export type ConnectionStatus =
  | "idle"
  | "connecting"
  | "connected"
  | "reconnecting"
  | "disconnected";

// MQTT 连接状态。只由 services/mqtt 写入，组件只读。
export const useConnectionStore = defineStore("connection", () => {
  const status = ref<ConnectionStatus>("idle");
  // 最近一次错误，连上后清空
  const lastError = ref("");
  // 到 broker 的往返时间，ms。还没测量或未连接时为 null
  const rttMs = ref<number | null>(null);

  function setStatus(next: ConnectionStatus) {
    status.value = next;
    if (next === "connected") {
      lastError.value = "";
    } else {
      rttMs.value = null;
    }
  }

  function setError(message: string) {
    lastError.value = message;
  }

  function setRtt(ms: number) {
    rttMs.value = ms;
  }

  return { status, lastError, rttMs, setStatus, setError, setRtt };
});

