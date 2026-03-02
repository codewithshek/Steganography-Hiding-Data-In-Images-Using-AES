from Crypto.Cipher import AES
from Crypto.Protocol.KDF import PBKDF2
from Crypto.Random import get_random_bytes
import base64

class AESCipher:
    def __init__(self, password: str):
        self.password = password
        self.salt_size = 16
        self.key_size = 32 # 256 bits

    def _derive_key(self, salt: bytes) -> bytes:
        # PBKDF2 is used to derive a strong key from the user's password
        return PBKDF2(self.password, salt, dkLen=self.key_size, count=1000000)

    def encrypt(self, plain_text: str) -> bytes:
        """
        Encrypts plaintext using AES-256-GCM.
        Returns bytes format: [SALT (16 bytes) | NONCE (16 bytes) | TAG (16 bytes) | CIPHERTEXT]
        """
        salt = get_random_bytes(self.salt_size)
        key = self._derive_key(salt)
        
        # GCM mode provides both confidentiality and data authenticity (integrity)
        cipher = AES.new(key, AES.MODE_GCM)
        nonce = cipher.nonce
        
        cipher_text, tag = cipher.encrypt_and_digest(plain_text.encode('utf-8'))
        
        # Combine everything into a single byte stream
        return salt + nonce + tag + cipher_text

    def decrypt(self, encrypted_data: bytes) -> str:
        """
        Decrypts data using AES-256-GCM.
        Returns the original plaintext string.
        """
        if len(encrypted_data) < self.salt_size + 16 + 16:
            raise ValueError("Invalid encrypted data format")

        # Extract the components
        salt = encrypted_data[:self.salt_size]
        nonce = encrypted_data[self.salt_size:self.salt_size + 16]
        tag = encrypted_data[self.salt_size + 16:self.salt_size + 32]
        cipher_text = encrypted_data[self.salt_size + 32:]

        key = self._derive_key(salt)
        cipher = AES.new(key, AES.MODE_GCM, nonce=nonce)
        
        try:
            # Verify and decrypt
            plain_text_bytes = cipher.decrypt_and_verify(cipher_text, tag)
            return plain_text_bytes.decode('utf-8')
        except ValueError:
            raise ValueError("Decryption failed. Incorrect password or corrupted data.")
