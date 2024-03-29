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
   document.getElementById('searchSection').innerHTML = "<p>Type in the details about the board game</p><p>Game info:</p><div class='mb-3'><label for='nameInput' class='form-label'>Name</label><input type='text' class='form-control' id='nameInput' placeholder='cats'></div><div class='mb-3'><label for='descriptionInput' class='form-label'>Description</label><input type='text' class='form-control' id='descriptionInput' placeholder='cats'></div><div class='mb-3'><label for='minInput' class='form-label'>Max Number of Players</label><input type='text' class='form-control' id='minInput' placeholder='cats'></div><div class='mb-3'><label for='maxInput' class='form-label'>Min Number of Players</label>    <input type='text' class='form-control' id='maxInput' placeholder='cats'></div><p>Genre info:</p><div class='mb-3'><label for='categoryInput' class='form-label'>Name</label><input type='text' class='form-control' id='categoryInput' placeholder='cats'></div><div class='mb-3'><label for='categoryDescription' class='form-label'>Description (not needed if genre already exists)</label><input type='text' class='form-control' id='categoryDescription' placeholder='cats'></div><div id='submitAddition'><button type='button' class='btn btn-outline-success'>Submit</button></div>";
   document.getElementById('submitAddition').addEventListener('click', add);
}

async function add () {
   try {
   const objectname = document.getElementById('nameInput').value;
   const objectcategory = document.getElementById('categoryInput').value;
   const objectdescription = document.getElementById('descriptionInput').value;
   const objectmax = document.getElementById('maxInput').value;
   const objectmin = document.getElementById('minInput').value;
   const objectcategorydesc = document.getElementById('categoryDescription').value;
   const data = JSON.stringify({ "name": objectname, "category": objectcategory, "description": objectdescription, "max": objectmax, "min": objectmin, "categorydescription": objectcategorydesc });
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
    catch {
      alert('Your internet connection has failed. Try again later.');
}
}

async function randomsearch () {
   try {
   const response = await fetch('http://127.0.0.1:8090/random');
   if (response.ok) {
      displayPage(await response.json());
   }
   else {
      alert('aaaahhhh');
   }
}
   catch {
      alert('Your internet connection has failed. Try again later.');
}
};

async function search (event) {
   try {
   const inp = document.getElementById("searchInput").value;
   const response = await fetch('http://127.0.0.1:8090/search/'.concat(inp));
   if (response.ok) {
      const data = await response.json();
      displaySearchResults(data);
   }
   else {
      alert("Your internet connection has failed");
   }
   }
   catch {
      alert('Your internet connection has failed. Try again later.');
}
};

function displaySearchResults (arr) {
   try {
   let html = '<ul>';
   for (const i in arr) {
      html = html + '<button class="btn btn-link"' + 'id="id'.concat(String(arr[i]["id"])) + '">' + arr[i]["name"] + '</button><br>Player count: ' + String(arr[i]["minplayers"]) + '-' + String(arr[i]["maxplayers"]) + '<br>';
   }
   html = html + '</ul>';
   document.getElementById('searchSection').innerHTML = html;
   for (const i in arr) {
      const idw = "id".concat(String(arr[i]["id"]));
      document.getElementById(idw).addEventListener('click', displayPageByID);
   }
   return html;
}
   catch {
      alert('Your internet connection has failed. Try again later.');
}
}

async function displayPageByID () {
   try {
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
   catch {
      alert('Your internet connection has failed. Try again later.');
}
}

async function displayPage (element) {
   try {
   let html = '<h3>' + element['name'] + '</h3><br>';
   html = html + 'Description:<br>' + element['description'] + '<br><br>Max player count: ' + element['maxplayers'] + '<br>' + 'Min player count: ' + element['minplayers'] + '<br><br>';
   const response = await fetch('http://127.0.0.1:8090/category/'.concat(String(element["id"])));
   if (response.ok) {
      const category = await response.json();
      html = html + 'This game is part of the <button class="btn btn-link"' + 'id="idc'.concat(String(category["id"])) + '">' + category["name"] + '</button>genre<br>Click the link above to find out more about the genre<br>';
      const idw = "idc".concat(String(category["id"]));
   document.getElementById('searchSection').innerHTML = html;
   document.getElementById(idw).addEventListener('click', displayCategoryPageByID);
   }
   else {
      alert('aaaahh');
   }
   }
   catch {
   alert('Your internet connection has failed. Try again later.');
}
}

async function displayCategoryPageByID () {
   try {
   let a = this.id;
   a = a.substring(3, a.length);
   const response = await fetch('http://127.0.0.1:8090/findc/'.concat(String(a)));
   if (response.ok) {
      const data = await response.json();
      const html = '<h2> The ' + data["name"] + ' Genre</h2>' + '<br>Description:<br>' + data["description"];
      document.getElementById('searchSection').innerHTML = html;
   }
   else {
      alert('aaaahhhh');
   }
}
catch {
   alert('Your internet connection has failed. Try again later.');
}
}

function explain1 () {
   document.getElementById('explanation').innerHTML = '<p>This allows you to search for a board game by typing in text</p><br><br><br>';
}

function explain2 () {
   document.getElementById('explanation').innerHTML = '<p>This opens the page of a random board game</p><br><br><br>';
}

function explain3 () {
   document.getElementById('explanation').innerHTML = '<p>This allows you to add a board game to the database</p><br><br><br>';
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
