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
  linksTable.innerHTML = "";
  
  if (links.length === 0) {
    linkCount.textContent = "0 links";
    emptyState.classList.remove("hidden");
    return;
  }
  
  emptyState.classList.add("hidden");
  linkCount.textContent = `${links.length} links`;
  
  links.forEach((link) => {
    const linkdiv = document.createElement("div");
    linkdiv.className = "link-row";
    
    linkdiv.innerHTML = `
      <div class="link-left">
        <span class="link-short">${link.code}</span>
        <span class="link-original">${link.url}</span>
      </div>
      <div class="link-right">
        <span class="link-clicks">${link.clicks} clicks</span>
        <button class="btn-delete-row">Delete</button>
      </div>
    `;
    
    linksTable.appendChild(linkdiv);
    
    const deleteBtn = linkdiv.querySelector(".btn-delete-row");
    deleteBtn.addEventListener("click", async () => {
      await fetch(`http://127.0.0.1:3000/links/${link.id}`, {
        method: "DELETE"
      });
      fetchLinks();
    });
  });
}

async function fetchLinks() {
  try {
    const response = await fetch("http://127.0.0.1:3000/links");
    const data = await response.json();
    renderLink(data);
  } catch (err) {
    console.log(err);
  }
}

btnShorten.addEventListener("click", async () => {
  const url = urlInput.value;
  
  if (url === "" || !url.startsWith("http")) {
    errorMsg.classList.remove("hidden");
    return;
  }
  
  errorMsg.classList.add("hidden");
  
  try {
    const response = await fetch("http://127.0.0.1:3000/links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url })
    });
    
    const data = await response.json();
    resultCard.classList.remove("hidden");
    shortUrl.textContent = `http://127.0.0.1:3000/${data.code}`;
    originalUrl.textContent = data.url;
    fetchLinks();
  } catch (err) {
    console.log(err);
  }
});

btnCopy.addEventListener("click", () => {
  navigator.clipboard.writeText(shortUrl.textContent);
  btnCopy.textContent = "Copied!";
  setTimeout(() => {
    btnCopy.textContent = "Copy";
  }, 2000);
});

fetchLinks();