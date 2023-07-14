const URL_BASE = 'http://127.0.0.1:5000';

// elementos da tabela de cad. pessoas
const finReceberHeader = document.getElementById('fin_receber_header');
const finReceberBody = document.getElementById('fin_receber_body');
const finReceberTab = document.getElementById('fin-contas-tab');

const newTableHeader = document.createElement('th');
newTableHeader.setAttribute('scope', 'col');

// cria novas linhas, celulas e checkboxes
const newTableRow = document.createElement('tr');
const newTableData = document.createElement('td');
const newCheckBox = document.createElement('input');
newCheckBox.setAttribute('type', 'radio');
newCheckBox.setAttribute('name', 'rowSelect');
newCheckBox.classList.add('checkbox-f');
newCheckBox.classList.add('mt-3');

// botões dentro do módulo de despesas
const alterarParcelaButton = document.querySelector('#bt-alterar-parcela');
const excluirParcelaButton = document.querySelector('#bt-excluir-parcela');

// campos do formulário de inclusão de uma nova parcela
let newParcelaPessoaRef = document.getElementById('incluir_conta_cliente');
let newParcelaValor = document.getElementById('incluir_conta_valor');
let newParcelaFormaPgto = document.getElementById('incluir_conta_forma_pgto');
let newParcelaQuitadaSim = document.getElementById('incluir_conta_quitada_sim');
let newParcelaQuitadaNao = document.getElementById('incluir_conta_quitada_nao');

// campos do formulário de alteração de cadastro de pessoa
let altParcelaCodigo = document.querySelector('.alt-parcela-codigo');
let altParcelaNomePessoa = document.querySelector('.alt-parcela-nome-cliente');
let altParcelaPessoaRef = document.getElementById('alterar_conta_cliente');
let altParcelaValor = document.getElementById('alterar_conta_valor');
let altParcelaFormaPgto = document.getElementById('alterar_conta_forma_pgto');
let altParcelaQuitadaSim = document.getElementById('alterar_conta_quitada_sim');
let altParcelaQuitadaNao = document.getElementById('alterar_conta_quitada_nao');

// campos do formulário de aplicação dos filtros
let filtrosReceitasNome = document.getElementById('filtros_receitas_nome');
let filtrosReceitasFormaPgto = document.getElementById('filtros_receitas_forma_pgto');
let filtrosReceitasValorMinimo = document.getElementById('filtros_receitas_valor_minimo');
let filtrosReceitasValorMaximo = document.getElementById('filtros_receitas_valor_maximo');
let filtrosReceitasQuitadaSim = document.getElementById('filtros_receitas_quitada_sim');
let filtrosReceitasQuitadaNao = document.getElementById('filtros_receitas_quitada_nao');


// traz do servidor os dados de receitas
async function getContasReceber() {
    try {
        finReceberHeader.innerHTML = '';
        finReceberBody.innerHTML = '';

        let params = {
            nome: filtrosReceitasNome.value,
            forma_pgto: filtrosReceitasFormaPgto.value,
            valor_minimo: filtrosReceitasValorMinimo.value,
            valor_maximo: filtrosReceitasValorMaximo.value,
            quitada: ''
        };

        if (filtrosReceitasQuitadaSim.checked) params.quitada = true;
        else if (filtrosReceitasQuitadaNao.checked) params.quitada = false;

        let contasReceber = await axios({
            method: 'GET',
            url: URL_BASE + '/getContasReceber',
            params: params
        });

        let keys = [];
        let i = 0;

        // para cada linha existente no banco de dados irá criar uma linha com checkbox na tabela
        contasReceber.data.forEach(row => {
            // gera um id para cada linha seguido o id dos registros do banco
            newTableRow.id = contasReceber.data[i].codigo;
            newTableRow.className = 'tr-f';
            // adiciona atributo para seguir o índice dos registros do banco
            newTableRow.setAttribute('index', i);
            i++;

            finReceberBody.appendChild(newTableRow.cloneNode(true));
            finReceberBody.lastChild.appendChild(newCheckBox.cloneNode(true));

            // para cada registro na linha irá criar uma célula na tabela
            for (let key in row) {
                if (!keys.includes(key)) {
                    keys.push(key);
                }
                newTableData.className = 'td-f';
                // traz a informação contida no registro para a tabela
                newTableData.innerText = row[key];
                finReceberBody.lastChild.appendChild(newTableData.cloneNode(true));
                finReceberBody.lastChild.children[1].classList.add('codigo');
            };
        });

        // cria o cabeçalho da tabela conforme consta no banco de dados
        for (let key of keys) {
            newTableHeader.innerText = key;
            finReceberHeader.appendChild(newTableHeader.cloneNode(true));
        }

        // cria uma celula sem texto no cabeçalho, apenas para alinhar as colunas da tabela
        finReceberHeader.insertBefore(newTableHeader, finReceberHeader.firstChild);
        finReceberHeader.firstChild.innerText = '';
        finReceberHeader.children[2].setAttribute('hidden', '');

        let checkboxes = document.querySelectorAll('.checkbox-f');

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
                    alterarParcelaButton.disabled = false;
                    excluirParcelaButton.disabled = false;
                    target.classList.add('selected-row');
                    for (let child of target.children) {
                        child.classList.add('selected');
                    }
                }

                let index = target.getAttribute('index');

                altParcelaCodigo.innerText = target.id;
                altParcelaNomePessoa.innerText = contasReceber.data[index].pessoa;
                altParcelaPessoaRef.value = contasReceber.data[index].pessoa_ref;
                altParcelaValor.value = contasReceber.data[index].valor;
                altParcelaFormaPgto.value = contasReceber.data[index].forma_pgto;

                if (contasReceber.data[index].quitada == 'sim') {
                    altParcelaQuitadaNao.removeAttribute('checked');
                    altParcelaQuitadaSim.setAttribute('checked', true);
                }

                else if (contasReceber.data[index].quitada == 'não') {
                    altParcelaQuitadaSim.removeAttribute('checked');
                    altParcelaQuitadaNao.setAttribute('checked', true);
                }

            });
        });      

        const tableRow = document.querySelectorAll('.tr-f');
        tableRow.forEach((tableRow) => {
            tableRow.children[2].setAttribute('hidden', '');
        });
    }

    catch (error) {
        console.log(error);
    };
};

// leva ao servidor as informações do formulario de cadastro de nova pessoa
async function newFinParcela() {
    try {
        let newParcela = {
            'pessoa': newParcelaPessoaRef.value,
            'valor': parseFloat(newParcelaValor.value),
            'forma_pgto': newParcelaFormaPgto.value,
            'quitada': '',
        };

        if (newParcelaQuitadaSim.checked) newParcela.quitada = true;
        else if (newParcelaQuitadaNao.checked) newParcela.quitada = false;

        await axios({
            method: 'POST',
            url: URL_BASE + '/newFinParcela',
            data: JSON.stringify(newParcela),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        newParcelaClose.click();
        finReceberHeader.innerHTML = '';
        finReceberBody.innerHTML = '';
        getContasReceber();

        newParcelaPessoaRef.value = '';
        newParcelaValor.value = '';
        newParcelaFormaPgto.value = '';

    }
    catch (error) {
        console.log(error);
    }
}

// leva ao servidor as informações do formulario de alteração da parcela
async function altFinParcela() {
    try {
        let altParcelaData = {
            'codigo': altParcelaCodigo.innerText,
            'pessoa': altParcelaPessoaRef.value,
            'valor': parseFloat(altParcelaValor.value),
            'forma_pgto': altParcelaFormaPgto.value,
            'quitada': '',
        };

        if (altParcelaQuitadaSim.checked) altParcelaData.quitada = true;
        else if (altParcelaQuitadaNao.checked) altParcelaData.quitada = false;

        const selectedRow = document.querySelector('.selected-row');
        if (selectedRow != null) {
            let codigo = selectedRow.querySelector('.codigo').innerText;
            altParcelaData.codigo = codigo;
        }
        await axios({
            method: 'PUT',
            url: URL_BASE + '/altFinParcela',
            data: JSON.stringify(altParcelaData),
        });

        altParcelaClose.click();
        finReceberHeader.innerHTML = '';
        finReceberBody.innerHTML = '';
        getContasReceber();

    }
    catch (error) {
        console.log(error);
    }
}

let delParcelaData = {
    'codigo': altParcelaCodigo.innerText,
};


// leva ao servidor a informação de exclusão de um cadastro
async function delFinParcela() {
    try {
        const selectedRow = document.querySelector('.selected-row');

        let delParcelaData = {
            'codigo': altParcelaCodigo.innerText,
        };

        if (selectedRow != null) {
            let codigo = selectedRow.querySelector('.codigo').innerText;
            delParcelaData.codigo = codigo;
        }
        await axios({
            method: 'DELETE',
            url: URL_BASE + '/delFinParcela',
            data: JSON.stringify(delParcelaData),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        delParcelaClose.click();
        finReceberHeader.innerHTML = '';
        finReceberBody.innerHTML = '';
        getContasReceber();

    }
    catch (error) {
        console.log(error);
    }
}

// configura eventos de clique para confirmação da ação (incluir, alterar e excluir)
const parcelasTab = document.getElementById('fin-contas-tab');
const parcelasContent = document.getElementById('fin-contas-cont');
const closeParcelasContent = document.querySelector('.tab-parcelas-closer');

const btAltParcela = document.getElementById('alterar-parcela');
const altParcelaClose = document.getElementById('alt-parcela-close');

btAltParcela.addEventListener('click', (e) => {
    e.preventDefault();
    altFinParcela();

});

const btDelParcela = document.getElementById('confirma-exclusao-parcela');
const delParcelaClose = document.getElementById('del-parcela-close');

btDelParcela.addEventListener('click', (e) => {
    e.preventDefault();
    delFinParcela();
});

const newParcelaClose = document.getElementById('new-parcela-close');
const newParcelaIncluir = document.getElementById('new-parcela-incluir');

newParcelaIncluir.addEventListener('click', (e) => {
    e.preventDefault();
    newFinParcela();
});

const filtrosReceitasConfirma = document.getElementById('filtros-receitas-confirma');
const filtrosReceitasClose = document.getElementById('fin-receitas-filtros-close');

filtrosReceitasConfirma.addEventListener('click', () => {
    filtrosReceitasClose.click();
    finReceberTab.click();
});

finReceberTab.addEventListener('click', () => {
    getContasReceber();
});
