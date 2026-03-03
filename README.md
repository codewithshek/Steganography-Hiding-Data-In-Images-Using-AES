# Advanced Image Steganography

### A Premium High-Security Application for Data Encapsulation using AES-256 and LSB Steganography.

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.13+-blue.svg" alt="Python">
  <img src="https://img.shields.io/badge/React-19-cyan.svg" alt="React">
  <img src="https://img.shields.io/badge/Flask-Latest-lightgrey.svg" alt="Flask">
  <img src="https://img.shields.io/badge/OpenCV-Latest-green.svg" alt="OpenCV">
  <img src="https://img.shields.io/badge/TailwindCSS-4-teal.svg" alt="TailwindCSS">
</p>

---

## 🛡️ About the Project

**Advanced Image Steganography** is a premium, high-security web application that combines **AES-256 Cryptography** with **LSB (Least Significant Bit) Steganography**. It allows users to encrypt secret messages and hide them deep within the pixel matrix of standard PNG/JPG images.

### 🚀 Key Innovation: **Dual-Layer Security Architecture**

Unlike standard steganography tools, employs a dual-layered approach:

- **Military-Grade Encryption:** The text message is padded and encrypted using AES-256-CBC with a user-provided passphrase before embedding.
- **Deterministic LSB Encoding:** Uses advanced image processing to ensure zero visual distortion in the carrier image by injecting into the Least Significant Bits of the RGB channels, preserving original aesthetics while hiding data in plain sight.

---

## 📷 Pictures

|          Ouput         | 
| ![input.png](input.png) |

## 🏗️ Technical Architecture

This system is engineered for dual-layer security with a decoupled full-stack architecture:

### 🧠 The Core Engine (Encryption & Embedding)

- **Cryptography Component:** Utilizing **PyCryptodome** to securely encrypt data with AES-256-CBC.
- **Image Processing Component:** Utilizing **OpenCV** and **NumPy** for advanced matrix operations, deterministically weaving the encrypted byte-stream into the carrier image pixels.

### ⚡ Backend Services

- **Flask & Gunicorn:** Serves the backend processing engine via high-performance REST endpoints.
- **Lossless Retrieval:** Pure pixel-to-byte extraction ensures your secrets are recovered exactly as they were hidden.

### 🔮 Frontend Interface

- **React 19 & Vite:** Built with the latest React features for a responsive, component-driven UI.
- **Visuals:** A Modern Noir Aesthetics theme incorporating **Tailwind CSS** and **GSAP** for smooth animations, fluid cinematic transitions, and a premium dark-themed aesthetic.

---

## 📁 Directory structure

```
codewithshek-steganography-hiding-data-in-images-using-aes/
    ├── README.md
    ├── package.json
    ├── render.yaml
    ├── backend/
    │   ├── aes_cipher.py
    │   ├── app.py
    │   ├── requirements.txt
    │   ├── steganography.py
    │   ├── test_manual.py
    │   └── test_post.py
    └── frontend/
        ├── eslint.config.js
        ├── index.html
        ├── netlify.toml
        ├── package.json
        ├── tsconfig.app.json
        ├── tsconfig.json
        ├── tsconfig.node.json
        ├── vite.config.ts
        ├── .gitignore copy
        └── src/
            ├── App.css
            ├── App.tsx
            ├── index.css
            ├── main.tsx
            └── components/
                └── ThemeToggle.tsx
```

## 🌟 Key Features

- 🧠 **Dual-Layer Security:** Messages are first encrypted using AES-256 and then woven into an image.
- 📊 **Deterministic LSB Encoding:** Uses advanced image processing to ensure zero visual distortion in the carrier image.
- 🤖 **Modern Noir Aesthetics:** A premium, dark-themed UI built with React, GSAP, and Tailwind CSS for fluid, cinematic transitions.
- 📉 **Auto-Transfer Flow:** Encrypted images are automatically mounted to the decryption module for seamless verification.
- 🛡️ **Lossless Retrieval:** Pure pixel-to-byte extraction ensures your secrets are recovered exactly as they were hidden.

---

## 🛠️ Tech Stack

| Component       | Technologies                                                |
| :-------------- | :---------------------------------------------------------- |
| **Core Engine** | `Python 3.13`, `OpenCV`, `NumPy`, `PyCryptodome`            |
| **Backend API** | `Flask`, `Gunicorn`, `Werkzeug`, `Flask-CORS`               |
| **Frontend UI** | `React 19`, `Vite`, `Tailwind CSS`, `Framer Motion`, `GSAP` |

---

## ⚙️ Installation & Setup

Follow these steps to deploy the application locally.

### Step 1: Clone the Repository

```bash
git clone https://github.com/codewithshek/Steganography-Hiding-Data-In-Images-Using-AES.git
cd Steganography-Hiding-Data-In-Images-Using-AES
```

### Step 2: Backend Setup

Initialize the core engine and Flask API server.

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

### Step 3: Frontend Setup

Launch the interactive user interface.

```bash
cd frontend
npm install
npm run dev
```

---

## 📈 Security Performance

The Dual-Layer formulation ensures high data confidentiality. The initial AES-256 encryption encrypts plaintext making it highly resistant to brute-force attacks. Furthermore, the LSB embedding methodology provides robust steganographic security by modifying the least significant bits, creating zero perceptible visual distortion in the carrier image, avoiding suspicion entirely.

---

## 📜 Disclaimer

This Project Is Part Of My College course end Project.
