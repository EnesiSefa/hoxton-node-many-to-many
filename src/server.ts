import express from "express";
import cors from "cors";
import Database from "better-sqlite3";

const db = Database("./db/data.db", { verbose: console.log });
const app = express();
app.use(cors());
app.use(express.json());

const port = 4000;

const getAllApplicants = db.prepare(`
SELECT * FROM applicants
`);

const getAllInterviewers = db.prepare(`
SELECT * FROM interviewers
`);

const getApplicantsById = db.prepare(`
SELECT * FROM applicants WHERE id = @id;
`);

const getInterviewersById = db.prepare(`
SELECT * FROM interviewers WHERE id = ?;
`);
app.get("/", (req, res) => {
  res.send(`WELCOME`);
});
app.get("/interviewers", (req, res) => {
  res.send(getAllInterviewers.all());
});
app.get("/applicants", (req, res) => {
  res.send(getAllApplicants.all());
});

app.listen(port, () => {
  console.log(`
  App running: http://localhost:${port}`);
});
