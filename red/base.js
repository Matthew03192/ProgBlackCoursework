const a = document.getElementById("option1");
const b = document.getElementById("option2");
const c = document.getElementById("option3");
const submit = document.getElementById("submitSearch");
const home = document.getElementById('home');

function opensearching () {
   document.getElementById('searchSection').innerHTML = "<div class='mb-3'><label for='searchInput' class='form-label'>Type your search into the box below</label><input type='text' class='form-control' id='searchInput' placeholder='cats'></div><div id='submitSearch'><button type='button' class='btn btn-outline-success'>Submit</button></div>";
   document.getElementById("submitSearch").addEventListener('click', search);
};

function openadding () {
   document.getElementById('searchSection').innerHTML = "<p>Type in the details</p><div class='mb-3'><label for='nameInput' class='form-label'>Name</label><input type='text' class='form-control' id='nameInput' placeholder='cats'></div><div class='mb-3'><label for='categoryInput' class='form-label'>Category</label><input type='text' class='form-control' id='categoryInput' placeholder='cats'></div><div class='mb-3'><label for='nameInput' class='form-label'>Description</label><input type='text' class='form-control' id='descriptionInput' placeholder='cats'></div><div id='submitAddition'><button type='button' class='btn btn-outline-success'>Submit</button></div>";
   document.getElementById('submitAddition').addEventListener('click', add);
}

async function add () {
   const objectname = document.getElementById('nameInput').value;
   const objectcategory = document.getElementById('categoryInput').value;
   const objectdescription = document.getElementById('descriptionInput').value;
   const data = JSON.stringify({ "name": objectname, "category": objectcategory, "description": objectdescription });
   const response = await fetch("http://127.0.0.1:8090/add", {
      method: "POST",
      // need to set headers to make sure the server knows to invoke the JSON parser
      headers: {
        "Content-Type": "application/json"
      },
      body: data
    });
    const resp = await response.json();
    let html = document.getElementById('searchSection').innerHTML;
    if (resp["newElement"] === true) {
      html = html + '<br>A new element was successfully created';
      if (resp["newCategory"] === true) {
         html = html + '<br>A new category was also made';
      }
   }
    else {
      html = html + '<br>This element already exists';
    }
    document.getElementById('searchSection').innerHTML = html;
}

async function randomsearch () {
   const response = await fetch('http://127.0.0.1:8090/random');
   if (response.ok) {
      displayPage(await response.json());
   }
   else {
      alert('aaaahhhh');
   }
};

async function search (event) {
   const inp = document.getElementById("searchInput").value;
   const response = await fetch('http://127.0.0.1:8090/search/'.concat(inp));
   if (response.ok) {
      const data = await response.json();
      displaySearchResults(data);
   }
   else {
      alert("Your internet connection has failed");
   }
};

function displaySearchResults (arr) {
   let html = '<ul>';
   for (const i in arr) {
      html = html + '<button class="btn btn-link"' + 'id="id'.concat(String(arr[i]["id"])) + '">' + arr[i]["name"] + '</button><br>' + arr[i]["description"] + '<br>';
   }
   html = html + '</ul>';
   document.getElementById('searchSection').innerHTML = html;
   for (const i in arr) {
      const idw = "id".concat(String(arr[i]["id"]));
      document.getElementById(idw).addEventListener('click', displayPageByID);
   }
   return html;
}

async function displayPageByID () {
   let a = this.id;
   a = a.substring(2, a.length);
   const response = await fetch('http://127.0.0.1:8090/find/'.concat(String(a)));
   if (response.ok) {
      const data = await response.json();
      displayPage(data);
   }
   else {
      alert('error');
   }
}

async function displayPage (element) {
   let html = 'page about ' + element['name'] + '<br>';
   const response = await fetch('http://127.0.0.1:8090/category/'.concat(String(element["id"])));
   if (response.ok) {
      const category = await response.json();
      html = html + 'This is part of <button class="btn btn-link"' + 'id="idc'.concat(String(category["id"])) + '">' + category["name"] + '</button><br>Click the link to find out more<br>';
      const idw = "idc".concat(String(category["id"]));
   document.getElementById('searchSection').innerHTML = html;
   document.getElementById(idw).addEventListener('click', displayCategoryPageByID);
   }
   else {
      alert('aaaahh');
   }
}

async function displayCategoryPageByID () {
   let a = this.id;
   a = a.substring(3, a.length);
   const response = await fetch('http://127.0.0.1:8090/findc/'.concat(String(a)));
   if (response.ok) {
      const data = await response.json();
      document.getElementById('searchSection').innerHTML = 'page about ' + data["name"];
   }
   else {
      alert('aaaahhhh');
   }
}

function explain1 () {
   document.getElementById('explanation').innerHTML = '<p>This opens the search tool to be used</p><br><br><br>';
}

function explain2 () {
   document.getElementById('explanation').innerHTML = '<p>This opens a random item</p><br><br><br>';
}

function explain3 () {
   document.getElementById('explanation').innerHTML = '<p>This allows you to add an item to the database</p><br><br><br>'
}

function removeexplanation () {
   document.getElementById('explanation').innerHTML = '';
}

function reset () {
   document.getElementById('searchSection').innerHTML = '';
}

a.addEventListener('click', opensearching);
b.addEventListener('click', randomsearch);
c.addEventListener('click', openadding);
submit.addEventListener('click', search);
a.addEventListener('mouseover', explain1);
b.addEventListener('mouseover', explain2);
c.addEventListener('mouseover', explain3);
a.addEventListener('mouseout', removeexplanation);
b.addEventListener('mouseout', removeexplanation);
c.addEventListener('mouseout', removeexplanation);
home.addEventListener('click', reset);
