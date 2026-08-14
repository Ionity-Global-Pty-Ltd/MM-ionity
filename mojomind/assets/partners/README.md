# Partner logos

Official partner artwork shown on the opening splash screen:

| File | Partner | Notes |
| --- | --- | --- |
| `stellenbosch.webp` | Stellenbosch University | Official stacked lockup (mark + trilingual wordmark) on a light background; the splash renders it on a light rounded card |
| `gilead.png` | Gilead Sciences | Transparent PNG, ~360 × 120, light-on-dark version — still to be supplied |

The splash uses `onerror="this.remove()"`, so until a file is supplied the app
falls back to a styled text wordmark and nothing breaks. When the image loads,
`onload` adds `.has-img` and hides the text wordmark fallback.

Attribution shown on the splash and throughout the app:

> Welcome — powered by SHOUT-IT-NOW & Stellenbosch University · made possible by Gilead

© 2026 IONITY GLOBAL (PTY) LTD · <https://www.ionity.co.za>
