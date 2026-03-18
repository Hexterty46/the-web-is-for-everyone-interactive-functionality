const menuOpen = document.querySelector("#menuOpen")
// const menuClose = document.querySelector('#menuSluiten')
const menu = document.querySelector('.menu')

menuOpen.addEventListener('click', () => {
    menu.classList.toggle('is-open')
    // document.body.style.overflow = 'hidden'
})

// menuClose.addEventListener('click', () => {
//     menu.classList.remove('is-open')
//     // document.body.style.overflow = ''
// })