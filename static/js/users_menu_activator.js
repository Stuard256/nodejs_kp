let element = document.getElementById('users_menu');
let elementCaption = document.getElementById('users_menu_caption');
for (let it of element.children) {
    if (it.innerText.search(elementCaption.value) != -1) {
        it.classList.add('active');
    }
}