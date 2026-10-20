# Axia Kairos Backend & PostgreSQL Service

This folder contains the standalone backend service for **Axia Kairos**, handling:
- **Contact Inquiries**: Storing messages submitted through the `/contact` page in PostgreSQL.
- **Admin Portal API**: Authentication with credentials `admin` / `admin123`, JWT token issuance, listing inquiries, updating message statuses (`read`, `unread`, `archived`, `replied`), and deleting inquiries.
- **Enterprise AI Assistant**: SSE streaming retrieval and chat completions.

---

## 🚀 Deploying to Railway (Separate Repository)

### 1. Push this folder to a GitHub Repository
If deploying in a separate repository:
1. Copy the contents of this `server/` directory into a new GitHub repository (e.g. `axia-backend`).
2. Include `server/knowledge.json` (or generate it with `npm run kb:build`).

### 2. Create a Railway Project
1. Log in to [Railway](https://railway.app/).
2. Click **New Project** -> **Deploy from GitHub repo**.
3. Select your repository.
4. Add a **PostgreSQL** service to the project:
   - Click **+ New** -> **Database** -> **Add PostgreSQL**.
   - Railway will automatically provision PostgreSQL and set the `DATABASE_URL` environment variable for your service!
   - Table `contact_messages` will be automatically created on boot if it does not already exist.

### 3. Environment Variables on Railway
In your Railway service settings, configure:
| Variable | Description | Example / Default |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | Injected automatically by Railway PostgreSQL |
| `ADMIN_JWT_SECRET` | Secret key for signing admin tokens | `axia-admin-super-secret-key-2026` |
| `PORT` | HTTP port | `3001` (or Railway's default `$PORT`) |
| `ALLOWED_ORIGINS` | Permitted frontend origins | `https://your-frontend.vercel.app,http://localhost:5173` |
| `ANTHROPIC_API_KEY` | Optional: Anthropic Claude API Key | `sk-ant-...` |

### 4. Connect Frontend on Vercel
In your Vercel Project settings for the frontend:
- Add Environment Variable:
  ```env
  VITE_API_URL=https://your-backend.up.railway.app
  ```
The frontend automatically directs `/api/contact` and `/api/admin/*` calls to this Railway URL!

---

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Run the backend locally
npm run dev

# Run automated tests
npm run test:admin
```
When running locally without `DATABASE_URL`, the server automatically falls back to persistent file storage in `server/data/contact_messages.json` so you can develop offline without needing a local PostgreSQL instance installed.
