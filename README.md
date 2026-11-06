# Asset Management System — Backend

REST API for the ICT Asset Tracking, Ticketing, Document Tracking and Fleet
system used by the State Department for Justice, Human Rights and
Constitutional Affairs (SDJHRCA).

Built with Express 5, TypeScript and Prisma on PostgreSQL.

## What it covers

- **Assets** — registration, categories, status, procurement details and
  warranty, with reports by Kenya government financial year (1 July – 30 June).
- **Assignments** — issuing an asset to a member of staff, or to an **office**
  by room number for shared equipment such as printers and scanners, which
  survives transfers and handovers.
- **Tickets** — staff raise faults; only ICT assigns them, so a ticket is never
  given to an officer who is away.
- **Documents** — memos routed to named officers, to a whole department, to all
  HODs or to all staff, with private replies, attachments and an audit trail,
  decided by the Principal Secretary.
- **Fleet** — government vehicles, odometer readings, service intervals and
  service history.
- **Accounts** — access requests, approval, password resets and direct account
  creation by an administrator.

## Roles

| Role | Asset tracking & ticketing | Documents & fleet |
| --- | --- | --- |
| `ICT_ADMIN` | administrator | ordinary officer |
| `ICT_OFFICER` | handles tickets and assets | ordinary officer |
| `PS` | ordinary officer | administrator, and the only approver |
| `DIRECTOR` / `ASSISTANT_DIRECTOR` | ordinary officer | administrator |
| `HOD` | ordinary officer | sees their department's submissions |
| `END_USER` | raises tickets | sends documents upward |

The two subsystems have deliberately separate administrators: the ICT Admin has
no standing over documents or the fleet, and the PS has none over asset
tracking.

## Running it

```bash
npm install
npx prisma migrate deploy
npm run build
npm start
```

For development, `npm run dev` watches the TypeScript sources.

## Configuration

Create a `.env` file (never committed):

| Key | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | signs login tokens; long and random |
| `PORT` | defaults to 5000 |
| `FRONTEND_URL` | comma-separated origins allowed by CORS |
| `BREVO_API_KEY` | outgoing email |
| `EMAIL_FROM`, `EMAIL_FROM_NAME`, `EMAIL_USER` | sender identity |
| `INITIAL_ADMIN_EMAIL`, `INITIAL_ADMIN_PASSWORD` | first administrator |
| `INITIAL_ADMIN_FULL_NAME`, `INITIAL_ADMIN_STAFF_NO`, `INITIAL_ADMIN_JOB_TITLE` | its details |

Seed the first administrator with `npm run seed`, or reset its password from
`.env` with `npm run seed -- --reset-password`.

Uploaded document attachments are written to `uploads/documents` and are not
part of the repository; back that folder up alongside the database.
