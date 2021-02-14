const imagesArea = document.querySelector('.images');
const gallery = document.querySelector('.gallery');
const galleryHeader = document.querySelector('.gallery-header');
const searchBtn = document.getElementById('search-btn');
const sliderBtn = document.getElementById('create-slider');
const sliderContainer = document.getElementById('sliders');
const modal = document.querySelector('.modal');
// selected image 
let sliders = [];


// If this key doesn't work
// Find the name in the url and go to their website
// to create your own api key
const KEY = '15674931-a9d714b6e9d654524df198e00&q';

// show images 
const showImages = (images) => {
  imagesArea.style.display = 'block';
  gallery.innerHTML = '';
  // show gallery title
  galleryHeader.style.display = 'flex';
  images.forEach(image => {
    let div = document.createElement('div');
    div.className = 'col-lg-3 col-md-4 col-xs-6 img-item mb-2';
    div.innerHTML = ` <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">`;
    gallery.appendChild(div)
  })

}

const getImages = (query) => {
  //put search button on loading mode
  searchBtn.setAttribute('disabled', 'true');
  searchBtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" style="margin-right: 5px"></span>Loading`;

  //fetch request set delay to 2 secons to show loading spninner
  setTimeout(function () {
    fetch(`https://pixabay.com/api/?key=${KEY}=${query}&image_type=photo&pretty=true`)
        .then(response => response.json())
        .then(data => {

          //Check whether response has any data
          if(data.hits.length === 0){

            //put search button on normal mode
            searchBtn.removeAttribute('disabled');
            searchBtn.innerText = 'Search';

            modal.querySelector('.message').innerText = 'No Image found';
            modal.classList.add('active');
            return;
          }

          showImages(data.hits);

          //put search button on normal mode
          searchBtn.removeAttribute('disabled');
          searchBtn.innerText = 'Search';
        })
        .catch(err => {

          modal.querySelector('.message').innerText = err;
          modal.classList.add('active');

          //put search button on normal mode
          searchBtn.removeAttribute('disabled');
          searchBtn.innerText = 'Search';
        });

  }, 2000)

}

let slideIndex = 0;
const selectItem = (event, img) => {
  let element = event.target;
  element.classList.toggle('added');
 
  let item = sliders.indexOf(img);
  if (item === -1) {
    sliders.push(img);
  } else {
    sliders.splice(item,1);
  }
}
var timer
const createSlider = () => {
  // check slider image length
  if (sliders.length < 2) {
    modal.querySelector('.message').innerText = 'Select at least 2 image.';
    modal.classList.add('active');
    return;
  }

  // check slider slideshow interval
  const duration = document.getElementById('doration').value || 1000;

  if(duration<0){
    modal.querySelector('.message').innerText = 'Slider changing duration can\'t be negetive';
    modal.classList.add('active');
    return;
  }


  // crate slider previous next area
  sliderContainer.innerHTML = '';
  const prevNext = document.createElement('div');
  prevNext.className = "prev-next d-flex w-100 justify-content-between align-items-center";
  prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

  sliderContainer.appendChild(prevNext)
  document.querySelector('.main').style.display = 'block';
  // hide image aria
  imagesArea.style.display = 'none';


  sliders.forEach(slide => {
    let item = document.createElement('div')
    item.className = "slider-item";
    item.innerHTML = `<img class="w-100"
    src="${slide}"
    alt="">`;
    sliderContainer.appendChild(item)
  })
  changeSlide(0)
  timer = setInterval(function () {
    slideIndex++;
    changeSlide(slideIndex);
  }, duration);
}

// change slider index 
const changeItem = index => {
  changeSlide(slideIndex += index);
}

// change slide item
const changeSlide = (index) => {

  const items = document.querySelectorAll('.slider-item');
  if (index < 0) {
    slideIndex = items.length - 1
    index = slideIndex;
  };

  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }

  items.forEach(item => {
    item.style.display = "none"
  })

  items[index].style.display = "block"
}

const searchHandler = ()=>{
  document.querySelector('.main').style.display = 'none';
  clearInterval(timer);
  const search = document.getElementById('search');
  getImages(search.value)
  sliders.length = 0;
}

searchBtn.addEventListener('click', searchHandler);
document.getElementById('search').addEventListener('keyup', (e)=>{

  if (e.key === 'Enter') {

    //Checking where search is already running
    if(!searchBtn.hasAttribute('disabled')) {
      e.preventDefault();
      searchHandler();
    }
  }
})

sliderBtn.addEventListener('click', function () {
  createSlider()
})


//eventlistener for Popup close button

document.querySelector('.modal .modal-container .close').addEventListener('click', function (e) {
    this.closest('.modal').classList.remove('active');
})

document.addEventListener('keyup', (e)=>{
    if(e.key === 'Escape'){
      if(modal.classList.contains('active')){
        modal.classList.remove('active');
      }
    }
})