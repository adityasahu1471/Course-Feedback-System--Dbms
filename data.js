/**
 * data.js — local demo data + mock API layer
 * ---------------------------------------------------------
 * This is UI-only for now. Every "...Api" function below returns a
 * Promise, mimics network latency, and reads/writes the in-memory
 * DB object — so script.js never has to change when the real
 * Java/MySQL backend is wired in later. Swap the *body* of these
 * functions for real fetch() calls and nothing else needs to move.
 */

const SEED = {
  admin: {
    name: "Course Admin",
    email: "admin@amrita.edu",
    password: "admin123",
  },

  questions: [
    { no: 1, text: "The instructor explained concepts clearly." },
    { no: 2, text: "Course materials were well organized." },
    { no: 3, text: "Pace of the course was appropriate." },
    { no: 4, text: "Doubts and questions were addressed well." },
    { no: 5, text: "Overall, I am satisfied with this course." },
  ],

  students: [
    { id: "AM.SC.U4CSE25018", name: "Aditya Sahu", dept: "CSE", sem: 3 },
    { id: "AM.SC.U4CSE25022", name: "Meera Krishnan", dept: "CSE", sem: 3 },
    { id: "AM.SC.U4CSE25041", name: "Rohan Nair", dept: "CSE", sem: 3 },
    { id: "AM.SC.U4CSE25009", name: "Fathima Rasheed", dept: "CSE", sem: 3 },
  ],

  teachers: [
    {
      id: "FAC001",
      name: "Dr. Lakshmi Menon",
      email: "lakshmi.menon@amrita.edu",
      subject: "Database Management Systems",
    },
    {
      id: "FAC002",
      name: "Dr. Arun Pillai",
      email: "arun.pillai@amrita.edu",
      subject: "Operating Systems",
    },
    {
      id: "FAC003",
      name: "Prof. Sandhya Kumar",
      email: "sandhya.kumar@amrita.edu",
      subject: "Computer Networks",
    },
  ],

  courses: [
    {
      code: "23CSE202",
      name: "Database Management Systems",
      teacherId: "FAC001",
      subject: "DBMS",
    },
    {
      code: "23CSE204",
      name: "Operating Systems",
      teacherId: "FAC002",
      subject: "OS",
    },
    {
      code: "23CSE206",
      name: "Computer Networks",
      teacherId: "FAC003",
      subject: "Networks",
    },
  ],

  feedbacks: [
    {
      id: 1,
      studentId: "AM.SC.U4CSE25018",
      courseCode: "23CSE202",
      ratings: [5, 4, 4, 5, 5],
      comment: "Great pace, loved the SQL labs.",
      date: "2026-07-20",
    },
    {
      id: 2,
      studentId: "AM.SC.U4CSE25022",
      courseCode: "23CSE202",
      ratings: [4, 4, 3, 4, 4],
      comment: "Could use more normalization examples.",
      date: "2026-07-21",
    },
    {
      id: 3,
      studentId: "AM.SC.U4CSE25041",
      courseCode: "23CSE204",
      ratings: [3, 4, 3, 4, 3],
      comment: "Scheduling unit was a bit rushed.",
      date: "2026-07-22",
    },
    {
      id: 4,
      studentId: "AM.SC.U4CSE25009",
      courseCode: "23CSE206",
      ratings: [5, 5, 4, 5, 5],
      comment: "Best course this semester.",
      date: "2026-07-23",
    },
  ],
};

// Deep clone so "Restore Seed Data" can always reset cleanly.
const DB = JSON.parse(JSON.stringify(SEED));

const LATENCY = 220;
const delay = (value) =>
  new Promise((resolve) => setTimeout(() => resolve(value), LATENCY));

async function hydrateData() {
  // Placeholder for the real fetch-from-MySQL call. Resolves against
  // the in-memory DB so the UI has data to render immediately.
  return delay(true);
}

async function loginApi(role, id, secret) {
  await delay();
  if (role === "admin") {
    if (
      id.trim().toLowerCase() === DB.admin.email.toLowerCase() &&
      secret === DB.admin.password
    ) {
      return { ...DB.admin };
    }
    throw new Error("Incorrect admin email or password.");
  }

  const student = findStudent(id.trim());
  if (
    student &&
    student.name.trim().toLowerCase() === secret.trim().toLowerCase()
  ) {
    return { ...student };
  }
  throw new Error("Student ID and name don't match our records.");
}

async function submitFeedbackApi({ studentId, courseCode, ratings, comment }) {
  await delay();
  DB.feedbacks.push({
    id: DB.feedbacks.length + 1,
    studentId,
    courseCode,
    ratings,
    comment,
    date: new Date().toISOString().slice(0, 10),
  });
  return true;
}

async function createStudentApi(student) {
  await delay();
  DB.students.push(student);
  return student;
}

async function updateStudentApi(id, updates) {
  await delay();
  const student = findStudent(id);
  if (!student) throw new Error("Student not found.");
  Object.assign(student, updates);
  return student;
}

async function createTeacherApi(teacher) {
  await delay();
  DB.teachers.push(teacher);
  return teacher;
}

async function updateTeacherApi(id, updates) {
  await delay();
  const teacher = findTeacher(id);
  if (!teacher) throw new Error("Teacher not found.");
  Object.assign(teacher, updates);
  return teacher;
}

async function createCourseApi(course) {
  await delay();
  DB.courses.push(course);
  return course;
}

async function updateCourseApi(code, updates) {
  await delay();
  const course = findCourse(code);
  if (!course) throw new Error("Course not found.");
  Object.assign(course, updates);
  return course;
}

async function resetSeedDataApi() {
  await delay();
  DB.admin = JSON.parse(JSON.stringify(SEED.admin));
  DB.questions = JSON.parse(JSON.stringify(SEED.questions));
  DB.students = JSON.parse(JSON.stringify(SEED.students));
  DB.teachers = JSON.parse(JSON.stringify(SEED.teachers));
  DB.courses = JSON.parse(JSON.stringify(SEED.courses));
  DB.feedbacks = JSON.parse(JSON.stringify(SEED.feedbacks));
  return true;
}

// ---- lookups & derived values -------------------------------------------

function findStudent(id) {
  return DB.students.find((student) => student.id === id);
}

function findTeacher(id) {
  return DB.teachers.find((teacher) => teacher.id === id);
}

function findCourse(code) {
  return DB.courses.find((course) => course.code === code);
}

function studentName(id) {
  return findStudent(id)?.name || "Unknown student";
}

function teacherName(id) {
  return findTeacher(id)?.name || "Unassigned";
}

function courseName(code) {
  return findCourse(code)?.name || "Unknown course";
}

function feedbacksForStudent(id) {
  return DB.feedbacks.filter((feedback) => feedback.studentId === id);
}

function feedbacksForCourse(code) {
  return DB.feedbacks.filter((feedback) => feedback.courseCode === code);
}

function feedbackAverage(feedback) {
  const total = feedback.ratings.reduce((sum, value) => sum + value, 0);
  return feedback.ratings.length ? total / feedback.ratings.length : 0;
}

function courseAverage(code) {
  const feedbacks = feedbacksForCourse(code);
  if (feedbacks.length === 0) return 0;
  const total = feedbacks.reduce(
    (sum, feedback) => sum + feedbackAverage(feedback),
    0,
  );
  return total / feedbacks.length;
}

function overallAverage() {
  if (DB.feedbacks.length === 0) return 0;
  const total = DB.feedbacks.reduce(
    (sum, feedback) => sum + feedbackAverage(feedback),
    0,
  );
  return total / DB.feedbacks.length;
}

function initialsFor(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
