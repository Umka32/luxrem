const selectFilterBtn = (type) => {
  document.getElementsByClassName('-current')[0].classList.remove('-current')
  document.getElementById(type).classList.add('-current')
  let list = document.querySelectorAll('.gallery__example-item')
  if (list) {
    list = Array.from(list)
    list.forEach(item => {
      if (!item.classList.contains(type) && type !== 'all') {
        item.classList.add('-invisible')
      } else {
        item.classList.remove('-invisible')
      }
    });
  }
}

const openFullPhoto = (el) => {
  document.querySelector('.modal').classList.remove('-invisible')
  let img = document.createElement('img')
  img.classList.add('full-photo')
  img.src = el
  document.querySelector('.modal__img-wrapper').appendChild(img)
}

const closeModal = () => {
  document.querySelector('.modal').classList.add('-invisible')
  document.querySelector('.full-photo').remove()
}

window.onclick = function (event) {
  const modal = document.querySelector('.modal')
  if (event.target === modal) {
    modal.classList.add('-invisible')
    document.querySelector('.full-photo').remove()
  }
}
