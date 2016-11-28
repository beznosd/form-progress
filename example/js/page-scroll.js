const progress = document.querySelector('.progress');

const nav = document.querySelector('.nav-wrapper');
let navHeight = nav.clientHeight;

window.onscroll = function() {
    if (window.pageYOffset >= navHeight) {
        progress.style.top = 0 + 'px';
    } else {
        progress.style.top = navHeight - window.pageYOffset + 'px';
    }
}