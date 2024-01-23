const express = require('express')
const app = express()
app.use(express.static('red'));
app.use(express.json());
const dataFile = 'data.json';
const fs = require('fs');
elements = JSON.parse(fs.readFileSync(dataFile))["info"][0]["objects"]

app.get('/search/:term',function (req, resp){
    elements = JSON.parse(fs.readFileSync(dataFile))["info"][0]["objects"]
    outputs=[]
    for (i in elements){
        if (elements[i]["name"].includes(req.params.term)){
            outputs.push(elements[i])
        }
    }

    resp.send(outputs)
 });

 app.get('/find/:id',function(req,resp){
    elements = JSON.parse(fs.readFileSync(dataFile))["info"][0]["objects"]
    for (i in elements){
        if (String(elements[i]["id"])==req.params.id ){
            resp.send(elements[i])

        }
    }
 })

app.get('/findc/:id',function(req,resp){
    elements = JSON.parse(fs.readFileSync(dataFile))["info"][1]["categories"]
    for (i in elements){
        if (String(elements[i]["id"])==req.params.id ){
            resp.send(elements[i])

        }
    }
})

 app.get('/search',function (req, resp){
    elements = JSON.parse(fs.readFileSync(dataFile))["info"][0]["objects"]
    outputs=[]
    for (i in elements){
        outputs.push(elements[i])
    }
    resp.send(outputs)
});

app.get('/random',function(req,resp){
    elements = JSON.parse(fs.readFileSync(dataFile))["info"][0]["objects"]
    resp.send(elements[Math.floor(Math.random()*(elements).length)])
})

app.get('/category/:id',function(req,resp){
    elements = JSON.parse(fs.readFileSync(dataFile))["info"][0]["objects"]
    categories = JSON.parse(fs.readFileSync(dataFile))["info"][1]["categories"]
    for (i in elements){
        if (String(elements[i]["id"])==String(req.params.id)){

            for (j in categories){
                if (elements[i]["categoryID"]==categories[j]["id"]){

                    resp.send(categories[j])
                }
            }
        }
    }
})


app.post('/add',function(req,resp){
    newName=req.body["name"]
    newCategory=req.body["category"]
    fileData = JSON.parse(fs.readFileSync(dataFile))
    elements=fileData["info"][0]["objects"]
    categories = fileData["info"][1]["categories"]
    console.log(newName)
    console.log(newCategory)
    newObjectToCreate=true
    newCategoryToCreate=true
    for (i in elements){
        highestElement=elements[i]["id"]
        if (elements[i]["name"]==newName){
            newObjectToCreate=false
            
        }
    }
    if (newObjectToCreate){
        for (i in categories){
            highestCategory=elements[i]["id"]
            if (categories[i]["name"]==newCategory){
                newCategoryToCreate=false
                categoryIdToUse=categories[i]["id"]
            }
        }
        if (newCategoryToCreate){
            categories.push({"id":highestCategory+1,"name":newCategory})
            categoryIdToUse=highestCategory+1
        }
        elements.push({"id":highestElement+1,"name":newName,"description":"","categoryID":categoryIdToUse})
        console.log(fileData )
        fs.writeFileSync(dataFile,JSON.stringify(fileData))
    }
    info={"newElement":newObjectToCreate,"newCategory":newCategoryToCreate}
    resp.send(info)
    }
)

app.get('/objects/:id',function(req,resp){
    elements = JSON.parse(fs.readFileSync(dataFile))["info"][0]["objects"]
    categories = JSON.parse(fs.readFileSync(dataFile))["info"][1]["categories"]
    for (i in categories){
        if (String(categories[i]["id"])==String(req.params.id)){

            for (j in elements){
                out={"objects":[]}
                if (elements[j]["categoryID"]==categories[i]["id"]){
                    out["objects"].push(elements[j])
                }
            }
            resp.send(out)
        }
    }
})

app.listen(8090)