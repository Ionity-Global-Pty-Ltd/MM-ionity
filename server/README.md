# MojaMind Study API — Azure Functions

Ready-to-deploy backend for the MojaMind PWA. Implements the `MMSync` contract:
`POST /api/ingest`, `GET /api/messages` (admin), `GET /api/config`. Stores data in
**Azure Table Storage** (cheapest durable option for this low-volume study).

## Contents
```
server/
  host.json                # Functions host config
  package.json             # @azure/data-tables
  local.settings.json.sample  # copy to local.settings.json for local dev
  shared/table.js          # table client + CORS + key auth
  ingest/                  # POST /api/ingest   (write token)
  messages/                # GET  /api/messages (ADMIN key)
  config/                  # GET  /api/config   (public)
```

## Prerequisites
- [Azure CLI](https://learn.microsoft.com/cli/azure/) and [Azure Functions Core Tools v4](https://learn.microsoft.com/azure/azure-functions/functions-run-local)
- Node.js 18+

## 1. Create Azure resources (South Africa North for POPIA)
```bash
az group create -n mojamind-rg -l southafricanorth
az storage account create -n mojamindstore -g mojamind-rg -l southafricanorth --sku Standard_LRS
az functionapp create -n mojamind-api -g mojamind-rg \
  --storage-account mojamindstore --consumption-plan-location southafricanorth \
  --runtime node --runtime-version 20 --functions-version 4
```

## 2. Configure app settings (secrets)
```bash
STORAGE_CONN=$(az storage account show-connection-string -n mojamindstore -g mojamind-rg -o tsv)
az functionapp config appsettings set -n mojamind-api -g mojamind-rg --settings \
  STORAGE_CONN="$STORAGE_CONN" \
  MM_TABLE="mojamind" \
  MM_WRITE_KEY="<public-write-token>" \
  MM_ADMIN_KEY="<secret-admin-token>" \
  CORS_ALLOWED_ORIGIN="https://ionity.art"
az functionapp cors add -n mojamind-api -g mojamind-rg --allowed-origins https://ionity.art
```

## 3. Deploy
```bash
cd server
npm install
func azure functionapp publish mojamind-api
```
Your base URL is then `https://mojamind-api.azurewebsites.net/api`.

## 4. Point the app at it
In `js/data.js`:
```js
MM.SYNC = { enabled: true, base: 'https://mojamind-api.azurewebsites.net/api',
            key: '<public-write-token>', studyId: 'creative-resilience-2026', flushMs: 15000 };
```
Redeploy the PWA. Complete a survey on a device → a row appears in the `mojamind` table.

## 5. Admin inbox
The in-app **All Messages** inbox (facilitator mode) calls `GET /api/messages`, which
requires the **admin** key. Keep `MM_ADMIN_KEY` secret — do **not** put it in `MM.SYNC.key`.
For production, prefer protecting `/messages` with Entra ID instead of a shared key.

## Local dev
```bash
cp local.settings.json.sample local.settings.json   # fill in values (Azurite ok for storage)
npm install && func start
```

## Security / POPIA
- Data stays in **South Africa North**; Table Storage is encrypted at rest; TLS in transit.
- Participant IDs are anonymised (`MM-<uuid>`), never names.
- `ingest` takes a public **write-only** token; `messages` requires a separate **admin** secret.
- Add a retention/erasure function for right-to-deletion requests.

*© 2026 Ionity (Pty) Ltd — MojaMind Creative Resilience.*
