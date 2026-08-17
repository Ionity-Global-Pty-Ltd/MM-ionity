# 🔐 Security, Privacy & WebCrypto AES-GCM Vault

## 📌 Privacy-by-Design & Data Sovereignty

MojaMind is designed for vulnerable populations, including adolescent girls and young women (AGYW), requiring the highest standards of data security, confidentiality, and compliance with the **South African Protection of Personal Information Act (POPIA)** and **GDPR**.

---

## 🔒 Cryptographic Architecture (`js/vault.js`)

```
┌────────────────────────────────────────────────────────────────────────┐
│                   WEBCRYPTO ENCRYPTION ARCHITECTURE                    │
├────────────────────────────────────────────────────────────────────────┤
│ 1. User PIN Entry (4–6 Digits)                                         │
│    │                                                                   │
│    ▼                                                                   │
│ 2. Salt Generation (crypto.getRandomValues — 16 Bytes Unique Salt)      │
│    │                                                                   │
│    ▼                                                                   │
│ 3. PBKDF2 Key Derivation (100,000 Iterations · HMAC-SHA-256)           │
│    │                                                                   │
│    ▼                                                                   │
│ 4. 256-bit AES-GCM Symmetric Key Import                                │
│    │                                                                   │
│    ▼                                                                   │
│ 5. AES-GCM Authenticated Encryption (12-Byte IV per Entry)             │
│    │                                                                   │
│    ▼                                                                   │
│ 6. Encrypted Ciphertext + Auth Tag Stored in Client-Side Storage       │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🛡️ Key Security Properties

### 1. Zero-Knowledge Local Storage
* Personal journal entries, freeform reflections, custom drawings, and sensitive demographics are encrypted prior to being written to storage.
* Neither application administrators nor server infrastructure can read local journal records without the user's secret PIN.

### 2. Standardized WebCrypto Primitives
* Uses native browser `window.crypto.subtle` APIs implemented in hardware-backed secure enclaves where available.
* Avoids vulnerable third-party JavaScript crypto polyfills.

### 3. Protection Against Local Device Snooping
* If a participant shares their mobile phone with family members or friends, the encrypted vault automatically locks upon app suspension or after 5 minutes of inactivity.
* Unlocking requires re-entry of the user's PIN.

---

*© 2026 IONITY Global (Pty) Ltd · Solutionist: Johan Wilhelm van Antwerp*
