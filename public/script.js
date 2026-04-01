const menuOpen = document.querySelector("#menuOpen")
const menu = document.querySelector('.menu')


document.documentElement.classList.remove("no-js");
document.documentElement.classList.add("js");

if (menuOpen && menu) {
  menuOpen.addEventListener("click", function (event) {
    menu.classList.toggle("is-open");
    event.preventDefault();
  });
}

// menuClose.addEventListener('click', () => {
//     menu.classList.remove('is-open')
//     // document.body.style.overflow = ''
// })