const express = require("express");
const app = express();
app.use(express.static("red"));
app.use(express.json());
const dataFile = "data.json";
const fs = require("fs");
let elements = JSON.parse(fs.readFileSync(dataFile))["info"][0]["objects"];

app.get("/search/:term", function (req, resp) {
    elements = JSON.parse(fs.readFileSync(dataFile))["info"][0]["objects"];
    const outputs = [];
    for (const i in elements) {
        const x = elements[i]["name"].toLowerCase();
        if (x.includes(req.params.term.toLowerCase())) {
            outputs.push(elements[i]);
        }
    }

    resp.send(outputs);
 });

 app.get("/find/:id", function (req, resp) {
    elements = JSON.parse(fs.readFileSync(dataFile))["info"][0]["objects"];
    for (const i in elements) {
        if (String(elements[i]["id"]) === req.params.id) {
            resp.send(elements[i]);
        }
    }
 });

app.get("/findc/:id", function (req, resp) {
    elements = JSON.parse(fs.readFileSync(dataFile))["info"][1]["categories"];
    for (const i in elements) {
        if (String(elements[i]["id"]) === req.params.id) {
            resp.send(elements[i]);
        }
    }
});

 app.get("/search", function (req, resp) {
    elements = JSON.parse(fs.readFileSync(dataFile))["info"][0]["objects"];
    const outputs = [];
    for (const i in elements) {
        outputs.push(elements[i]);
    }
    resp.send(outputs);
});

app.get("/random", function (req, resp) {
    elements = JSON.parse(fs.readFileSync(dataFile))["info"][0]["objects"];
    resp.send(elements[Math.floor(Math.random() * (elements).length)]);
});

app.get("/category/:id", function (req, resp) {
    elements = JSON.parse(fs.readFileSync(dataFile))["info"][0]["objects"];
    const categories = JSON.parse(fs.readFileSync(dataFile))["info"][1]["categories"];
    for (const i in elements) {
        if (String(elements[i]["id"]) === String(req.params.id)) {
            for (const j in categories) {
                if (elements[i]["categoryID"] === categories[j]["id"]) {
                    resp.send(categories[j]);
                }
            }
        }
    }
});

app.post("/add", function (req, resp) {
    const newName = req.body["name"];
    const newCategory = req.body["category"];
    const newCategoryDescription = req.body["categorydescription"];
    const newDescription = req.body["description"];
    const newMax = req.body["max"];
    const newMin = req.body["min"];
    const fileData = JSON.parse(fs.readFileSync(dataFile));
    elements = fileData["info"][0]["objects"];
    const categories = fileData["info"][1]["categories"];
    let newObjectToCreate = true;
    let newCategoryToCreate = true;
    let highestElement = {};
    let highestCategory = {};
    let categoryIdToUse = "";
    for (const i in elements) {
        highestElement = elements[i]["id"];
        if (elements[i]["name"] === newName) {
            newObjectToCreate = false;
        }
    }
    if (newObjectToCreate) {
        for (const i in categories) {
            highestCategory = elements[i]["id"];
            if (categories[i]["name"] === newCategory) {
                newCategoryToCreate = false;
                categoryIdToUse = categories[i]["id"];
            }
        }
        if (newCategoryToCreate) {
            categories.push({ "id": highestCategory + 1, "name": newCategory, "description": newCategoryDescription });
            categoryIdToUse = highestCategory + 1;
        }
        elements.push({ "id": highestElement + 1, "name": newName, "description": newDescription, "categoryID": categoryIdToUse, "maxplayers": newMax, "minplayers": newMin });
        fs.writeFileSync(dataFile, JSON.stringify(fileData));
    }
    const info = { "newElement": newObjectToCreate, "newCategory": newCategoryToCreate };
    resp.send(info);
    }
);

app.get("/elements/:id", function (req, resp) {
    let out = "";
    elements = JSON.parse(fs.readFileSync(dataFile))["info"][0]["objects"];
    const categories = JSON.parse(fs.readFileSync(dataFile))["info"][1]["categories"];
    for (const i in categories) {
        if (String(categories[i]["id"]) === String(req.params.id)) {
            for (const j in elements) {
                out = { "objects": [] };
                if (elements[j]["categoryID"] === categories[i]["id"]) {
                    out["objects"].push(elements[j]);
                }
            }
            resp.send(out);
        }
    }
});

app.listen(8090);
module.exports = app;
