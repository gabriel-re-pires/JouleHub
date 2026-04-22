import { IMicrocontroller } from "@/core/types";

export const MACRO_CONTROLLERS: IMicrocontroller[] = [
  { id: "esp32", name: "ESP32 (Wi-Fi/Bluetooth)", maxCurrentDraw: 0.5 }, // 500mA
  { id: "esp8266", name: "ESP8266 (Wi-Fi)", maxCurrentDraw: 0.4 }, // 400mA
  { id: "arduino-nano", name: "Arduino Nano", maxCurrentDraw: 0.05 }, // 50mA
  { id: "raspberry-pi-pico", name: "Raspberry Pi Pico", maxCurrentDraw: 0.1 }, // 100mA
  { id: "custom", name: "Personalizado / Manual", maxCurrentDraw: 0 }, 
];
