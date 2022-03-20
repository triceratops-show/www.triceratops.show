const body = document.querySelector('body');
const menu = document.querySelector('#menu');
const toggle = document.querySelector('#menu-toggle');

toggle.addEventListener('click', function(){
  if (menu.getAttribute('data-expanded') === 'true') {
    toggle.setAttribute('aria-expanded', 'false');
    menu.setAttribute('data-expanded', 'false');
  } else {
    toggle.setAttribute('aria-expanded', 'true');
    menu.setAttribute('data-expanded', 'true'); 
  }
});
