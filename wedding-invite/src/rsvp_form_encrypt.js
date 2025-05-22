import CryptoJS from 'crypto-js';

const secretKey = "q7EDXy7aVaDdnFOZG8FhRlePvKxXU3n97nMKxDz0dbU=";

function wordArrayToUint8Array(wordArray) {
  const words = wordArray.words;
  const sigBytes = wordArray.sigBytes;
  const u8 = new Uint8Array(sigBytes);
  for (let i = 0; i < sigBytes; i++) {
    u8[i] = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
  }
  return u8;
}

export const encryptData = (formData) => {
  const json = JSON.stringify(formData);
  const key = CryptoJS.SHA256(secretKey);
  const iv = CryptoJS.lib.WordArray.random(16);
  const encrypted = CryptoJS.AES.encrypt(json, key, { iv });

  const ivBytes = wordArrayToUint8Array(iv);
  const ctBytes = wordArrayToUint8Array(encrypted.ciphertext);

  // Склеиваем iv + ciphertext
  const fullBytes = new Uint8Array(ivBytes.length + ctBytes.length);
  fullBytes.set(ivBytes, 0);
  fullBytes.set(ctBytes, ivBytes.length);

  // Кодируем всё в одну base64-строку
  const fullBase64 = btoa(String.fromCharCode(...fullBytes));
  return fullBase64;
};

export const sendEncryptedData = async (encryptedString, captchaToken) => {
    try {
      const res = await fetch("http://172.20.10.18:5001/webhook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          payload: encryptedString,
          captcha: captchaToken, // ✅ добавлено!
        }),
      });
      const data = await res.text();
      return data;
    } catch (err) {
      console.error("Ошибка отправки:", err);
      return null;
    }
  };
  
  