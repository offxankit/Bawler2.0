# MongoDB Setup Guide

MongoDB is not currently installed on your system. You have two options:

## Option 1: Use MongoDB Atlas (Cloud - RECOMMENDED & EASIEST)

**This is FREE and doesn't require installing anything locally!**

### Steps:

1. **Go to**: https://www.mongodb.com/cloud/atlas/register

2. **Create a Free Account**:
   - Sign up with email or Google
   - Choose the **FREE tier** (M0)

3. **Create a Cluster**:
   - Click "Build a Database"
   - Select "FREE" tier (M0)
   - Choose a cloud provider and region (closest to you)
   - Click "Create Cluster"

4. **Create Database User**:
   - Click "Database Access" in left sidebar
   - Click "Add New Database User"
   - Username: `eventuser`
   - Password: `eventpass123` (or your own secure password)
   - User Privileges: "Read and write to any database"
   - Click "Add User"

5. **Allow Network Access**:
   - Click "Network Access" in left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Click "Confirm"

6. **Get Connection String**:
   - Click "Database" in left sidebar
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (looks like):
     ```
     mongodb+srv://eventuser:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
     ```
   - Replace `<password>` with your actual password

7. **Update .env File**:
   Open `c:\Users\asus\Desktop\bawler2.0\.env` and update:
   ```env
   MONGODB_URI=mongodb+srv://eventuser:eventpass123@cluster0.xxxxx.mongodb.net/event-ticketing?retryWrites=true&w=majority
   ```
   ⚠️ Replace with YOUR actual connection string

8. **Done!** You can now run the application:
   ```bash
   npm run dev
   ```

---

## Option 2: Install MongoDB Locally

**Only choose this if you want to run MongoDB on your computer**

### Windows Installation:

1. **Download MongoDB**:
   - Go to: https://www.mongodb.com/try/download/community
   - Select: Windows
   - Click "Download"

2. **Install**:
   - Run the downloaded `.msi` file
   - Choose "Complete" installation
   - Install as a Windows Service (recommended)
   - Install MongoDB Compass (GUI tool)

3. **Verify Installation**:
   ```bash
   mongod --version
   ```

4. **Start MongoDB** (if not running as service):
   ```bash
   mongod
   ```

5. **Your .env is already configured** for local MongoDB:
   ```env
   MONGODB_URI=mongodb://localhost:27017/event-ticketing
   ```

6. **Run the application**:
   ```bash
   npm run dev
   ```

---

## Quick Start (If you're in a hurry)

I **strongly recommend Option 1 (MongoDB Atlas)** because:
- ✅ No installation needed
- ✅ Free forever for development
- ✅ Accessible from anywhere
- ✅ Automatic backups
- ✅ Takes only 5 minutes to setup
- ✅ Works on any computer

Option 2 requires:
- ⏱️ ~500MB download
- ⏱️ Installation and configuration
- 💻 Only works on your computer
- 🔧 Manual backups needed

---

## Verify It's Working

After setting up (either option), test the connection:

1. **Start the dev server**:
   ```bash
   npm run dev
   ```

2. **Look for this message** in the terminal:
   ```
   MongoDB connected successfully
   ```

3. **If you see this**, MongoDB is working! ✅

4. **If you see connection errors**:
   - Check your `.env` file has the correct connection string
   - Verify MongoDB Atlas IP whitelist includes your IP
   - Make sure your password doesn't have special characters (use simple alphanumeric)

---

## What's Next?

Once MongoDB is set up:

1. Open http://localhost:3000
2. Create an owner account
3. Generate a ticket with QR code
4. Create a client account
5. Scan the QR code using camera or upload

See `TESTING_GUIDE.md` for detailed testing instructions.

---

## Need Help?

**MongoDB Atlas Issues:**
- Make sure you replaced `<password>` with actual password
- Check Network Access allows your IP
- Database user has proper permissions

**Local MongoDB Issues:**
- Ensure MongoDB service is running
- Check Windows Services → MongoDB Server
- Try restarting the MongoDB service

**Connection String Format:**
```
# Atlas (Cloud):
mongodb+srv://username:password@cluster.mongodb.net/dbname

# Local:
mongodb://localhost:27017/dbname
```
