'use strict'

const idVeterinarioAtual = new URLSearchParams(window.location.search).get('id')
const url = 'https://laika-back.onrender.com'
const versao = '/v1'
console.log(idVeterinarioAtual);

const tBody = document.querySelector('tbody')
const telaEscura = document.getElementById('telaEscura')

document.getElementById('voltarTelaEscura').addEventListener('click', function(){

    telaEscura.classList.add('hidden')
})

lixeira.addEventListener('click', async function() {

    const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    
    const selectedIds = [];
    
    checkboxes.forEach(checkbox => {
        selectedIds.push(checkbox.getAttribute('data-id'));
    });
    
    console.log('IDs dos produtos selecionados para exclusão:', selectedIds);
    
    let exclusao = false
    for (const id of selectedIds) {
        await deleteSelectedAgendamento(id);
        exclusao = true
    }
    if(exclusao){
        window.location.reload()
    }
});

async function deleteSelectedAgendamento(id){


    const endpoint = `${url}${versao}/laika/agendamento/${id}`

    console.log(endpoint);
try {
    const response = await fetch(endpoint, {
        method: 'DELETE'
    });

    if (response.ok) {
        console.log(`Agendamento com ID ${id} deletado com sucesso.`);
    } else {
        console.error(`Erro ao deletar agendamento com ID ${id}.`);
    }
} catch (error) {
    console.error('Ocorreu um erro durante a solicitação:', error);
}
}


async function validarAgendamento(){

    const dataAtual = getDataAtual()
    console.log(dataAtual);

    const agendamentos = await GetAllAgendamentos()
    const agendamentoVeterinario = []

    for(let i = 0; i < agendamentos.length; i ++){

        console.log(agendamentos[i].data_agendamento);
        const dataAgendamentoDate = new Date(agendamentos[i].data_agendamento + 'T00:00:00')
        console.log(dataAgendamentoDate)
        console.log(dataAtual);;

        if(saoMesmaData(dataAgendamentoDate, dataAtual)){
            
            const agendamentoFuncionarios = agendamentos[i].funcionarios

            if(agendamentoFuncionarios.length > 0) {
    
                agendamentoFuncionarios.forEach(funcionario => {
                    
                    if(funcionario.id == idVeterinarioAtual) {
    
                        agendamentoVeterinario.push(agendamentos[i])
                    }
                });
            }
        }
    }
    // agendamentos.forEach(agendamento => {
        

    // });

    console.log(agendamentoVeterinario);

    if(agendamentoVeterinario.length < 1){
        alert('este veterinário(a) não possui agendamentos')
    }

    createTblRow(agendamentoVeterinario)
}

function saoMesmaData(data1, data2) {
    return (
        data1.getDate() === data2.getDate() &&
        data1.getMonth() === data2.getMonth() &&
        data1.getFullYear() === data2.getFullYear()
    );
}

async function createTblRow(agendamentos){

    agendamentos.forEach(agendamento => {

        const tr = document.createElement('tr')
        tr.classList.add('text-black', 'h-1/6', 'flex', 'flex-row', 'items-center', 'w-item', 'space-x-1')

        tr.innerHTML = `
        <th class="w-id h-full bg-white flex justify-center items-center">
            <input class="h-2/3 w-2/3" type="checkbox" data-id=${agendamento.id}>
        </th>
        <th class="w-id bg-white flex justify-center items-center h-full">${agendamento.id}</th>
        <th class="w-1/6 bg-white flex justify-center items-center h-full">${arrumarData(agendamento.data_agendamento)}</th>
        <th class="w-1/4 bg-white flex justify-center items-center h-full">${agendamento.receita == null ? 'não possui receita' : mostrarPrimeiros100Caracteres(agendamento.receita)}...</th>
        <th class="w-1/6 bg-white flex justify-center items-center h-full">${agendamento.animal.nome}</th>`

        tBody.appendChild(tr)

        tr.addEventListener('click', async function (event) {
            // Verifica se o elemento clicado não é o <th> com o input
            if (!event.target.closest('th > input')) {

                console.log(`Row clicked for service ID: ${agendamento.id}`);

                telaEscura.classList.remove('hidden')

                document.getElementById('imagemAnimal').src = agendamento.animal.img
                document.getElementById('nomeDono').textContent = `${await pegarNomeDono(agendamento.animal.id)} -` 
                document.getElementById('nomeAnimal').textContent = agendamento.animal.nome
                const historico = document.getElementById('historico')
                historico.innerHTML = ''

                const agendamentosAnimal = await GetAllAgendamentosByAnimalId(agendamento.animal.id)
                console.log(agendamentosAnimal);

                agendamentosAnimal.forEach(agendamento => {

                    const div = document.createElement('div')
                    div.classList.add('flex-col', 'w-full', 'flex', 'b-azul-escuro', 'border-b-2', 'text-center', 'justify-center', 'items-center')

                    console.log('agendamento Animal: ' + agendamento.receita);

                    div.innerHTML = `
                    <span>${formatarData(agendamento.data_agendamento)}</span>
                    <span class="w-full">${agendamento.receita == null ? 'não há receita' : agendamento.receita}</span>`
                    
                    historico.appendChild(div)
                });

                document.getElementById('btnAddReceita').addEventListener('click', async function(){

                    const receita = document.getElementById('receita').value

                    const agendamentoEditadoJSON = {
                        data_agendamento: agendamento.data_agendamento,
                        receita: receita,
                    }

                    console.log(agendamentoEditadoJSON);

                    await postarReceita(agendamentoEditadoJSON, agendamento.id)

                    window.location.reload()

                })
            }
        });
    });
}

async function postarReceita(receita, id){

    console.log('editar');

    const endpoint = `${url}${versao}/laika/agendamento/${id}`
    const options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(receita),
    };

    try {
        const response = await fetch(endpoint, options);
        return response.ok;
    } catch (error) {
        console.error('Erro ao editar receita: ', error);
    }
}


async function pegarNomeDono(id){

    
    console.log('dono');

    const endpoint = `${url}${versao}/laika/animal/${id}`;

    console.log(endpoint);
    const serviceApi = await fetch(endpoint);
    const listServices = await serviceApi.json();

    console.log(listServices);

    return listServices.dados.dono.nome;
}

async function GetAllAgendamentos(){

    console.log('iooio');

    const endpoint = `${url}${versao}/laika/agendamentos`;

    console.log(endpoint);
    const serviceApi = await fetch(endpoint);
    const listServices = await serviceApi.json();

    return listServices.dados;
}

async function GetAllAgendamentosByAnimalId(id){

    console.log('animal');

    const endpoint = `${url}${versao}/laika/agendamentos/animal/${id}`;

    console.log(endpoint);
    const serviceApi = await fetch(endpoint);
    const listServices = await serviceApi.json();

    return listServices.dados;
}


function arrumarData(data){

    console.log(data);

    if (typeof data !== 'string') {
        console.log('Data não é uma string:', data);
        return 'Invalid Date';
    }
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;

}

function mostrarPrimeiros100Caracteres(str) {
    // Verifica se a string tem mais de 100 caracteres
    if (str.length > 50) {
        // Retorna os primeiros 100 caracteres
        return str.substring(0, 50);
    } else {
        // Retorna a string inteira se tiver 100 ou menos caracteres
        return str;
    }
}

function getDataAtual() {
    const hoje = new Date();
    const dia = hoje.getDate();
    const mes = hoje.getMonth(); // Meses são indexados a partir de 0
    const ano = hoje.getFullYear();

    // Cria uma nova data com hora zerada
    const dataSemHora = new Date(ano, mes, dia, 0, 0, 0, 0);
    
    return dataSemHora;
}

function formatarData(dataStr) {
    // Converte a string de data ISO 8601 para um objeto Date
    const data = new Date(dataStr);

    // Obtém o dia, mês e ano da data
    const dia = String(data.getUTCDate()).padStart(2, '0'); // Usa getUTCDate para garantir que o dia está correto em UTC
    const mes = String(data.getUTCMonth() + 1).padStart(2, '0'); // Usa getUTCMonth (janeiro é 0) e adiciona 1
    const ano = data.getUTCFullYear(); // Usa getUTCFullYear para o ano completo em UTC

    // Formata a data como dd-mm-yyyy
    const dataFormatada = `${dia}-${mes}-${ano}`;

    return dataFormatada;
}

validarAgendamento()
