const API_BASE = import.meta.env.VITE_API_URL;

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

export const enablePushNotifications = async () => {
  if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) throw new Error("This browser does not support web push notifications.");
  const permission = await Notification.requestPermission();
  if (permission !== "granted") throw new Error("Notification permission was not granted.");
  const registration = await navigator.serviceWorker.register("/sw.js");
  await navigator.serviceWorker.ready;
  const keyResponse = await fetch(`${API_BASE}/api/notifications/public-key`);
  const keyResult = await keyResponse.json().catch(() => ({}));
  if (!keyResponse.ok) throw new Error(keyResult.message || "Push notifications are not configured on the server.");
  let subscription = await registration.pushManager.getSubscription();
  if (!subscription) subscription = await registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlBase64ToUint8Array(keyResult.publicKey) });
  const token = localStorage.getItem("token") || "";
  const response = await fetch(`${API_BASE}/api/notifications/subscribe`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(subscription.toJSON()) });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.message || "Failed to save notification subscription.");
  return subscription;
};

export const sendPushTest = async () => {
  const token = localStorage.getItem("token") || "";
  const response = await fetch(`${API_BASE}/api/notifications/test`, { method: "POST", headers: { Authorization: `Bearer ${token}` } });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.message || "Test notification failed.");
  return result;
};
