# 🌑 Obscura: Advanced Image Steganography

**Obscura** is a premium, high-security web application that combines **AES-256 Cryptography** with **LSB (Least Significant Bit) Steganography**. It allows users to encrypt secret messages and hide them deep within the pixel matrix of standard PNG/JPG images.

---

## ✨ Key Features

- **Dual-Layer Security**: Messages are first encrypted using AES-256 (military-grade) and then woven into an image.
- **Deterministic LSB Encoding**: Uses advanced image processing to ensure zero visual distortion in the carrier image.
- **Modern Noir Aesthetics**: A premium, dark-themed UI built with React and GSAP for fluid, cinematic transitions.
- **Auto-Transfer Flow**: Encrypted images are automatically mounted to the decryption module for seamless verification.
- **Lossless Retrieval**: Pure pixel-to-byte extraction ensures your secrets are recovered exactly as they were hidden.

---

## 🛠️ Technology Stack

### **Frontend**

- **React 19** (Vite)
- **Tailwind CSS** (Noir/Gold Design System)
- **GSAP** (Smooth, immersive animations)
- **Lucide React** (Minimalist iconography)

### **Backend**

- **Python / Flask**
- **OpenCV** (Advanced Image Manipulation)
- **PyCryptodome** (AES-256 Encryption)
- **NumPy** (Pixel matrix operations)

---

## 🚀 Getting Started

### **1. Clone the Repository**

```bash
git clone https://github.com/codewithshek/Steganography-Hiding-Data-In-Images-Using-AES.git
cd Steganography-Hiding-Data-In-Images-Using-AES
```

### **2. Setup Backend**

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

### **3. Setup Frontend**

```bash
cd frontend
npm install
npm run dev
```

---

## ☁️ Deployment Guide

This project is configured for a split-cloud deployment:

### **Netlify (Frontend)**

1. Connect your repository to **Netlify**.
2. Set **Base Directory** to `frontend`.
3. Set **Build Command** to `npm run build`.
4. Set **Publish Directory** to `dist`.
5. Add Environment Variable: `VITE_API_URL` = [Your Backend URL].

### **Render (Backend)**

1. Create a **Web Service** on **Render.com**.
2. Set **Root Directory** to `backend`.
3. Set **Build Command** to `pip install -r requirements.txt`.
4. Set **Start Command** to `gunicorn app:app`.

---

## 📜 How it Works

1.  **Encryption**: The text message is padded and encrypted using AES-256-CBC with a user-provided passphrase.
2.  **Conversion**: The encrypted ciphertext is converted into a bitstream.
3.  **Embedding**: The bitstream is injected into the Least Significant Bits of the image's RGB channels.
4.  **Decryption**: The process is reversed—bits are extracted, grouped into bytes, and decrypted back into plain text.

---

## ⚖️ License

Distributed under the MIT License. See `LICENSE` for more information.

---

**Built with 🖤 for secure communication.**
