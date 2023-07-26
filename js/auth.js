const URL_BASE = 'http://127.0.0.1:5000';

const criarContaForm = document.getElementById('criar_conta_form');
const criarContaClose = document.getElementById('criar-conta-close');
const loginForm = document.getElementById('login');
const loginFailed = document.getElementById('login-failed');

criarContaForm.addEventListener('submit', () => {
    createNewClient();
});

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    authenticate();
});

async function createNewClient() {
    try {

        let criarContaEmail = document.getElementById('criar_conta_email');
        let criarContaSenha = document.getElementById('criar_conta_senha');

        let newClient = {
            'user_email': criarContaEmail.value,
            'user_password': criarContaSenha.value
        };

        await axios({
            method: 'POST',
            url: URL_BASE + '/client',
            data: JSON.stringify(newClient),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        criarContaClose.click;
        criarContaEmail.value = '';
        criarContaSenha.value = '';
    }
    catch (error) {
        console.log(error);
    }
}

async function authenticate() {
    try {

        const containerPrincipal = document.getElementById('container-principal');
        const containerLogin = document.getElementById('container-login');

        let userEmail = document.getElementById('login_email');
        let userPassword = document.getElementById('login_password');

        let client = {
            'user_email': userEmail.value,
            'user_password': userPassword.value
        };

        let auth = await axios({
            method: 'POST',
            url: URL_BASE + '/auth',
            data: JSON.stringify(client),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        userEmail.value = '';
        userPassword.value = '';

        if (Object.keys(auth.data).length == 2) {
            containerPrincipal.classList.remove('login-toggle');
            containerLogin.classList.add('login-toggle');
        }
        else {
            loginFailed.innerText = 'Erro ao efetuar login: email e senha incorretos.';
        }
    }
    catch (error) {
        console.log(error);
    }
}


let routes = {};
let templates = {};

function route(path, template) {
    if (typeof template === 'function') {
        return routes[path] = template;
    }
    else if (typeof template === 'string') {
        return routes[path] = templates[template];
    }
    else return;
}

function template(name, templateFunction) {
    return templates[name] = templateFunction;
}

// completar aqui

function resolveRoute(route) {
    try {
        return routes[route];
    }
    catch (error) {
        throw new Error(`Route ${route} not found`);
    }
}

function router(event) {
    let url = window.location.hash.slice(1) || '/';
    let route = resolveRoute(url);

    route();
}

// completar aqui tbm