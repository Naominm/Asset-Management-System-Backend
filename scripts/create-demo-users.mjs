// Creates one account for each role so the system can be demonstrated.
//
//   npm run seed:demo
//
// Safe to run more than once: an account that already exists has its password
// reset and is reactivated rather than duplicated.
//
// The password is read from DEMO_PASSWORD and is never stored in this file:
//
//   DEMO_PASSWORD=... npm run seed:demo
//
// These are demonstration accounts sharing one password. Remove them, or give
// each a password of its own, before the system carries real work.
import "dotenv/config";
import pg from "pg";
import bcrypt from "bcrypt";

const PASSWORD = process.env.DEMO_PASSWORD;

const DEPARTMENTS = ["ICT", "Legal", "Executive"];

const PEOPLE = [
  ["System Administrator", "ICT-ADMIN-001", "ICT Administrator",  "ictoffice@ag.go.ke",        "ICT_ADMIN",          "ICT"],
  ["ICT Officer",          "ICT-OFF-001",   "ICT Officer",        "ictofficer@ag.go.ke",       "ICT_OFFICER",        "ICT"],
  ["Principal Secretary",  "EXE-PS-001",    "Principal Secretary","ps@ag.go.ke",               "PS",                 "Executive"],
  ["Director Services",    "EXE-DIR-001",   "Director",           "director@ag.go.ke",         "DIRECTOR",           "Executive"],
  ["Assistant Director",   "EXE-AD-001",    "Assistant Director", "assistantdirector@ag.go.ke","ASSISTANT_DIRECTOR", "Executive"],
  ["Head Of Legal",        "LEG-HOD-001",   "Head of Department", "hodlegal@ag.go.ke",         "HOD",                "Legal"],
  ["Legal Clerk",          "LEG-STF-001",   "Legal Clerk",        "legalclerk@ag.go.ke",       "END_USER",           "Legal"],
  ["Test Staff",           "LEG-STF-002",   "Officer",            "teststaff@ag.go.ke",        "END_USER",           "Legal"],
];

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("DATABASE_URL is not set.");
  process.exit(1);
}

if (!PASSWORD || PASSWORD.length < 8) {
  console.error(
    "Set DEMO_PASSWORD to at least 8 characters, e.g.\n" +
      "  DEMO_PASSWORD=<password> npm run seed:demo",
  );
  process.exit(1);
}

const client = new pg.Client({ connectionString });
await client.connect();

try {
  const departmentId = {};

  for (const name of DEPARTMENTS) {
    const existing = await client.query(
      `SELECT id FROM "Department" WHERE name = $1`,
      [name],
    );

    departmentId[name] = existing.rowCount
      ? existing.rows[0].id
      : (
          await client.query(
            `INSERT INTO "Department"(name) VALUES($1) RETURNING id`,
            [name],
          )
        ).rows[0].id;
  }

  const hash = await bcrypt.hash(PASSWORD, 10);

  for (const [fullName, staffNo, jobTitle, email, role, department] of PEOPLE) {
    await client.query(
      `INSERT INTO "User"
         ("fullName","staffNo","jobTitle",email,password,role,"departmentId","isActive","mustChangePassword")
       VALUES ($1,$2,$3,$4,$5,$6,$7,true,false)
       ON CONFLICT (email) DO UPDATE
         SET password = EXCLUDED.password,
             "isActive" = true,
             "mustChangePassword" = false`,
      [fullName, staffNo, jobTitle, email, hash, role, departmentId[department]],
    );
  }

  const rows = await client.query(
    `SELECT u.role, u.email, d.name AS department
       FROM "User" u JOIN "Department" d ON d.id = u."departmentId"
      ORDER BY u.role, u.id`,
  );

  console.log(`\nPassword for every account below: ${PASSWORD}\n`);
  for (const row of rows.rows) {
    console.log(`${row.role.padEnd(20)} ${row.email.padEnd(30)} ${row.department}`);
  }
  console.log(`\n${rows.rowCount} accounts ready.`);
} finally {
  await client.end();
}
