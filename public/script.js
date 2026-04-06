const menuOpen = document.querySelector("#menuOpen")
const menu = document.querySelector('.menu')
const root = document.documentElement

document.documentElement.classList.remove("no-js")
document.documentElement.classList.add("js")

if (menuOpen && menu) {
  menuOpen.addEventListener("click", function (event) {
    event.preventDefault()
    const isOpen = menu.classList.toggle("is-open")

    if (isOpen) {
      root.classList.add('menu-open')
    } else {
      root.classList.remove('menu-open')
    }
  })
}