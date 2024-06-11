'use strict'

const url = 'https://laika-back.onrender.com'
const versao = '/v1'

const idFuncionarioAtual = new URLSearchParams(window.location.search).get('id')

colocarValues()
async function validacaoFuncionario() {
    console.log('pegando');
    const dadosFuncionario = await getFuncionarioById(idFuncionarioAtual)
    return dadosFuncionario
}

document.getElementById('telaEditarInicial').addEventListener('click', function () {
    window.location.href = '../editar funcionario/editar_funcionario.html?id=' + idFuncionarioAtual
})

const telaInfo1 = document.getElementById('telaInfo1')
const criarConta2 = document.getElementById('criarConta2')
const telaInfo2 = document.getElementById('telaInfo2')

const nome = document.getElementById('nome')
const sobrenome = document.getElementById('sobrenome')
const email = document.getElementById('email')
const senha = document.getElementById('senha')
const telefone = document.getElementById('telefone')

const rua = document.getElementById('rua')
const cidade = document.getElementById('cidade')
const estado = document.getElementById('estado')
const bairro = document.getElementById('bairro')

async function colocarValues() {
    const dadosFuncionario = await validacaoFuncionario()
    console.log(dadosFuncionario);

    if (dadosFuncionario.nome.includes(" ")) {
        const nome_sobrenome = dadosFuncionario.nome.split(" ");
        console.log(nome_sobrenome);
        nome.value = nome_sobrenome[0]
        sobrenome.value = nome_sobrenome[1]
    } else {
        nome.value = dadosFuncionario.nome
    }

    email.value = dadosFuncionario.email
    senha.value = dadosFuncionario.senha
    telefone.value = dadosFuncionario.telefone

    rua.value = dadosFuncionario.endereco.rua
    cidade.value = dadosFuncionario.endereco.cidade
    estado.value = dadosFuncionario.endereco.estado
    bairro.value = dadosFuncionario.endereco.bairro
}

function getInfo1() {
    console.log('iiii');

    const nomeValor = document.getElementById('nome').value
    const sobrenomeValor = document.getElementById('sobrenome').value
    const emailValor = document.getElementById('email').value
    const senhaValor = document.getElementById('senha').value
    const telefoneValor = document.getElementById('telefone').value

    const telefoneNumero = parseInt(telefoneValor)

    console.log(nomeValor);

    if (nomeValor == '') {
        const errorNome = document.getElementById('errorNome')
        errorNome.classList.remove('hidden')

        setTimeout(function () {
            errorNome.classList.add('hidden');
        }, 3000);
    } else if (emailValor == '') {
        const errorEmail = document.getElementById('errorEmail')
        errorEmail.classList.remove('hidden')

        setTimeout(function () {
            errorEmail.classList.add('hidden');
        }, 3000);
    } else if (senhaValor == '') {
        const errorSenha = document.getElementById('errorSenha')
        errorSenha.classList.remove('hidden')

        setTimeout(function () {
            errorSenha.classList.add('hidden');
        }, 3000);
    } else if (telefoneNumero === '') {
        const errorTelefone = document.getElementById('errorTelefone')
        errorTelefone.classList.remove('hidden')

        setTimeout(function () {
            errorTelefone.classList.add('hidden');
        }, 3000);
    } else {
        const nomeCompleto = `${nomeValor} ${sobrenomeValor}`
        console.log(nomeCompleto);
        telaInfo1.classList.add('hidden')
        telaInfo2.classList.remove('hidden')

        criarCargos()
        preSelecionarCargos()

        criarConta2.addEventListener('click', function () {
            const ruaValor = document.getElementById('rua').value
            const cidadeValor = document.getElementById('cidade').value
            const estadoValor = document.getElementById('estado').value
            const bairroValor = document.getElementById('bairro').value

            const cargos = cargosSelecionados()
            console.log(cargos);

            if (ruaValor == '') {
                const errorRua = document.getElementById('errorRua')
                errorRua.classList.remove('hidden')

                setTimeout(function () {
                    errorRua.classList.add('hidden');
                }, 3000);
            } else if (cidadeValor == '') {
                const errorCidade = document.getElementById('errorCidade')
                errorCidade.classList.remove('hidden')

                setTimeout(function () {
                    errorCidade.classList.add('hidden');
                }, 3000);
            } else if (estadoValor == '') {
                const errorEstado = document.getElementById('errorEstado')
                errorEstado.classList.remove('hidden')

                setTimeout(function () {
                    errorEstado.classList.add('hidden');
                }, 3000);
            } else if (bairroValor == '') {
                const errorBairro = document.getElementById('errorBairro')
                errorBairro.classList.remove('hidden')

                setTimeout(function () {
                    errorBairro.classList.add('hidden');
                }, 3000);
            } else {
                const FuncionarioEditadoJSON = {
                    nome: nomeCompleto,
                    telefone: telefoneValor,
                    email: emailValor,
                    senha: senhaValor,
                    img: null,
                    endereco: {
                        rua: ruaValor,
                        bairro: bairroValor,
                        cidade: cidadeValor,
                        estado: estadoValor,
                        complemento: ""
                    },
                    cargos: cargos
                }

                console.log(FuncionarioEditadoJSON);

                editarFuncionario(FuncionarioEditadoJSON, idFuncionarioAtual)
            }
        })
    }
}

function cargosSelecionados() {
    let selectedOptions = [];
    const checkboxes = document.querySelectorAll('#checkButton input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            selectedOptions.push(checkbox.value);
        }
    });
    return selectedOptions;
}

async function postarNovoFuncionario(funcionario) {
    console.log('enviar');

    const endpoint = `${url}${versao}/laika/funcionario`

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(funcionario),
    };

    try {
        const response = await fetch(endpoint, options);
        return response.ok;
    } catch (error) {
        console.error('Erro ao enviar funcionario: ', error);
    }
}

async function criarCargos() {
    const cargos = await pegarCargos()
    console.log(cargos);

    for (let i = 0; i < cargos.length; i++) {
        console.log(cargos[i]);

        const div = document.createElement('div')
        div.classList.add('flex', 'items-center', 'space-x-2')

        const input = document.createElement('input')
        input.type = "checkbox"
        input.id = `option${i}`
        console.log(input.id);
        input.value = cargos[i].id

        const span = document.createElement('span')
        span.textContent = cargos[i].nome

        div.replaceChildren(input, span)
        document.getElementById('checkButton').appendChild(div)

        // Adiciona o event listener a cada nova checkbox criada
        input.addEventListener('click', handleCheckboxClick);
    }
}

async function preSelecionarCargos() {
    const dadosFuncionario = await validacaoFuncionario()
    console.log(dadosFuncionario);

    dadosFuncionario.cargos.forEach(cargo => {
        for (let i = 0; i < 7; i++) {
            let checkbox = document.getElementById(`option${i}`);
            if (checkbox.value == cargo.id) {
                checkbox.checked = true
            }
        }
    });
}

async function pegarCargos() {
    const endpoint = `${url}${versao}/laika/cargos`;
    console.log(endpoint);
    const categoryApi = await fetch(endpoint);
    const listCategory = await categoryApi.json();
    return listCategory.dados;
}

async function getFuncionarioById(id) {
    const endpoint = `${url}${versao}/laika/funcionario/${id}`
    console.log(endpoint);
    const funcionario = await fetch(endpoint);
    const DadosFuncionario = await funcionario.json();
    console.log(DadosFuncionario);
    return DadosFuncionario.dados;
}

async function editarFuncionario(funcionarioEditado, id) {
    console.log('editar');
    const endpoint = `${url}${versao}/laika/funcionario/${id}`
    const options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(funcionarioEditado),
    };

    try {
        const response = await fetch(endpoint, options);
        return response.ok;
    } catch (error) {
        console.error('Erro ao editar funcionario: ', error);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    // Adiciona o event listener a todas as checkboxes
    const checkboxes = document.querySelectorAll('#checkButton input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('click', handleCheckboxClick);
    });
});

// Função para manipular o clique nas checkboxes
function handleCheckboxClick(event) {
    const checkboxValue1 = document.querySelector('input[type="checkbox"][value="1"]');
    if (event.target !== checkboxValue1 && checkboxValue1.checked) {
        event.target.checked = false; // Desmarca a checkbox clicada
    }
    toggleCheckboxes();
}

// Função para ativar/desativar as checkboxes
function toggleCheckboxes() {
    const checkboxValue1 = document.querySelector('input[type="checkbox"][value="1"]');
    const checkboxes = document.querySelectorAll('#checkButton input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        if (checkbox !== checkboxValue1) {
            checkbox.disabled = checkboxValue1.checked;
        }
    });
}
