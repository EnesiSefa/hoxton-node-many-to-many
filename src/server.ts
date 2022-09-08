import  express  from "express";
import cors from "cors"
import Database from "better-sqlite3";

const db = Database('./db/data.db', { verbose: console.log })
const app = express()
app.use(cors())
app.use(express.json())

const port = 4000 

const getAllApplicants = db.prepare(`
SELECT * FROM applicants
`)

const getAllInterviewers = db.prepare(`
SELECT * FROM interviewers
`)

const getApplicantsById = db.prepare(`
SELECT * FROM applicants WHERE id = @id;
`)

const getInterviewersById = db.prepare(`
SELECT * FROM interviewers WHERE id = ?;
`)