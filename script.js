const toggleButtons = document.querySelectorAll('.toggle-button');
const tabs = document.querySelectorAll('.tab');
const homeTab = document.getElementById('tab-inicio');
const tabCloser = document.querySelectorAll('.tab-closer');

toggleButtons.forEach((toggleButton) =>
    toggleButton.addEventListener('click', function(e) {
        let buttonTarget = e.currentTarget.getAttribute('data-toggle');
        let target = document.getElementById(buttonTarget);
        if (target.hasAttribute('hidden')) {
            target.removeAttribute('hidden');
            target.click();
        }
    })
);

tabCloser.forEach((closer) =>
    closer.addEventListener('click', function(e) {
        let closeTarget = e.currentTarget.parentElement;
        closeTarget.setAttribute('hidden', '');
        homeTab.click();
    })
);








// btPessoas.onclick = () => {
//     if (tabPessoas.hasAttribute('hidden')) {
//         tabPessoas.removeAttribute('hidden');
//         tabPessoas.click();
//     }
// };

