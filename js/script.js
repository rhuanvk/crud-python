const toggleButtons = document.querySelectorAll('.toggle-button');
const homeTab = document.getElementById('home-tab');
const homeCont = document.getElementById('home-cont');
const tabButtons = document.querySelectorAll('.tab-button');
const tabCloser = document.querySelectorAll('.tab-closer');
const tabPanes = document.querySelectorAll('.tab-pane');

const tableRows = document.querySelectorAll('.tr');
const tableData = document.querySelectorAll('.td');

toggleButtons.forEach((toggleButton) =>
    toggleButton.addEventListener('click', (e) => {
        let buttonTarget = e.currentTarget.getAttribute('data-toggle');
        let target = document.getElementById(buttonTarget);
        // let targetCont = document.querySelector(target.getAttribute('data-bs-target'));

        if (target.hasAttribute('hidden')) {
            target.removeAttribute('hidden');
            target.click();
        }
    })
);

function hideContent() {
    tabButtons.forEach((tabButton) => {
        tabButton.addEventListener('click', (e) => {
            let buttonTarget = e.currentTarget.getAttribute('data-bs-target');
            let target = document.querySelector(buttonTarget);

            tabPanes.forEach((tabPane) => {
                tabPane.setAttribute('hidden', '');
            });

            target.toggleAttribute('hidden');
        });
    });
}

function closeActualTab() {
    tabCloser.forEach((closer) =>
        closer.addEventListener('click', (e) => {
            let closeTarget = e.currentTarget.parentElement;
            let targetCont = document.querySelector(closeTarget.getAttribute('data-bs-target'));
            targetCont.setAttribute('hidden', '');
            closeTarget.setAttribute('hidden', '');
            
            homeTab.click();
        })
    );
}


homeTab.addEventListener('click', () => {
    tabPanes.forEach((tabPane) => {
        tabPane.setAttribute('hidden', '');
    });

    homeCont.removeAttribute('hidden');
});


hideContent();
closeActualTab();