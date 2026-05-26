/* select elemens #urlInput, #btnShorten, #errorMsg, #resultCard, #shortUrl, #originalUrl, #btnCopy, #linksTable, #emptyState, #linkCount*/

const urlInput = document.querySelector("#urlInput");

const btnShorten = document.querySelector("#btnShorten");

const errorMsg = document.querySelector("#errorMsg");

const resultCard = document.querySelector("#resultCard");

const shortUrl = document.querySelector("#shortUrl");

const originalUrl = document.querySelector("#originalUrl");

const btnCopy = document.querySelector("#btnCopy");

const linksTable = document.querySelector("#linksTable");

const emptyState = document.querySelector("#emptyState");

const linkCount = document.querySelector("#linkCount");

//links Array
let links = []

function renderLink(links) {
  
  //Clear linksTable.innerHTML
  
  linksTable.innerHTML = "";
  
  // if Links is empty show empty state and update link count to 0
  
  if (links.length = 0 ) {
    linkCount= "0 links"
    emptyState.classList.remove("hidden")
    
    return 
    
  } else {
    emptyState.classList.add("hidden")
  }
  
  links.forEach( (link) => {
    const linkdiv = document.createElement("div");
    linkdiv.className = "link-row";
    
    
    linkdiv.innerHTML = `
     <div class = "link-left"> <span class = "link-short"   >${link.code}</span>
        <span class = "link-original">${link.url}</span>
      </div>
      <div class = "link-right">
        <span class = "link-clicks">${link.clicks}</span>
        <button class = "btn-delete-row"> Delete </button>
        
      </div>
      `;
      
      linksTable.appendChild(linkdiv);
  });
}

//use fetch to fetch links

async function fetchLinks() {
  try {
    const response = await fetch("http://localhost:3000/links");
    const data = await response.json();
    renderLink(data)
  } catch (err) {
     console.log(err);
  }
}

//the shortebtn event listener 

btnShorten.addEventListener("click", async () => {
  
  //get value from url input 
  
  const url = urlInput.value 
  
  if (url= "" || !url.startwith("http")) {
    errorMsg.classList.remove("hidden");
    return; 
  } 
  errorMsg.classList.add("hidden")
  
  try{
  fetch("http://localhost:3000/links", {
    method:"Post",
    headers: {"Content-type" : "application/json"},
    body:JSON.stringify({url})
    });
    
    const data = await response.json();
     resultCard.classList.remove("hidden");
   shortUrl.textContent = `http;//localhost:3000/${data.code}`;
  originalUrl.textContent = data.u;
  
  fetchLinks()
  
  } catch (err) {
    console.log(err)
  }
  
});

//copy links 


btnCopy.addEventListener("click", () => {
  
  navigator.clipboard.writetext(shortUrl.textContent)
  btnCopy.textContent = "Copied"
  
  setTimeout(()=>{
    btnCopy.textContent = "copy";
  }, 2000);
})


const deletebtn = linkdiv.querySelector(".btn-delete-row");

deletebtn.addEventListener("click", async() => {
  
  await fetch(`http://localhost:3000/links/${link.id}`,{
    method: "Delete"
  });
  fetchLinks();
});

fetchLinks()