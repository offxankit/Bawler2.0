# Event Ticketing System

A comprehensive event ticketing web application built with Next.js featuring QR code generation and verification.

## Features

### Owner Portal
- **Authentication**: Secure signup and login system
- **Ticket Generation**: Create event tickets with customer details
- **QR Code Generation**: Automatic QR code creation for each ticket
- **Smart Delivery**: Send QR codes via SMS, WhatsApp, or both (Twilio integration)
- **Public Ticket View**: Shareable link for customers to view and download QR code
- **Customer Management**: Store customer information including name, phone, email, and event details

### Client Portal
- **Authentication**: Separate login system for event staff
- **Dual Scan Methods**: 
  - Camera scanning for real-time QR code detection
  - Image upload for scanning saved QR code images
- **QR Scanner**: Built-in QR code scanner using device camera
- **Ticket Verification**: Real-time ticket validation
- **Entry Tracking**: Mark customer entry with timestamp
- **Duplicate Prevention**: Prevents scanning the same ticket twice

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Styling**: Tailwind CSS
- **QR Code**: qrcode library for generation, html5-qrcode for scanning
- **Icons**: Lucide React
- **SMS Integration**: Twilio (optional)

## Prerequisites

- Node.js 18+ installed
- MongoDB installed locally or MongoDB Atlas account
- (Optional) Twilio account for SMS notifications

## Installation

1. **Clone or navigate to the project directory**:
   ```bash
   cd c:\Users\asus\Desktop\bawler2.0
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   - Copy `.env.example` to `.env`:
     ```bash
     copy .env.example .env
     ```
   - Update the `.env` file with your configuration:
     ```env
     MONGODB_URI=mongodb://localhost:27017/event-ticketing
     JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
     TWILIO_ACCOUNT_SID=your-twilio-account-sid
     TWILIO_AUTH_TOKEN=your-twilio-auth-token
     TWILIO_PHONE_NUMBER=your-twilio-phone-number
     NEXT_PUBLIC_APP_URL=http://localhost:3000
     ```

4. **Start MongoDB** (if running locally):
   ```bash
   mongod
   ```

5. **Run the development server**:
   ```bash
   npm run dev
   ```

6. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### For Event Owners

1. **Sign Up**: Go to `/owner/signup` and create an owner account
2. **Login**: Access your dashboard at `/owner/login`
3. **Create Tickets**:
   - Fill in customer name (required)
   - Enter phone number (required)
   - Add email (optional)
   - Specify event name (required)
   - Add event date and additional details (optional)
4. **Choose Delivery Method**:
   - 📱 SMS - Send via text message
   - 💬 WhatsApp - Send via WhatsApp
   - 🔄 Both - Send via both channels
   - ⏭️ Don't Send - Generate only (share manually)
5. **Generate QR Code**: Click "Generate Ticket & QR Code"
6. **Automatic Delivery**: If selected, customer receives message with ticket link
7. **Share**: Copy ticket link or download QR code to share manually

### For Event Staff (Clients)

1. **Sign Up**: Go to `/client/signup` and create a client account
2. **Login**: Access the scanner at `/client/login`
3. **Scan Tickets** (Two Options):
   
   **Option A: Camera Scan**
   - Click "Use Camera"
   - Allow camera permissions when prompted
   - Point camera at customer's QR code
   - QR code will be automatically detected and scanned
   
   **Option B: Upload QR Image**
   - Click "Upload Image"
   - Select a QR code image from your device
   - System will automatically process the image
   
4. **Verify Entry**:
   - Review ticket details displayed
   - Confirm customer name matches
   - Select the confirmation checkbox
   - Click "Verify Entry" to mark attendance
5. **Success**: Entry is recorded with timestamp in database

## Project Structure

```
bawler2.0/
├── app/
│   ├── api/                    # API routes
│   │   ├── auth/              # Authentication endpoints
│   │   │   ├── login/
│   │   │   └── signup/
│   │   └── tickets/           # Ticket management endpoints
│   │       ├── create/
│   │       ├── verify/
│   │       └── [ticketId]/
│   ├── client/                # Client portal pages
│   │   ├── login/
│   │   ├── signup/
│   │   └── scanner/
│   ├── owner/                 # Owner portal pages
│   │   ├── login/
│   │   ├── signup/
│   │   └── dashboard/
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Home page
├── components/                # Reusable components
│   ├── Button.tsx
│   └── Input.tsx
├── lib/                       # Utility libraries
│   ├── auth.ts               # Authentication helpers
│   ├── mongodb.ts            # Database connection
│   └── utils.ts              # General utilities
├── models/                    # Database models
│   ├── User.ts
│   └── Ticket.ts
├── .env.example              # Environment variables template
├── .gitignore
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - Login user

### Tickets
- `POST /api/tickets/create` - Create new ticket (Owner only)
- `GET /api/tickets/[ticketId]` - Get ticket details
- `POST /api/tickets/verify` - Verify and mark entry (Client only)

## Database Schema

### User
- email (string, unique)
- password (string, hashed)
- name (string)
- role (enum: 'owner' | 'client')
- createdAt (date)

### Ticket
- ticketId (string, unique)
- customerName (string)
- customerPhone (string)
- customerEmail (string, optional)
- eventName (string)
- eventDate (date, optional)
- additionalDetails (string, optional)
- qrCode (string, base64)
- hasEntered (boolean)
- entryTime (date, optional)
- createdBy (ObjectId, ref: User)
- createdAt (date)

## Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Role-based access control
- Protected API routes
- Input validation

## SMS & WhatsApp Integration

The app supports sending QR codes via SMS and WhatsApp using Twilio.

### Quick Setup:

1. **Create Twilio Account**: https://www.twilio.com/try-twilio (Free $15 credit!)
2. **Get Credentials** from Twilio Console:
   - Account SID
   - Auth Token
   - Phone Number (buy one - free with trial credit)
3. **Update `.env` file**:
   ```env
   TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   TWILIO_AUTH_TOKEN=your_auth_token_here
   TWILIO_PHONE_NUMBER=+1234567890
   TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
   ```
4. **For WhatsApp**: Join Twilio Sandbox by sending "join [code]" to their WhatsApp number
5. **Restart server**: `npm run dev`

**Detailed Setup**: See `TWILIO_SETUP_GUIDE.md` for complete instructions

### Without Twilio:

- Select "Don't Send" when creating tickets
- Share ticket link manually: `http://localhost:3000/ticket/TICKET_ID`
- Download and send QR code image directly

## Browser Requirements

- Modern browser with ES6+ support
- Camera access for QR scanning (HTTPS required for production)
- File upload capability for uploading QR code images
- Recommended: Chrome, Firefox, Safari, or Edge (latest versions)

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project to Vercel
3. Add environment variables
4. Deploy

### Other Platforms

- Ensure Node.js 18+ runtime
- Configure MongoDB connection
- Set all environment variables
- Build command: `npm run build`
- Start command: `npm start`

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify network access if using MongoDB Atlas

### Camera Not Working
- QR scanner requires HTTPS in production
- Check browser camera permissions
- Try a different browser
- **Alternative**: Use the "Upload Image" option to scan QR codes from saved images

### QR Code Upload Issues
- Ensure the image is clear and QR code is visible
- Supported formats: JPG, PNG, GIF, BMP
- Make sure the QR code is not damaged or distorted
- Try taking a clearer photo if the scan fails

### Lint Errors in IDE
- Run `npm install` to install all dependencies
- TypeScript errors will resolve after installation

## Future Enhancements

- WhatsApp integration for QR code delivery
- Ticket analytics and reports
- Bulk ticket generation
- Email notifications
- Event management dashboard
- Ticket templates
- Export functionality

## License

MIT

## Support

For issues or questions, please create an issue in the repository.
