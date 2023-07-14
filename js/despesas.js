const URL_BASE = 'http://127.0.0.1:5000';

// elementos da tabela de cad. pessoas
const finDespesasHeader = document.getElementById('fin_despesas_header');
const finDespesasBody = document.getElementById('fin_despesas_body');
const finDespesasTab = document.getElementById('fin_despesas_tab');

const newTableHeader = document.createElement('th');
newTableHeader.setAttribute('scope', 'col');

// cria novas linhas, celulas e checkboxes
const newTableRow = document.createElement('tr');
const newTableData = document.createElement('td');
const newCheckBox = document.createElement('input');
newCheckBox.setAttribute('type', 'radio');
newCheckBox.setAttribute('name', 'rowSelect');
newCheckBox.classList.add('checkbox-d');
newCheckBox.classList.add('mt-3');

// botões dentro do módulo de receitas
const alterarDespesaButton = document.querySelector('#bt-alterar-despesa');
const excluirDespesaButton = document.querySelector('#bt-excluir-despesa');

// campos do formulário de inclusão de uma nova despesa
let newDespesaPessoaRef = document.getElementById('incluir_despesa_cliente');
let newDespesaValor = document.getElementById('incluir_despesa_valor');
let newDespesaFormaPgto = document.getElementById('incluir_despesa_forma_pgto');
let newDespesaQuitadaSim = document.getElementById('incluir_despesa_quitada_sim');
let newDespesaQuitadaNao = document.getElementById('incluir_despesa_quitada_nao');

// campos do formulário de alteração de cadastro de pessoa
let altDespesaCodigo = document.querySelector('.alt-despesa-codigo');
let altDespesaNomePessoa = document.querySelector('.alt-despesa-nome-cliente');
let altDespesaPessoaRef = document.getElementById('alterar_despesa_cliente');
let altDespesaValor = document.getElementById('alterar_despesa_valor');
let altDespesaFormaPgto = document.getElementById('alterar_despesa_forma_pgto');
let altDespesaQuitadaSim = document.getElementById('alterar_despesa_quitada_sim');
let altDespesaQuitadaNao = document.getElementById('alterar_despesa_quitada_nao');

// campos do formulário de aplicação dos filtros
let filtrosDespesasNome = document.getElementById('filtros_despesas_nome');
let filtrosDespesasFormaPgto = document.getElementById('filtros_despesas_forma_pgto');
let filtrosDespesasValorMinimo = document.getElementById('filtros_despesas_valor_minimo');
let filtrosDespesasValorMaximo = document.getElementById('filtros_despesas_valor_maximo');
let filtrosDespesasQuitadaSim = document.getElementById('filtros_despesas_quitada_sim');
let filtrosDespesasQuitadaNao = document.getElementById('filtros_despesas_quitada_nao');


// traz do servidor os dados de despesas
async function getContasPagar() {
    try {
        finDespesasHeader.innerHTML = '';
        finDespesasBody.innerHTML = '';

        let params = {
            nome: filtrosDespesasNome.value,
            forma_pgto: filtrosDespesasFormaPgto.value,
            valor_minimo: filtrosDespesasValorMinimo.value,
            valor_maximo: filtrosDespesasValorMaximo.value,
            quitada: ''
        };

        if (filtrosDespesasQuitadaSim.checked) params.quitada = true;
        else if (filtrosDespesasQuitadaNao.checked) params.quitada = false;

        let contasPagar = await axios({
            method: 'GET',
            url: URL_BASE + '/getContasPagar',
            params: params
        });

        let keys = [];
        let i = 0;

        // para cada linha existente no banco de dados irá criar uma linha com checkbox na tabela
        contasPagar.data.forEach(row => {
            // gera um id para cada linha seguido o id dos registros do banco
            newTableRow.id = contasPagar.data[i].codigo;
            newTableRow.className = 'tr-d';
            // adiciona atributo para seguir o índice dos registros do banco
            newTableRow.setAttribute('index', i);
            i++;

            finDespesasBody.appendChild(newTableRow.cloneNode(true));
            finDespesasBody.lastChild.appendChild(newCheckBox.cloneNode(true));

            // para cada registro na linha irá criar uma célula na tabela
            for (let key in row) {
                if (!keys.includes(key)) {
                    keys.push(key);
                }
                newTableData.className = 'td-d';
                // traz a informação contida no registro para a tabela
                newTableData.innerText = row[key];
                finDespesasBody.lastChild.appendChild(newTableData.cloneNode(true));
                finDespesasBody.lastChild.children[1].classList.add('codigo');
            };
        });

        // cria o cabeçalho da tabela conforme consta no banco de dados
        for (let key of keys) {
            newTableHeader.innerText = key;
            finDespesasHeader.appendChild(newTableHeader.cloneNode(true));
        }

        // cria uma celula sem texto no cabeçalho, apenas para alinhar as colunas da tabela
        finDespesasHeader.insertBefore(newTableHeader, finDespesasHeader.firstChild);
        finDespesasHeader.firstChild.innerText = '';
        finDespesasHeader.children[2].setAttribute('hidden', '');

        let checkboxes = document.querySelectorAll('.checkbox-d');

        // função para permitir apenas uma linha ficar com a classe 'selected'
        const cleanChecked = (checkboxes) => {
            checkboxes.forEach((checkbox) => {
                let target = checkbox.parentElement;
                target.classList.remove('selected-row');
                for (let child of target.children) {
                    child.classList.remove('selected');
                }
            });
        };

        // verifica se algum checkbox foi pressionado
        checkboxes.forEach((checkbox) => {
            checkbox.addEventListener('click', () => {
                cleanChecked(checkboxes);
                let target = checkbox.parentElement;
                // caso sim, libera o uso dos botões 'alterar' e 'excluir'
                if (checkbox.checked) {
                    alterarDespesaButton.disabled = false;
                    excluirDespesaButton.disabled = false;
                    target.classList.add('selected-row');
                    for (let child of target.children) {
                        child.classList.add('selected');
                    }
                }

                let index = target.getAttribute('index');

                altDespesaCodigo.innerText = target.id;
                altDespesaNomePessoa.innerText = contasPagar.data[index].pessoa;
                altDespesaPessoaRef.value = contasPagar.data[index].pessoa_ref;
                altDespesaValor.value = contasPagar.data[index].valor;
                altDespesaFormaPgto.value = contasPagar.data[index].forma_pgto;

                if (contasPagar.data[index].quitada == 'sim') {
                    altDespesaQuitadaNao.removeAttribute('checked');
                    altDespesaQuitadaSim.setAttribute('checked', true);
                }

                else if (contasPagar.data[index].quitada == 'não') {
                    altDespesaQuitadaSim.removeAttribute('checked');
                    altDespesaQuitadaNao.setAttribute('checked', true);
                }

            });
        });

        const tableRow = document.querySelectorAll('.tr-d');
        tableRow.forEach((tableRow) => {
            tableRow.children[2].setAttribute('hidden', '');
        });
    }

    catch (error) {
        console.log(error);
    };
};

// leva ao servidor as informações do formulario de cadastro de nova pessoa
async function newFinDespesa() {
    try {
        let newDespesa = {
            'pessoa': newDespesaPessoaRef.value,
            'valor': parseFloat(newDespesaValor.value),
            'forma_pgto': newDespesaFormaPgto.value,
            'quitada': undefined,
        };

        if (newDespesaQuitadaSim.checked) newDespesa.quitada = true;
        else if (newDespesaQuitadaNao.checked) newDespesa.quitada = false;

        await axios({
            method: 'POST',
            url: URL_BASE + '/newFinDespesa',
            data: JSON.stringify(newDespesa),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        newDespesaClose.click();
        finDespesasHeader.innerHTML = '';
        finDespesasBody.innerHTML = '';
        getContasPagar();

        newDespesaPessoaRef.value = '';
        newDespesaValor.value = '';
        newDespesaFormaPgto.value = '';

    }
    catch (error) {
        console.log(error);
    }
}

// leva ao servidor as informações do formulario de alteração da parcela
async function altFinDespesa() {
    try {
        let altDespesaData = {
            'codigo': altDespesaCodigo.innerText,
            'pessoa': altDespesaPessoaRef.value,
            'valor': parseFloat(altDespesaValor.value),
            'forma_pgto': altDespesaFormaPgto.value,
            'quitada': undefined,
        };

        if (altDespesaQuitadaSim.checked) altDespesaData.quitada = true;
        else if (altDespesaQuitadaNao.checked) altDespesaData.quitada = false;

        const selectedRow = document.querySelector('.selected-row');
        if (selectedRow != null) {
            let codigo = selectedRow.querySelector('.codigo').innerText;
            altDespesaData.codigo = codigo;
        }
        await axios({
            method: 'PUT',
            url: URL_BASE + '/altFinDespesa',
            data: JSON.stringify(altDespesaData),
        });

        altDespesaClose.click();
        finDespesasHeader.innerHTML = '';
        finDespesasBody.innerHTML = '';
        getContasPagar();

    }
    catch (error) {
        console.log(error);
    }
}


// leva ao servidor a informação de exclusão de um cadastro
async function delFinDespesa() {
    try {
        const selectedRow = document.querySelector('.selected-row');

        let delDespesaData = {
            'codigo': altDespesaCodigo.innerText,
        };

        if (selectedRow != null) {
            let codigo = selectedRow.querySelector('.codigo').innerText;
            delDespesaData.codigo = codigo;
        }
        await axios({
            method: 'DELETE',
            url: URL_BASE + '/delFinDespesa',
            data: JSON.stringify(delDespesaData),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        delDespesaClose.click();
        finDespesasHeader.innerHTML = '';
        finDespesasBody.innerHTML = '';
        getContasPagar();

    }
    catch (error) {
        console.log(error);
    }
}

// configura eventos de clique para confirmação da ação (incluir, alterar e excluir)
const despesasTab = document.getElementById('fin-despesas-tab');
const despesasContent = document.getElementById('fin-despesas-cont');
const closeDespesasContent = document.querySelector('.tab-despesas-closer');

const btAltDespesa = document.getElementById('alterar-despesa');
const altDespesaClose = document.getElementById('alt-despesa-close');

btAltDespesa.addEventListener('click', (e) => {
    e.preventDefault();
    altFinDespesa();

});

const btDelDespesa = document.getElementById('confirma-exclusao-despesa');
const delDespesaClose = document.getElementById('del-despesa-close');

btDelDespesa.addEventListener('click', (e) => {
    e.preventDefault();
    delFinDespesa();
});

const newDespesaClose = document.getElementById('new-despesa-close');
const newDespesaIncluir = document.getElementById('new-despesa-incluir');

newDespesaIncluir.addEventListener('click', (e) => {
    e.preventDefault();
    newFinDespesa();
});

const filtrosDespesasConfirma = document.getElementById('filtros-despesas-confirma');
const filtrosDespesasClose = document.getElementById('fin-despesas-filtros-close');

filtrosDespesasConfirma.addEventListener('click', () => {
    filtrosDespesasClose.click();
    finDespesasTab.click();
});

finDespesasTab.addEventListener('click', () => {
    getContasPagar();
});
