const URL_BASE = 'http://127.0.0.1:5000';

// elementos da tabela de cad. pessoas
const cadPessoasHeader = document.getElementById('cad_pessoas_header');
const cadPessoasBody = document.getElementById('cad_pessoas_body');
const cadPessoasTab = document.getElementById('cad-pessoas-tab');

const newTableHeader = document.createElement('th');
newTableHeader.setAttribute('scope', 'col');

// cria novas linhas, celulas e checkboxes
const newTableRow = document.createElement('tr');
const newTableData = document.createElement('td');
const newCheckBox = document.createElement('input');
newCheckBox.setAttribute('type', 'radio');
newCheckBox.setAttribute('name', 'rowSelect');
newCheckBox.classList.add('checkbox-p');
newCheckBox.classList.add('mt-3');

// botões dentro do módulo cad. pessoas
const alterarPessoaButton = document.querySelector('#bt-alterar-pessoa');
const excluirPessoaButton = document.querySelector('#bt-excluir-pessoa');


// campos do formulário de inclusão de uma nova pessoa
let newPessoaNome = document.getElementById('incluir_pessoa_nome');
let newPessoaCpfCnpj = document.getElementById('incluir_pessoa_cpf_cnpj');
let newPessoaRgIe = document.getElementById('incluir_pessoa_rg_ie');
let newPessoaEmail = document.getElementById('incluir_pessoa_email');
let newPessoaTelefone1 = document.getElementById('incluir_pessoa_telefone1');
let newPessoaTelefone2 = document.getElementById('incluir_pessoa_telefone2');

//campos do formulário de alteração de cadastro de pessoa
let altPessoaCodigo = document.querySelector('.alt-pessoa-codigo');
let altPessoaNome = document.getElementById('alterar_pessoa_nome');
let altPessoaCpfCnpj = document.getElementById('alterar_pessoa_cpf_cnpj');
let altPessoaRgIe = document.getElementById('alterar_pessoa_rg_ie');
let altPessoaEmail = document.getElementById('alterar_pessoa_email');
let altPessoaTelefone1 = document.getElementById('alterar_pessoa_telefone1');
let altPessoaTelefone2 = document.getElementById('alterar_pessoa_telefone2');

//campos do formulário de aplicação dos filtros
let filtrosPessoaNome = document.getElementById('filtros_pessoa_nome');
let filtrosPessoaCpfCnpj = document.getElementById('filtros_pessoa_cpf_cnpj');
let filtrosPessoaRgIe = document.getElementById('filtros_pessoa_rg_ie');
let filtrosPessoaEmail = document.getElementById('filtros_pessoa_email');
let filtrosPessoaTelefone = document.getElementById('filtros_pessoa_telefone');

// transforma a palavra em Title Case
function toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
};

// remove caracteres especiais () - . /
function formatToNumberOnly(str) {
    if (str != '') {
        str = str.replace(/[^\d]/g, '');
        if (str.length < 14 && str.length > 3) {
            str = str.slice(0, 2) + ' ' + str.slice(2);
        }
        return str;
    }
}

// verifica se o CPF é valido ou não
function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf == '') return false;
    // Elimina CPFs invalidos conhecidos	
    if (cpf.length != 11 ||
        cpf == "00000000000" ||
        cpf == "11111111111" ||
        cpf == "22222222222" ||
        cpf == "33333333333" ||
        cpf == "44444444444" ||
        cpf == "55555555555" ||
        cpf == "66666666666" ||
        cpf == "77777777777" ||
        cpf == "88888888888" ||
        cpf == "99999999999")
        return false;
    // Valida 1o digito	
    let add = 0;
    for (let i = 0; i < 9; i++)
        add += parseInt(cpf.charAt(i)) * (10 - i);
    let rev = 11 - (add % 11);
    if (rev == 10 || rev == 11)
        rev = 0;
    if (rev != parseInt(cpf.charAt(9)))
        return false;
    // Valida 2o digito	
    add = 0;
    for (let i = 0; i < 10; i++)
        add += parseInt(cpf.charAt(i)) * (11 - i);
    rev = 11 - (add % 11);
    if (rev == 10 || rev == 11)
        rev = 0;
    if (rev != parseInt(cpf.charAt(10)))
        return false;
    return true;
}

// verifica se o CNPJ é valido ou não
function validarCNPJ(cnpj) {
    cnpj = cnpj.replace(/[^\d]+/g, '');
    if (cnpj == '') return false;
    if (cnpj.length != 14)
        return false;
    // Elimina CNPJs invalidos conhecidos
    if (cnpj == "00000000000000" ||
        cnpj == "11111111111111" ||
        cnpj == "22222222222222" ||
        cnpj == "33333333333333" ||
        cnpj == "44444444444444" ||
        cnpj == "55555555555555" ||
        cnpj == "66666666666666" ||
        cnpj == "77777777777777" ||
        cnpj == "88888888888888" ||
        cnpj == "99999999999999")
        return false;
    // Valida DVs
    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    let digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2)
            pos = 9;
    }
    let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(0))
        return false;

    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2)
            pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(1))
        return false;
    return true;
}

// traz do servidor os dados de cadastros
async function getCadPessoas() {
    try {
        cadPessoasHeader.innerHTML = '';
        cadPessoasBody.innerHTML = '';

        let params = {
            nome: filtrosPessoaNome.value,
            cpf_cnpj: filtrosPessoaCpfCnpj.value,
            rg_ie: filtrosPessoaRgIe.value,
            email: filtrosPessoaEmail.value,
            telefone: filtrosPessoaTelefone.value
        };

        let cadPessoas = await axios({
            method: 'GET',
            url: URL_BASE + '/getCadPessoas',
            params: params
        });

        let keys = [];
        let i = 0;

        // para cada linha existente no banco de dados irá criar uma linha com checkbox na tabela
        cadPessoas.data.forEach(row => {
            // gera um id para cada linha seguido o id dos registros do banco
            newTableRow.id = cadPessoas.data[i].codigo;
            newTableRow.className = 'tr-p';
            // adiciona atributo para seguir o índice dos registros do banco
            newTableRow.setAttribute('index', i);
            i++;

            cadPessoasBody.appendChild(newTableRow.cloneNode(true));
            cadPessoasBody.lastChild.appendChild(newCheckBox.cloneNode(true));

            // para cada registro na linha irá criar uma célula na tabela
            for (let key in row) {
                if (!keys.includes(key)) {
                    keys.push(key);
                }
                newTableData.className = 'td-p';
                // traz a informação contida no registro para a tabela
                newTableData.innerText = row[key];
                cadPessoasBody.lastChild.appendChild(newTableData.cloneNode(true));
                cadPessoasBody.lastChild.children[1].classList.add('codigo');
            };
        });

        // cria o cabeçalho da tabela conforme consta no banco de dados
        for (let key of keys) {
            newTableHeader.innerText = key;
            cadPessoasHeader.appendChild(newTableHeader.cloneNode(true));
        }

        let checkboxes = document.querySelectorAll('.checkbox-p');

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
                    alterarPessoaButton.disabled = false;
                    excluirPessoaButton.disabled = false;
                    target.classList.add('selected-row');
                    for (let child of target.children) {
                        child.classList.add('selected');
                    }
                }

                let index = target.getAttribute('index');

                altPessoaCodigo.innerText = target.id;
                altPessoaNome.value = cadPessoas.data[index].nome;
                altPessoaCpfCnpj.value = cadPessoas.data[index].cpf_cnpj;
                altPessoaRgIe.value = cadPessoas.data[index].rg_ie;
                altPessoaEmail.value = cadPessoas.data[index].email;
                altPessoaTelefone1.value = cadPessoas.data[index].telefone_1;
                altPessoaTelefone2.value = cadPessoas.data[index].telefone_2;
            });
        });

        // cria uma celula sem texto no cabeçalho, apenas para alinhar as colunas da tabela
        cadPessoasHeader.insertBefore(newTableHeader, cadPessoasHeader.firstChild);
        cadPessoasHeader.firstChild.innerText = '';
    }

    catch (error) {
        console.log(error);
    };
};

// envia ao servidor uma solicitação de consulta de CNPJ
async function consultaCNPJ() {

    const btConsultaCpfCnpj = document.getElementById('consulta_cnpj');
    const btTrazerDadosConsulta = document.getElementById('trazer_dados_consulta');
    const btResultadoConsultaVoltar = document.getElementById('consulta_voltar');
    const resultadoConsultaHeader = document.getElementById('consulta_header');
    const dadosConsultaCnpj = document.getElementById('dados_consulta_cnpj');

    try {
        if (validarCPF(newPessoaCpfCnpj.value) == true) {
            btResultadoConsultaVoltar.classList.remove('btn-danger');
            resultadoConsultaHeader.classList.remove('bg-danger');
            btResultadoConsultaVoltar.classList.add('btn-secondary');
            resultadoConsultaHeader.classList.add('bg-success');

            dadosConsultaCnpj.innerText = 'O CPF informado foi validado com sucesso.';
        }
        else if (validarCNPJ(newPessoaCpfCnpj.value) == true) {
 
            btResultadoConsultaVoltar.classList.remove('btn-danger');
            resultadoConsultaHeader.classList.remove('bg-danger');
            btResultadoConsultaVoltar.classList.add('btn-secondary');
            resultadoConsultaHeader.classList.add('bg-success');
            btTrazerDadosConsulta.removeAttribute('hidden');
            
            dadosConsultaCnpj.innerText = 'O CNPJ informado foi validado com sucesso. Deseja preencher os campos com os dados da empresa?';

            let params = {
                cnpj: newPessoaCpfCnpj.value
            };
            
            let resultadoConsulta = await axios({
                method: 'GET',
                url: URL_BASE + '/consultaCNPJ',
                params: params
            });
            
            let resultadoConsultaText = JSON.stringify(resultadoConsulta.data);
            
            btTrazerDadosConsulta.addEventListener('click', () => {
                if (resultadoConsultaText == '"Too many requests, please try again later."') {
                    dadosConsultaCnpj.innerHTML = '<b>[ERRO]</b> Você atingiu o número máximo de consultas. Tente novamente em um minuto.';
                }
                else {
                    newPessoaNome.value = toTitleCase(resultadoConsulta.data.nome);
                    newPessoaCpfCnpj.value = resultadoConsulta.data.cnpj;
                    newPessoaEmail.value = resultadoConsulta.data.email;
                    newPessoaTelefone1.value = formatToNumberOnly(resultadoConsulta.data.telefone);
                    btResultadoConsultaVoltar.click();
                }
            })
        }
        else {
            btResultadoConsultaVoltar.classList.remove('btn-success');
            resultadoConsultaHeader.classList.remove('bg-success');
            btResultadoConsultaVoltar.classList.add('btn-danger');
            resultadoConsultaHeader.classList.add('bg-danger');
            btConsultaCpfCnpj.click();
            dadosConsultaCnpj.innerHTML = '<b>[ERRO]</b> O valor informado não corresponde a nenhum CPF ou CNPJ válido.';
        }
    }

    catch (error) {
        console.log(error);
    }
}

// leva ao servidor as informações do formulario de cadastro de nova pessoa
async function newCadPessoa() {
    try {
        let newPessoa = {
            'nome': newPessoaNome.value,
            'cpf_cnpj': newPessoaCpfCnpj.value,
            'rg_ie': newPessoaRgIe.value,
            'email': newPessoaEmail.value,
            'telefone1': newPessoaTelefone1.value,
            'telefone2': newPessoaTelefone2.value,
        };

        await axios({
            method: 'POST',
            url: URL_BASE + '/newCadPessoa',
            data: JSON.stringify(newPessoa),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        newPessoaClose.click();
        cadPessoasHeader.innerHTML = '';
        cadPessoasBody.innerHTML = '';
        getCadPessoas();

        newPessoaNome.value = '';
        newPessoaCpfCnpj.value = '';
        newPessoaRgIe.value = '';
        newPessoaEmail.value = '';
        newPessoaTelefone1.value = '';
        newPessoaTelefone2.value = '';

    }
    catch (error) {
        console.log(error);
    }
}

// leva ao servidor as informações do formulario de alteração do cadastro
async function altCadPessoa() {
    try {
        let altPessoaData = {
            'codigo': altPessoaCodigo.innerText,
            'nome': altPessoaNome.value,
            'cpf_cnpj': altPessoaCpfCnpj.value,
            'rg_ie': altPessoaRgIe.value,
            'email': altPessoaEmail.value,
            'telefone1': altPessoaTelefone1.value,
            'telefone2': altPessoaTelefone2.value,
        };

        const selectedRow = document.querySelector('.selected-row');
        if (selectedRow != null) {
            let codigo = selectedRow.querySelector('.codigo').innerText;
            altPessoaData.codigo = codigo;
        }
        await axios({
            method: 'PUT',
            url: URL_BASE + '/altCadPessoa',
            data: JSON.stringify(altPessoaData),
        });

        altPessoaClose.click();
        cadPessoasHeader.innerHTML = '';
        cadPessoasBody.innerHTML = '';
        getCadPessoas();

    }
    catch (error) {
        console.log(error);
    }
}


// leva ao servidor a informação de exclusão de um cadastro
async function delCadPessoa() {
    try {
        const selectedRow = document.querySelector('.selected-row');

        let delPessoaData = {
            'codigo': altPessoaCodigo.innerText,
        };

        if (selectedRow != null) {
            let codigo = selectedRow.querySelector('.codigo').innerText;
            delPessoaData.codigo = codigo;
        }
        await axios({
            method: 'DELETE',
            url: URL_BASE + '/delCadPessoa',
            data: JSON.stringify(delPessoaData),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        delPessoaClose.click();
        cadPessoasHeader.innerHTML = '';
        cadPessoasBody.innerHTML = '';
        getCadPessoas();

    }
    catch (error) {
        console.log(error);
    }
}

// configura eventos de clique para confirmação da ação (incluir, alterar e excluir)
const pessoasTab = document.getElementById('cad-pessoas-tab');
const pessoasContent = document.getElementById('cad-pessoas-cont');
const closePessoasContent = document.querySelector('.tab-pessoas-closer');

const btAltPessoa = document.getElementById('alterar-pessoa');
const altPessoaClose = document.getElementById('alt-pessoa-close');

btAltPessoa.addEventListener('click', (e) => {
    e.preventDefault();
    altCadPessoa();
});

const btDelPessoa = document.getElementById('confirma-exclusao');
const delPessoaClose = document.getElementById('del-pessoa-close');

btDelPessoa.addEventListener('click', (e) => {
    e.preventDefault();
    delCadPessoa();
});

const newPessoaClose = document.getElementById('new-pessoa-close');
const newPessoaIncluir = document.getElementById('new-pessoa-incluir');
const btConsultaCnpj = document.getElementById('consulta_cnpj');

newPessoaIncluir.addEventListener('click', (e) => {
    e.preventDefault();
    newCadPessoa();
});

btConsultaCnpj.addEventListener('click', () => {
    consultaCNPJ();
});

const filtrosPessoasConfirma = document.getElementById('filtros-pessoas-confirma');
const filtrosPessoasClose = document.getElementById('cad-pessoas-filtros-close');

filtrosPessoasConfirma.addEventListener('click', () => {
    filtrosPessoasClose.click();
    cadPessoasTab.click();
});

cadPessoasTab.addEventListener('click', () => {
    getCadPessoas();
});