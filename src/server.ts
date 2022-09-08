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

const getAllInterviews = db.prepare(`
SELECT * FROM interviews
`);

const getApplicantsById = db.prepare(`
SELECT * FROM applicants WHERE id = @id;
`);

const getInterviewersById = db.prepare(`
SELECT * FROM interviewers WHERE id = @id;
`);
const getInterviewsForInterviewer = db.prepare(`
SELECT * FROM interviews WHERE interviewersId = @interviewersId;
`);

const getInterviewsForApplicants = db.prepare(`
SELECT * FROM interviews WHERE applicantsId = @applicantsId;
`);
const getApplicantsforInterviewers = db.prepare(`
SELECT applicants .* FROM applicants
JOIN interviews ON applicants.id = interviews.applicantsId
WHERE interviews.interviewersId = @interviewersId;
`);

const getInterviewersforApplicants = db.prepare(`
SELECT interviewers .* FROM interviewers
JOIN interviews ON interviewers.id = interviews.interviewersId
WHERE interviews.applicantsId = @applicantsId;
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
app.get("/interviews", (req, res) => {
  res.send(getAllInterviews.all());
});

app.get("/interviewers/:id", (req, res) => {
  const interviewers = getInterviewersById.get(req.params);
  if (interviewers) {
    interviewers.interviews = getInterviewsForInterviewer.all({
      interviewersId: interviewers.id,
    });
    interviewers.applicants = getApplicantsforInterviewers.all({
      interviewersId: interviewers.id,
    });

    res.send(interviewers);
  } else {
    res.status(404).send({ error: "interviewers not found" });
  }

  res.send(interviewers.all());
});

app.get("/applicants/:id", (req, res) => {
    const applicants = getApplicantsById.get(req.params);
    if (applicants) {
      applicants.interviews = getInterviewsForApplicants.all({
        applicantsId: applicants.id,
      });
      applicants.interviewers = getInterviewersforApplicants.all({
        applicantsId: applicants.id,
      });
  
      res.send(applicants);
    } else {
      res.status(404).send({ error: "interviewers not found" });
    }
  
    res.send(applicants.all());
  });
app.get("/applicants/:id", (req, res) => {
  res.send(getAllApplicants.all());
});
app.get("/interviews/:id", (req, res) => {
  res.send(getAllInterviews.all());
});

app.listen(port, () => {
  console.log(`
  App running: http://localhost:${port}`);
});
