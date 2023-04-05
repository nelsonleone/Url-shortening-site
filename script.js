// TOGGLE MENU DISPLAY HANDLING

const openNav = document.querySelector('.toggle-menu')
const topNav = document.getElementById('top-nav')
let linkDataArray = []

openNav.addEventListener('click',(e) => {
   if(openNav.src.match('hamburger')){
      topNav.style.display = "block";
      openNav.src = "images/icon-close.svg";
      openNav.setAttribute('aria-expanded',true)
   }else{
      topNav.style.display = "none";
      openNav.src = "images/icon-hamburger.svg";
      openNav.setAttribute('aria-expanded',false)
   }
})



// ERROR INPUT FORM HANDLING
const input = document.querySelector('input')
input.addEventListener('input',()  => {
   document.querySelector('.error-para').style.display = "none";
   input.classList.remove('error-input')
})

const form = document.querySelector('form').addEventListener('submit',(e) =>  {
   const inputValue = input.value;
   e.preventDefault()
   if(checkValidURL(inputValue)){
      return;
   }else if(!checkValidURL(inputValue) || inputValue === ""){
      document.querySelector('.error-para').style.display = "block";
      input.classList.add('error-input')
   }
})

function checkValidURL(string) {
   let url;
   try {
     url = new URL(string)
   } catch (_) {
     return false;
   }
   return url.protocol === "http:" || url.protocol === "https:" || url.protocol === "www.";
}





// THE URL DATA HANDLING
const getUrlBtn = document.getElementById('get-url')
const resultOutput = document.querySelector('.results-output')
getUrlBtn.addEventListener('click',getShortendUrl)

// localStorage.clear()

async function getShortendUrl(){
   const userInput = document.querySelector('input').value;
   const URL = `https://api.shrtco.de/v2/shorten?url=${userInput}`;


   const resp = await fetch(URL)
   try{
      if(resp.ok){
         const linkData = await resp.json()
         if(checkValidURL(userInput)){
            linkDataArray.push({...linkData,id:Math.random()})
            console.log(linkDataArray)
            renderShortendLinks()
         }
      }
   }
   catch(err){
      alert(err.message)
   }
}

function handleDelete(id){
   const newArray = linkDataArray.filter(linkData => linkData.id !== id)
   linkDataArray = newArray;
   console.log(linkDataArray)
   renderShortendLinks()
}


function renderShortendLinks(savedLinkDataArray){
   localStorage.setItem("linkData",JSON.stringify(linkDataArray))
   resultOutput.innerHTML = ""

   if(savedLinkDataArray){
      savedLinkDataArray.forEach(savedLinkData => {
         resultOutput.innerHTML+= `
         <div class="inputed__shortend">
            <p class="inputed-link">${savedLinkData.result.original_link}</p>
            <p class="shortend-link">${savedLinkData.result.full_short_link2}</p>
   
            <div>
               <button 
                  class="copy-btn" 
                  onClick="copy(event)"
                  >
                  Copy
               </button>
               <button 
                  class="delete-btn"
                  onClick="handleDelete(${savedLinkData.id})"
                  >
                  Delete
               </button>
            </div>
         </div> 
      `
      })
   }
   
   linkDataArray.forEach(linkData => {
      resultOutput.innerHTML+= `
      <div class="inputed__shortend">
         <p class="inputed-link">${linkData.result.original_link}</p>
         <p class="shortend-link">${linkData.result.full_short_link2}</p>

         <div>
            <button 
               class="copy-btn" 
               onClick="copy(event)"
               >
               Copy
            </button>
            <button 
               class="delete-btn"
               onClick="handleDelete(${linkData.id})"
               >
               Delete
            </button>
         </div>
      </div> 
      `
   })
}




// HANDLING THE COPY FUNCTIONALITY

function copy(e){
   e = e || window.event;
   const targetElement = e.target || e.srcElement;;
   const shortendLinks = document.querySelectorAll('.shortend-link')

   document.querySelectorAll('.copy-btn').forEach((button,index) => {
      const text = shortendLinks[index].innerText;
      navigator.clipboard.writeText(text)
      targetElement.classList.add('copied')
      targetElement.innerText = "Copied"
   })
}


// HANDLING THE LOCALSTORAGE DATA
window.onload = getStoredData()

function getStoredData(){
   const savedLinkDataArray = localStorage.getItem("linkData") && JSON.parse(localStorage.getItem("linkData"))
   if(savedLinkDataArray){
      renderShortendLinks(savedLinkDataArray)
   }
}


