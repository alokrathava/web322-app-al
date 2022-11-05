/*********************************************************************************
 *  WEB322 – Assignment 04
 *  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part
 *  of this assignment has been copied manually or electronically from any other source
 *  (including 3rd party web sites) or distributed to other students.
 *
 *  Name: Alokkumar Rathava Student ID: 145877205 Date: 30/09/2022
 *
 *  Online (Heroku) Link:
 *
 ********************************************************************************/


let express = require("express");
let app = express();
let path = require("path");
let data = require("./data-service");
let multer = require("multer");
let fs = require("fs");
let exphbs = require("express-handlebars");
let {equal} = require("assert");

let HTTP_PORT = process.env.PORT || 80;

let statusCode = {
    OK: 200, FORBIDDEN: 403, PAGE_NOT_FOUND: 404
};


/*------------------------------------------------------Server-------------------------------------------------------*/
app.use(express.static("public"));

app.use(express.urlencoded({
    extended: true
}));

function onHTTPStart() {
    console.log("Express http server listening on port " + HTTP_PORT);
}

/*----------------------------------------------------Handler Bars---------------------------------------------------*/
app.engine(".hbs", exphbs.engine({
    extname: ".hbs", helpers: {
        navLink: (url, options) => {
            return ("<li" + (url == app.locals.activeRoute ? ' class="active" ' : "") + '><a href="' + url + '">' + options.fn(this) + "</a></li>");
            equal: f;
        }, equal: (lvalue, rvalue, options) => {
            if (arguments.length < 3) throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        },
    },
}));
app.set("view engine", ".hbs");

/*--------------------------------------------------Storage-----------------------------------------------------------*/
let storage = multer.diskStorage({
    destination: "./public/images/uploaded", filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

let upload = multer({storage: storage});

app.use(function (req, res, next) {
    let route = req.baseUrl + req.path;
    app.locals.activeRoute = route == "/" ? "/" : route.replace(/\/$/, "");
    next();
});

/*------------------------------------------------------Routes-------------------------------------------------------*/
app.get("/", (req, res) => {
    req.header("Content-Type", "text/html");
    res.status(statusCode.OK).render("home", {title: "Home"});
});

app.get("/about", (req, res) => {
    req.header("Content-Type", "text/html");
    res.status(statusCode.OK).render("about");

});

app.get("/students", (req, res) => {
    if (req.query.status) {
        data
            .getStudentsByStatus(req.query.status)
            .then((data) => {
                req.header("Content-Type", "text/html");
                res.status(statusCode.OK).render("students", {students: data});
            })
            .catch((err) => {
                res.json({Message: "Error"});
            });
    } else if (req.query.program) {
        data
            .getStudentsByProgramCode(req.query.program)
            .then((data) => {
                req.header("Content-Type", "text/html");
                res.status(statusCode.OK).render("students", {students: data});
            })
            .catch((err) => {
                res.json({Message: "Error"});
            });
    } else if (req.query.credential) {
        data
            .getStudentsByExpectedCredential(req.query.credential)
            .then((data) => {
                req.header("Content-Type", "text/html");
                res.status(statusCode.OK).render("students", {students: data});
            })
            .catch((err) => {
                res.json({Message: "Error"});
            });
    } else {
        data
            .getAllStudents()
            .then((data) => {
                req.header("Content-Type", "text/html");
                res.status(statusCode.OK).render("students", {students: data});
            })
            .catch((err) => {
                res.render("students", {message: "no results"});
            });
    }
});

app.get("/programs", (req, res) => {
    data
        .getPrograms()
        .then((data) => {
            req.header("Content-Type", "text/html");
            res.status(statusCode.OK).render("programs", {programs: data});
            if (err) {
                notFound();
            }
        })
        .catch((err) => {
            res.json({Message: "Error"});
        });
});

app.get("/students/add", (req, res) => {
    req.header("Content-Type", "text/html");
    res.status(statusCode.OK).render("addStudent");

});

app.get("/images/add", (req, res) => {
    req.header("Content-Type", "text/html");
    res.status(statusCode.OK).render("addImage");

});

app.get("/images", (req, res) => {
    fs.readdir("./public/images/uploaded", (err, data) => {
        if (err) {
            console.log("Error in reading the directory.");
        } else {
            req.header("Content-Type", "text/html");
            res.status(statusCode.OK).render("images", {images: data});
        }
    });
});

app.get("/student/:studentId", (req, res) => {
    data
        .getStudentById(req.params.studentId)
        .then((data) => {
            req.header("Content-Type", "text/html");
            res.status(statusCode.OK).render("student", {student: data});
        })
        .catch((err) => {
            res.status(statusCode.PAGE_NOT_FOUND).render("student", {message: "no results"});
        });
});

// ==> POST REQUEST.

app.post("/images/add", upload.single("imageFile"), (req, res) => {
    req.header("Content-Type", "text/html");
    res.status(statusCode.OK).redirect("/images");

});

app.post("/students/add", (req, res) => {
    req.header("Content-Type", "text/html");
    data.addStudent(req.body).then(res.redirect("/students"));
});

app.post("/student/update", (req, res) => {
    data
        .updateStudent(req.body)
        .then(res.redirect("/students"))
        .catch((err) => {
            console.log("There was an error", err);
        });
});

// ==> ERROR 404


app.use((req, res) => {
    res.status(statusCode.PAGE_NOT_FOUND).render("404");
});


data
    .initialize()
    .then(() => {
        app.listen(HTTP_PORT, onHTTPStart);
    })
    .catch((err) => {
        console.log("Error in initializing the data.");
    });