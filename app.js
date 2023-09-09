const fajr = document.querySelector("#fajr .timeText");
const sunrise = document.querySelector("#sunrise .timeText");
const dhuhr = document.querySelector("#duhr .timeText");
const asr = document.querySelector("#asr .timeText");
const maghrib = document.querySelector("#mughrib .timeText");
const isha = document.querySelector("#isha .timeText");
const useLocaiotnBtn = document.getElementById("useLocation");
const showPrayerTimes = document.getElementById("showPrayerTimes");
const todaysDateElement = document.getElementById("todaysDate");
let addCityInputs = [];
let long = 0;
let lat = 0;
const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() +1;
const currentDay = new Date().getDate();

let array = [];
let lastSelectedCity = '';
useLocaiotnBtn.addEventListener("click",()=>{
    if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition((position)=>{
    long = position.coords.longitude;
    lat = position.coords.latitude;
    axios.get(`http://api.aladhan.com/v1/calendar/${currentYear}/${currentMonth}?latitude=${lat}&longitude=${long}`)
    .then((response)=>{
        displayTodaysPrayers(response)
    })
    })}
})
document.addEventListener("click",(e)=>{
    if(e.target.value !== 'none' && e.target.matches('select')){
        lastSelectedCity = e.target;
    }
    if(e.target.classList.contains('add-city')){
        const element = e.target;
        const country = element.parentElement.dataset.country;
        element.addEventListener("blur",()=>{
        if(element.value !== ''){
        const city = element.value;
        addCity(city,country)
        element.value=''
        }
        })
        element.addEventListener("keydown",(e)=>{
        if(e.key === 'Enter'){
        if(element.value !== ''){
        const city = element.value;
        addCity(city,country)
        element.value=''
        }
        }
        })
    }
})
showPrayerTimes.addEventListener("click",()=>{
    if(lastSelectedCity !== ''){
    const listsCountry = lastSelectedCity.parentElement.dataset.country;
    const cityName = lastSelectedCity.value
        console.log(listsCountry,cityName)
        displyCityPrayers(listsCountry,cityName)
    }
})
function displayTodaysPrayers(response){
    const prayerTimes = response.data.data[currentDay -1].timings;
    fillPrayersBoxes(prayerTimes);
}
function displyCityPrayers(country,city){
axios.get(`http://api.aladhan.com/v1/calendarByCity/${currentYear}/${currentMonth}?city=${city}&country=${country}`)
.then(response =>{
    const prayerTimes = response.data.data[currentDay-1].timings
    fillPrayersBoxes(prayerTimes);
})
}
function fillPrayersBoxes(prayerTimes){
    fajr.innerText = prayerTimes.Fajr.slice(0, -5);
    sunrise.innerText = prayerTimes.Sunrise.slice(0, -5);
    dhuhr.innerText = prayerTimes.Dhuhr.slice(0, -5);
    asr.innerText = prayerTimes.Asr.slice(0, -5);
    maghrib.innerText = prayerTimes.Maghrib.slice(0, -5);
    isha.innerText = prayerTimes.Isha.slice(0, -5);
}
document.addEventListener("DOMContentLoaded",()=>{
    addCityInputs = Array.from(document.querySelectorAll('.add-city'));
})
function addCity(city,country){
    axios.get(`http://api.aladhan.com/v1/calendarByCity/${currentYear}/${currentMonth}?city=${city}&country=${country}`)
    .then(() =>{
    const content = `<option value=${city}>${city}</option>`
    const list = document.querySelector(`[data-country=${country}]`);
    const select = list.querySelector("select");
    select.innerHTML += content;
    showAddedModal();
    })
    .catch(()=>{alert('Error: the enterd city name is invalid.')})
}

function showAddedModal(){
    document.getElementById("addedModal").classList.remove("none");
    setTimeout(()=>{
    document.getElementById("addedModal").classList.add("none");
    },2000)
}
const todaysDateInNumber=`${currentYear}-${currentMonth}-${currentDay}`
todaysDateElement.innerText = todaysDateInNumber;