const URL_BASE = 'http://127.0.0.1:5000';

const btTotalQuitado = document.getElementById('bt-total-quitado');
const totalQuitadoRes = document.getElementById('total-quitado-res');

const btTotalPendente = document.getElementById('bt-total-pendente');
const totalPendenteRes = document.getElementById('total-pendente-res');

async function getTotalQuitado() {
    try {
        let totalQuitado = await axios({
            method: 'GET',
            url: URL_BASE + '/getTotalQuitado'
        });

        totalQuitadoRes.innerText = totalQuitado.data;
    }

    catch (error) {
        console.log(error);
    }
}

async function getTotalPendente() {
    try {
        let totalPendente = await axios({
            method: 'GET',
            url: URL_BASE + '/getTotalPendente'

        });
        
        totalPendenteRes.innerText = totalPendente.data;
    }

    catch (error) {
        console.log(error);
    }
}

btTotalQuitado.addEventListener('click', (e) => {
    getTotalQuitado();
    e.preventDefault();
});

btTotalPendente.addEventListener('click', (e) => {
    getTotalPendente();
    e.preventDefault();
});

getTotalQuitado();
getTotalPendente();