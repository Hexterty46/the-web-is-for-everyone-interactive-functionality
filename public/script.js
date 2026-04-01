const menuOpen = document.querySelector("#menuOpen")
// const menuClose = document.querySelector('#menuSluiten')
const menu = document.querySelector('.menu')

console.log('test')

menuOpen.addEventListener('click', function(event) {
    menu.classList.toggle('is-open')
    // document.body.style.overflow = 'hidden'
    event.preventDefault()
})

// menuClose.addEventListener('click', () => {
//     menu.classList.remove('is-open')
//     // document.body.style.overflow = ''
// })