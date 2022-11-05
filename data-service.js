// GLOBAL VARIABLE.
var students = [];
var programs = [];
var fs = require("fs");

// EXPORT FUNCTIONS.

module.exports.initialize = () => {
  return new Promise((resolve, reject) => {
    fs.readFile("./data/students.JSON", (err, data) => {
      if (err) reject("Unable to read the file");
      students = JSON.parse(data);
    });
    fs.readFile("./data/programs.JSON", (err, data) => {
      if (err) reject("Unable to read the file");
      programs = JSON.parse(data);
    });
    resolve();
  });
};

module.exports.getAllStudents = () => {
  return new Promise((resolve, reject) => {
    if (students.length > 0) resolve(students);
    else reject("No Results Returned");
  });
};

module.exports.getInternationalStudents = () => {
  return new Promise((resolve, reject) => {
    const intStudents = students.filter((stu) => {
      return stu.isInternationalStudent === true;
    });
    if (intStudents.length > 0) resolve(intStudents);
    else reject("No Results Returned");
  });
};

module.exports.getPrograms = () => {
  return new Promise((resolve, reject) => {
    if (programs.length > 0) resolve(programs);
    else reject("No Results Returned");
  });
};

module.exports.addStudent = (studentData) => {
  return new Promise((resolve, reject) => {
    if (typeof studentData.isInternationalStudent === undefined)
      studentData.isInternationalStudent = false;
    else studentData.isInternationalStudent = true;
    // VARIABLE DECLARATION.
    const arrID = [];
    let newID;
    students.forEach((id) => {
      arrID.push(parseInt(id.studentID));
    });
    newID = Math.max(arrID) + 1;
    newID = toString(newID);
    studentData.studentID = newID;
    students.push(studentData);
  });
};

module.exports.getStudentsByStatus = (status) => {
  return new Promise((resolve, reject) => {
    // VARIABLE DECLARATION.
    const statStu = students.filter((stu) => {
      return stu.status === status;
    });
    if (statStu.length > 0) resolve(statStu);
    else reject("No Results Returned");
  });
};

module.exports.getStudentsByProgramCode = (programCode) => {
  return new Promise((resolve, reject) => {
    // VARIABLE DECLARATION.
    const proStu = students.filter((stu) => {
      return stu.program === programCode;
    });
    if (proStu.length > 0) resolve(proStu);
    else reject("No Results Returned");
  });
};

module.exports.getStudentsByExpectedCredential = (credential) => {
  return new Promise((resolve, reject) => {
    // VARIABLE DECLARATION.
    const credStu = students.filter((stu) => {
      return stu.expectedCredential === credential;
    });
    if (credStu.length > 0) resolve(credStu);
    else reject("No Results Returned");
  });
};

module.exports.getStudentById = (sid) => {
  return new Promise((resolve, reject) => {
    // VARIABLE DECLARATION.
    const idStu = students.filter((stu) => {
      return stu.studentID === sid;
    });
    if (idStu.length > 0) resolve(idStu[0]);
    else reject("No Results Returned");
  });
};

module.exports.updateStudent = (studentData) => {
  return new Promise((resolve, reject) => {
    students.forEach((stu) => {
      if (stu.studentID === studentData.studentID) {
        stu.studentID = studentData.studentID;
        stu.firstName = studentData.firstName;
        stu.lastName = studentData.lastName;
        stu.program = studentData.program;
        stu.expectedCredential = studentData.expectedCredential;
        stu.status = studentData.status;
        stu.isInternationalStudent = studentData.isInternationalStudent;
        resolve();
      }
    });
    reject("Student not found");
  });
};