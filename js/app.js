const URL_BASE = 'http://127.0.0.1:5000';

const cadPessoasTable = document.getElementById('cad_pessoas_table');
const cadPessoasHeader = document.getElementById('cad_pessoas_header');
const newTableHeader = document.createElement('th');
const newTableRow = document.createElement('tr');
const newTableData = document.createElement('td');


async function getCadPessoas() {
    try {
        let cadPessoas = await axios.get(URL_BASE + '/getCadPessoas');
        
        cadPessoas.data.forEach(row => {
            for (let key in row) {
                // console.log(key, row[key]);

            }
        });
        
    }
    catch (error) {
        console.log(error);
    };
};

getCadPessoas();