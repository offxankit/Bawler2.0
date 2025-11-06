# Twilio Setup Guide - SMS & WhatsApp Integration

This guide will help you set up Twilio to send QR codes via SMS and WhatsApp.

## 🚀 Quick Setup (5-10 minutes)

### Step 1: Create Twilio Account

1. **Go to**: https://www.twilio.com/try-twilio
2. **Sign Up** with your email
3. **Verify your email** and phone number
4. **Free Trial Benefits**:
   - $15.50 free credit
   - Send to verified numbers only (upgrade for unrestricted access)
   - Perfect for testing!

### Step 2: Get Your Credentials

1. **Login to Twilio Console**: https://console.twilio.com/
2. **Find on Dashboard**:
   - **Account SID**: (looks like `ACxxxxx...`)
   - **Auth Token**: Click "Show" to reveal (looks like `xxxxx...`)
   - Copy both for later

### Step 3: Get a Phone Number (for SMS)

1. **In Twilio Console**, click **Phone Numbers** → **Manage** → **Buy a number**
2. **Select Country**: Choose your country (e.g., United States)
3. **Capabilities**: Ensure "SMS" is checked
4. **Search** and **Buy** a number (FREE with trial credits!)
5. **Copy the phone number** (format: +1234567890)

### Step 4: Set Up WhatsApp (Optional)

**Option A: Twilio Sandbox (Free, Instant Setup)**

1. Go to: **Messaging** → **Try it out** → **Send a WhatsApp message**
2. **Follow the instructions**:
   - Send "join [your-code]" to the Twilio WhatsApp number
   - Example: Send "join cotton-mountain" to +1 415 523 8886
3. **Sandbox Number**: `whatsapp:+14155238886` (default in code)
4. **Note**: Users must join your sandbox first

**Option B: WhatsApp Business API (Production)**

1. **Apply** for WhatsApp Business API in Twilio Console
2. **Approval Required**: Takes 1-3 business days
3. **Costs**: Pay-as-you-go pricing
4. **Benefits**: No sandbox restrictions

### Step 5: Update .env File

Open `c:\Users\asus\Desktop\bawler2.0\.env` and add:

```env
# Twilio Configuration
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890

# Optional: WhatsApp (use sandbox number or your approved number)
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

# Your app URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Replace with YOUR actual values!**

### Step 6: Test It!

1. **Start the app**:
   ```bash
   npm run dev
   ```

2. **Create a ticket** with:
   - Customer phone (must be verified in Twilio trial)
   - Select "SMS", "WhatsApp", or "Both"

3. **Check**:
   - SMS arrives at customer's phone
   - WhatsApp message appears in WhatsApp app

---

## 📱 Phone Number Format

**IMPORTANT**: Phone numbers must include country code:

✅ **Correct**:
- `+1234567890` (USA)
- `+44123456789` (UK)
- `+919876543210` (India)

❌ **Incorrect**:
- `1234567890` (missing +)
- `01234567890` (missing country code)

---

## 💰 Twilio Pricing (After Trial)

### SMS
- **USA**: ~$0.0079 per message
- **India**: ~$0.0054 per message
- **UK**: ~$0.0490 per message

### WhatsApp
- **Conversation-based pricing**
- **First 1,000 conversations/month**: FREE
- **After that**: ~$0.005 per conversation

### Monthly Phone Number
- **USA**: $1.00/month
- **Toll-free**: $2.00/month

**Typical Usage**: $5-10/month for small events (100-200 tickets)

---

## 🧪 Testing with Trial Account

### Trial Limitations:
- ✅ Can send to verified phone numbers
- ✅ Full functionality for testing
- ❌ Cannot send to unverified numbers
- ❌ SMS includes "Sent from your Twilio trial account" message

### How to Verify Numbers (Trial):
1. **Console** → **Phone Numbers** → **Verified Caller IDs**
2. **Add new number** → Enter phone
3. **Verify** via SMS code
4. Now you can send to this number!

### Upgrade When Ready:
- Click **Upgrade** in console
- Add payment method
- No trial restrictions anymore!

---

## 🔧 Troubleshooting

### Issue 1: "Twilio not configured" message

**Cause**: Missing credentials in `.env` file

**Solution**:
```env
# Make sure these are in your .env file:
TWILIO_ACCOUNT_SID=ACxxxxx...
TWILIO_AUTH_TOKEN=xxxxx...
TWILIO_PHONE_NUMBER=+1234567890
```

Then restart the server:
```bash
# Stop server (Ctrl + C)
npm run dev
```

### Issue 2: SMS not sending

**Check**:
- [ ] Phone number is verified (trial account)
- [ ] Phone number format includes `+` and country code
- [ ] TWILIO_PHONE_NUMBER is correct in `.env`
- [ ] Account has credit (check Twilio Console)

**View Logs**:
- Check Twilio Console → **Monitor** → **Logs** → **Messaging**
- See error details for failed messages

### Issue 3: WhatsApp not working

**For Sandbox**:
- [ ] Customer has joined your sandbox
- [ ] Send "join [code]" to +1 415 523 8886
- [ ] Code matches your sandbox code

**For Business API**:
- [ ] WhatsApp number is approved
- [ ] Template messages are approved
- [ ] Correct number in `.env`

### Issue 4: "Unverified number" error (Trial)

**Solution**:
1. Go to **Phone Numbers** → **Verified Caller IDs**
2. Verify the customer's number
3. Try sending again

**OR upgrade** to remove verification requirement

---

## 🎯 Message Content

The system sends this message:

```
Hi {Customer Name}! 🎟️

Your ticket for "{Event Name}" has been generated successfully!

📋 Ticket ID: TKT-XXXXX-XXXXX

🔗 View your QR code: http://localhost:3000/ticket/TKT-XXXXX-XXXXX

Show this QR code at the event entrance for entry verification.

See you at the event! 🎉
```

---

## 🌐 Production Deployment

When deploying to production:

1. **Update .env**:
   ```env
   NEXT_PUBLIC_APP_URL=https://yourdomain.com
   ```

2. **Use Environment Variables** (Vercel, Netlify, etc.):
   - Add Twilio credentials as environment variables
   - Never commit `.env` to Git!

3. **WhatsApp**: Use approved Business API (not sandbox)

4. **Phone Number**: Consider toll-free for USA

---

## 📊 Monitor Usage

### Twilio Console:
- **Usage** → **Voice & Messaging**
- See costs per day/month
- Set up usage alerts

### Set Spending Limit:
1. **Account** → **Billing**
2. **Add spending limit**
3. Get notified when approaching limit

---

## 🎓 Resources

- **Twilio Docs**: https://www.twilio.com/docs
- **SMS API**: https://www.twilio.com/docs/sms
- **WhatsApp API**: https://www.twilio.com/docs/whatsapp
- **Node.js SDK**: https://www.twilio.com/docs/libraries/node
- **Support**: https://support.twilio.com

---

## 🚫 Without Twilio

If you don't want to use Twilio:

1. **Select "Don't Send"** when creating tickets
2. **Manually share** QR code:
   - Download QR code image
   - Send via email, WhatsApp manually
   - Share ticket link directly

3. **Alternative**: Copy ticket link and send:
   ```
   http://localhost:3000/ticket/TKT-XXXXX-XXXXX
   ```

---

## ✅ Quick Test Checklist

Before using in production:

- [ ] Twilio account created
- [ ] Credentials added to `.env`
- [ ] Phone number purchased
- [ ] Test number verified (trial)
- [ ] SMS test successful
- [ ] WhatsApp sandbox joined (if using)
- [ ] WhatsApp test successful
- [ ] Message content looks good
- [ ] QR code link works
- [ ] Ready for production!

---

## 💡 Tips

1. **Start with trial**: Test everything for free
2. **Use sandbox**: WhatsApp testing without approval
3. **Verify numbers**: Add test numbers during trial
4. **Monitor costs**: Set alerts in Twilio
5. **Upgrade when ready**: Remove restrictions
6. **Use toll-free**: Better delivery for USA
7. **Template messages**: Required for WhatsApp Business

---

## 🆘 Need Help?

**Can't get it working?**
1. Check console logs (F12 in browser)
2. Check Twilio Console → Logs
3. Verify all credentials are correct
4. Ensure server restarted after .env changes
5. Try "Don't Send" option and share link manually

**Still stuck?**
- Twilio Support: https://support.twilio.com
- Documentation: Follow this guide step-by-step
- Alternative: Use manual sharing method

Good luck! 🎉
https://github.com/offxankit/Bawler2.0