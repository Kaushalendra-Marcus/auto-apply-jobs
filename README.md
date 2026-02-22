# AutoApply Pro

An AI-powered job application platform that parses your resume, finds relevant jobs, and tracks your applications. Built with Next.js, Prisma, Firebase, and Gemini AI. Integrated with Accomplish for browser automation.

---

## What It Does

- Parses your resume using Gemini AI and extracts skills, experience, and education
- Searches jobs from multiple sources based on your profile
- Tracks every application in one dashboard
- Uses Accomplish to automate filling out job application forms

---

## Tech Stack

- **Frontend / Backend**: Next.js 16 (App Router, API Routes)
- **Database**: PostgreSQL via Prisma 7 with driver adapter
- **Auth**: Firebase (Google Sign-In)
- **AI**: Google Gemini 2.0 Flash
- **File Storage**: AWS S3
- **Email Queue**: BullMQ + Redis + AWS SES
- **Job Sources**: Remotive API, Arbeitnow API, The Muse API
- **Automation**: Accomplish (local desktop AI agent)
- **Bridge Server**: Node.js + Express (connects browser to API)

---

## Project Structure

```
auto-apply/
├── app/
│   ├── api/
│   │   ├── auth/sync/          # Creates Prisma user on Firebase login
│   │   ├── automation/
│   │   │   ├── apply/          # Logs application, upserts job record
│   │   │   ├── profile/        # Returns profile for bridge server
│   │   │   └── generate/tailored-resume/
│   │   ├── jobs/search/        # Multi-source job search
│   │   ├── reminders/          # Scheduled email reminders
│   │   ├── resume/upload/      # Parse and store resume
│   │   └── user/
│   │       ├── api-key/        # Returns API key for bridge
│   │       ├── applications/   # Lists tracked applications
│   │       ├── profile/        # Save edited profile
│   │       └── status/         # Resume upload status + skills
│   ├── dashboard/
│   │   ├── jobs/               # Job search with skill pre-fill
│   │   ├── resume/             # Upload and edit parsed profile
│   │   ├── applications/       # Track all applications
│   │   └── settings/           # View and copy API key
│   └── login/                  # Google Sign-In
├── bridge-server/              # Local Express server for Accomplish
├── lib/
│   ├── ai/                     # Gemini calls, resume parser
│   ├── firebase/               # Admin + client config
│   ├── scraper/jobs.ts         # Multi-source job aggregator
│   ├── prisma.ts               # PrismaPg adapter setup
│   ├── s3.ts                   # Resume upload to S3
│   ├── queue.ts                # BullMQ email queue
│   └── redis.ts                # Redis connection
└── prisma/
    └── schema.prisma           # User, Profile, Resume, Job, Application, Reminder
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Redis instance
- Firebase project (Google auth enabled)
- AWS account (S3 bucket + SES + IAM user)
- Google Gemini API key
- Accomplish installed locally

### 1. Clone and Install

```bash
git clone https://github.com/your-username/auto-apply
cd auto-apply
npm install
```

### 2. Environment Variables

Create a `.env` file in the root:

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/dbname?sslmode=verify-full"

# Firebase Admin
FIREBASE_PROJECT_ID="your-project-id"
FIREBASE_CLIENT_EMAIL="your-service-account@project.iam.gserviceaccount.com"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"

# Firebase Client
NEXT_PUBLIC_FIREBASE_API_KEY="..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="..."
NEXT_PUBLIC_FIREBASE_PROJECT_ID="..."
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="..."
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="..."
NEXT_PUBLIC_FIREBASE_APP_ID="..."
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="..."

# AWS
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY="..."
AWS_S3_BUCKET="your-bucket-name"
EMAIL_FROM="noreply@yourdomain.com"

# AI
GEMINI_API_KEY="..."

# Redis
REDIS_URL="redis://localhost:6379"
```

### 3. Database Setup

```bash
npx prisma migrate dev
npx prisma generate
```

### 4. AWS IAM Permissions

Attach this policy to your IAM user:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:GetObject", "s3:DeleteObject"],
      "Resource": "arn:aws:s3:::your-bucket-name/*"
    },
    {
      "Effect": "Allow",
      "Action": "s3:ListBucket",
      "Resource": "arn:aws:s3:::your-bucket-name"
    }
  ]
}
```

### 5. Run the App

Terminal 1 — Next.js:
```bash
npm run dev
```

Terminal 2 — Bridge server:
```bash
cd bridge-server
npm install
node index.js
```

Open http://localhost:3000

---

## How the Flow Works

1. Sign in with Google
2. Go to Resume, upload your PDF or DOCX
3. Gemini AI parses it and extracts your name, skills, experience, and education
4. Edit and save your profile if needed
5. Go to Jobs, search by skill or keyword
6. Click "Track Application" on any job card
7. The bridge server calls Accomplish to open the job URL and fill the form
8. The application is logged in your database
9. View all tracked applications at /dashboard/applications

---

## Bridge Server + Accomplish Integration

The bridge server runs on port 3001. When you click apply:

1. It fetches your profile using your API key from `/api/automation/profile`
2. It sends a task to Accomplish on port 3003 with your details and the job URL
3. Accomplish opens a browser, fills the form, and submits it
4. The application is logged via `/api/automation/apply`

If Accomplish is not running, the application is still tracked in your dashboard.

---

## Job Sources

Jobs are pulled from three free APIs with no key required:

| Source | Type | API |
|---|---|---|
| Remotive | Remote tech jobs | remotive.com/api |
| Arbeitnow | Global tech jobs | arbeitnow.com/api |
| The Muse | Company-focused listings | themuse.com/api |

Results from all three are merged and deduplicated by query.

---

## Prisma Schema Overview

| Model | Description |
|---|---|
| User | Firebase UID, email, name, phone, API key |
| Profile | Skills, experience, education JSON |
| Resume | S3 URL, parsed data, master flag |
| Job | External job ID, title, company, source |
| Application | Links user to job with status |
| Reminder | Scheduled follow-up emails via BullMQ |

---

## Known Limitations

- Job form automation depends on Accomplish being installed and running locally
- Each company has a different application form structure, so automation success varies
- Redis must be running for the email reminder queue to work
- Scraping LinkedIn, Indeed, and Naukri directly is not supported due to bot detection and terms of service

---

## License

MIT