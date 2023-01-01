// TOGGLE MENU DISPLAY HANDLING

const openNav = document.querySelector('.toggle-menu')
const topNav = document.getElementById('top-nav')

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


async function getShortendUrl(){
   const userInput = document.querySelector('input').value;
   const URL = `https://api.shrtco.de/v2/shorten?url=${userInput}`;

   const resp = await fetch(URL)
   if(resp.ok){
      const urlData = await resp.json()
      if(checkValidURL(userInput)){
         const linkData =`
         <div class="inputed__shortend">
            <p class="inputed-link">${urlData.result.original_link}</p>
            <p class="shortend-link">${urlData.result.full_short_link2}</p>
            <button 
              class="copy-btn" 
              onClick="copy(event)"
              >
              Copy</button>
        </div> 
         `
         resultOutput.innerHTML += linkData
         localStorage.setItem('linkData',linkData)
      }
   }else{
      alert('Sorry Network Error, try again')
   }
}




// HANDLING THE COPY FUNCTIONALITY

function copy(e){
   e = e || window.event;
   const targetElement = e.target || e.srcElement;;
   const shortendLinks = document.querySelectorAll('.shortend-link')
   console.log(e)
   document.querySelectorAll('.copy-btn').forEach((button,index) => {
      const text = shortendLinks[index].innerText;
      navigator.clipboard.writeText(text)
      targetElement.classList.add('copied')
      targetElement.innerText = "Copied"
   })
}


// HANDLING THE LOCALSTORAGE DATA
const linkData = localStorage.getItem("linkData")
if(linkData !== null){
   resultOutput.innerHTML += linkData;
}


