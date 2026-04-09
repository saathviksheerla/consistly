# Setup Guide: Environment Variables

Here is how to get the necessary API keys for your `.env.local` file to get the new backend working.

## 1. NEXTAUTH_SECRET (Already Generated for you!)

NextAuth requires a secret key to encrypt active user sessions.
_(I have already generated a secure token for you inside `.env.local`!)_
If you ever need to generate a new one, run: `openssl rand -base64 32` in your terminal.

---

## 2. MONGODB_URI

This connects your app to your remote MongoDB database.
**How to get it:**

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and create a free account.
2. Build a **Free "M0" Cluster** (AWS or Google Cloud region works fine).
3. Once created, click **"Connect"** on your cluster.
4. Go to **Database Access** on the left sidebar and create a new Database User (username and password).
5. Go to **Network Access** on the left sidebar and add `0.0.0.0/0` to the IP Access List (this allows you to connect from anywhere, including Vercel later).
6. Under "Choose a connection method", select **Drivers**.
7. Copy the connection string. It looks like this:
   `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`
8. Paste it into `.env.local` as `MONGODB_URI`.
   _Important_: Replace `<username>` and `<password>` with the database credentials you made in Step 4. You can also append a database name before the `?` like `mongodb.net/consistly_db?retryWrites...`

---

## 3. GitHub OAuth (Optional but Recommended)

Lets users sign in with 1-click using their GitHub accounts.
**How to get it:**

1. Go to your [GitHub Developer Settings -> OAuth Apps](https://github.com/settings/developers).
2. Click **"New OAuth App"**.
   - **Application Name:** consistly
   - **Homepage URL:** `http://localhost:3000`
   - **Authorization callback URL:** `http://localhost:3000/api/auth/callback/github`
3. Click "Register application".
4. Copy the **Client ID** and paste it into `.env.local` as `GITHUB_ID`.
5. Click **"Generate a new client secret"**, copy it, and paste it as `GITHUB_SECRET`.

---

## 4. Google OAuth (Optional)

Lets users sign in using their Google accounts.
**How to get it:**

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a New Project named "consistly".
3. Navigate to **APIs & Services -> OAuth consent screen**.
   - Choose **External** and fill in the required App name and email fields.
4. Navigate to **APIs & Services -> Credentials**.
5. Click **"+ CREATE CREDENTIALS"** -> **"OAuth client ID"**.
   - **Application Type:** Web application
   - **Authorized JavaScript origins:** Add `http://localhost:3000`
   - **Authorized redirect URIs:** Add `http://localhost:3000/api/auth/callback/google`
6. Click "Create".
7. Copy the **Client ID** and **Client Secret**, and paste them into `.env.local` as `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`.

---

**Once you have filled out your `.env.local`, restart your Next.js server (`Ctrl+C` then `npm run dev`) and you can log in natively!**
