import cv2
import numpy as np

class LSBSteganography:
    def __init__(self):
        # Delimiter to know when the message stops (we append this to the ciphertext)
        self.delimiter = b"<=|END|=>"

    def _modify_pixel_lsb(self, pixel_value: int, bit: int) -> int:
        """Replace the least significant bit of a pixel value with the given bit."""
        # Need to cast numpy uint8 to standard int before bitwise operations
        p_val = int(pixel_value)
        return (p_val & ~1) | bit

    def _get_pixel_lsb(self, pixel_value: int) -> int:
        """Extract the least significant bit from a pixel value."""
        return pixel_value & 1

    def encode(self, image: np.ndarray, secret_data: bytes) -> np.ndarray:
        """
        Embed secret data into an image using LSB steganography.
        Returns the modified image.
        """
        # Append delimiter so we know where to stop reading during extraction
        data_to_hide = secret_data + self.delimiter

        # Calculate max capacity: 1 bit per channel per pixel
        max_bytes = (image.shape[0] * image.shape[1] * 3) // 8
        if len(data_to_hide) > max_bytes:
            raise ValueError(f"Image too small or payload too large. Max allowed: {max_bytes} bytes")

        # Create a flattened binary representation of the data
        binary_data = "".join([f"{byte:08b}" for byte in data_to_hide])
        data_length = len(binary_data)

        # Create a copy so we don't mutate the original image in memory
        encoded_image = image.copy()
        
        # Flatten image to 1D to make iterating simple
        flat_image = encoded_image.reshape(-1)

        # Modify the LSB of each needed channel/pixel
        for i in range(data_length):
            bit = int(binary_data[i])
            flat_image[i] = self._modify_pixel_lsb(flat_image[i], bit)

        # Reshape back to original dimensions
        return flat_image.reshape(encoded_image.shape)

    def decode(self, image: np.ndarray) -> bytes:
        """
        Extract secret data from an image. Stops reading once it hits the delimiter.
        """
        flat_image = image.reshape(-1)
        
        extracted_bits = []
        extracted_bytes = bytearray()
        
        delimiter_bits = "".join([f"{b:08b}" for b in self.delimiter])
        delimiter_len = len(delimiter_bits)
        
        bit_buffer = ""
        
        for pixel_val in flat_image:
            bit = self._get_pixel_lsb(pixel_val)
            bit_buffer += str(bit)
            
            # If we've collected 8 bits, convert to a single byte
            if len(bit_buffer) == 8:
                byte_val = int(bit_buffer, 2)
                extracted_bytes.append(byte_val)
                
                # Check if the recent bytes collected match our delimiter
                # We can check by looking at the last few bytes directly
                if len(extracted_bytes) >= len(self.delimiter):
                    if extracted_bytes[-len(self.delimiter):] == self.delimiter:
                        # Found delimiter! Return the data before the delimiter
                        return bytes(extracted_bytes[:-len(self.delimiter)])
                
                # Reset bit buffer for next byte
                bit_buffer = ""

        raise ValueError("No hidden data or delimiter found in this image.")
