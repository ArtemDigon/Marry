from flask import Flask, request
from flask_cors import CORS
import base64, json, hashlib, csv, os, requests
from Crypto.Cipher import AES
from Crypto.Util.Padding import unpad

app = Flask(__name__)
CORS(app)

# 🔐 Твой ключ шифрования
SECRET_KEY = "q7EDXy7aVaDdnFOZG8FhRlePvKxXU3n97nMKxDz0dbU="

# 📁 CSV-файл
CSV_FILENAME = "responses.csv"

# 🛡️ Секретный ключ reCAPTCHA (из Google reCAPTCHA admin panel)
RECAPTCHA_SECRET_KEY = "6LciuEQrAAAAAI_GbM-o1DE1vC4Hsni-iiB95nc3"  # 👈 ВСТАВЬ СЮДА!

# При первом запуске создаём CSV
if not os.path.exists(CSV_FILENAME):
    with open(CSV_FILENAME, "w", newline="", encoding="utf-8") as f:
        csv.writer(f).writerow(["Имя", "Присутствие", "Трансфер"])

# ✅ Проверка токена reCAPTCHA у Google
def verify_recaptcha(token):
    response = requests.post(
        "https://www.google.com/recaptcha/api/siteverify",
        data={
            "secret": RECAPTCHA_SECRET_KEY,
            "response": token
        }
    )
    result = response.json()
    print("🔍 Ответ от Google:", result)
    return result.get("success", False)

# 🔓 Дешифровка зашифрованного payload
def decrypt_payload(ciphertext_b64: str) -> dict:
    raw = base64.b64decode(ciphertext_b64)
    key = hashlib.sha256(SECRET_KEY.encode()).digest()
    iv = raw[:16]
    ciphertext = raw[16:]
    cipher = AES.new(key, AES.MODE_CBC, iv)
    decrypted = unpad(cipher.decrypt(ciphertext), AES.block_size)
    return json.loads(decrypted.decode("utf-8"))

@app.route("/webhook", methods=["POST"])
def webhook():
    print("📥 request.json:", request.json)
    json_data = request.get_json()

    # 👉 Получаем токен капчи
    captcha_token = json_data.get("captcha")
    if not captcha_token or not verify_recaptcha(captcha_token):
        return "❌ Капча не пройдена", 400

    # 👉 Получаем и расшифровываем payload
    payload = json_data.get("payload")
    try:
        data = decrypt_payload(payload)
        print("🔓 Расшифровано:", data)
    except Exception as e:
        print("⛔ Ошибка расшифровки:", e)
        return f"Ошибка расшифровки: {str(e)}", 400

    # 👉 Записываем в CSV
    try:
        with open(CSV_FILENAME, "a", newline="", encoding="utf-8") as f:
            csv.writer(f).writerow([
                data.get("name", ""),
                data.get("attending", ""),
                data.get("transfer", "")
            ])
        print("✅ Данные сохранены")
    except Exception as e:
        print("🛑 Ошибка при записи:", e)
        return "Ошибка записи", 500

    return "✅ Сохранено"


# ▶️ Запуск
if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5001)
