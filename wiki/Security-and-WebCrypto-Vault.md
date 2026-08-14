# 🔐 Security & WebCrypto AES-GCM 256-bit Vault

## Privacy-by-Design
MojaMind adheres to strict participant privacy requirements:
- **Zero Cloud Storage of Personal Journals**: Reflections, speech-to-text transcripts, and custom drawings remain on the participant's physical device.
- **Hardware-Backed WebCrypto API**: Uses modern browser WebCrypto primitives (`crypto.subtle`) for encryption.
- **AES-GCM 256-bit**: Journal entries and personal identity records are encrypted with symmetric 256-bit AES in Galois/Counter Mode.
- **PBKDF2 Key Derivation**: When the user sets a PIN, a strong cryptographic key is derived using PBKDF2 with 100,000 iterations of SHA-256 and unique salt.
