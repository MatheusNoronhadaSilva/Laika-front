'use strict'

const url = 'https://laika-back.onrender.com'
const versao = '/v1'

const tBody = document.querySelector('tbody')
const lixeira = document.getElementById('lixeira')

lixeira.addEventListener('click', async function() {
    // Seleciona todos os checkboxes que estão marcados
    const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    
    // Cria um array para armazenar os IDs dos produtos selecionados
    const selectedIds = [];
    
    // Itera sobre os checkboxes marcados e coleta os IDs
    checkboxes.forEach(checkbox => {
        selectedIds.push(checkbox.getAttribute('data-id'));
    });
    
    // Exibe os IDs dos produtos selecionados (apenas para verificação)
    console.log('IDs dos produtos selecionados para exclusão:', selectedIds);
    
    // Chama a função para excluir os produtos do servidor e do DOM

    for (const id of selectedIds) {
        await deleteSelectedFuncionarios(id);
    }

    window.location.reload()
});

async function contarAgendamentosHoje(id){

    const agendamentos = await agendamentosFuncionario(id)
    const dataAtual = getDataAtual()
    let contador = 0

    agendamentos.forEach(agendamento => {

        console.log(agendamento.data_agendamento.substring(0 , 10));


        const dataAgendamentoDate = new Date(agendamento.data_agendamento)
        dataAgendamentoDate.setDate(dataAgendamentoDate.getDate() + 1);

        console.log('agendamento: ' + dataAgendamentoDate + ' data atual: ' + dataAtual);
        
        if(saoMesmaData(dataAgendamentoDate, dataAtual)){
            contador = contador + 1
        }
    });

    console.log(contador);

    if(contador > 0){
        return contador
    } else {
        return "sem agendamentos para hoje"
    }
}

function saoMesmaData(data1, data2) {
    return (
        data1.getDate() === data2.getDate() &&
        data1.getMonth() === data2.getMonth() &&
        data1.getFullYear() === data2.getFullYear()
    );
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
async function agendamentosFuncionario(id){

    console.log('pegando');

    const endpoint = `${url}${versao}/laika/agendamentos/funcionario/${id}`;
    const funcionariosApi = await fetch(endpoint);
    const listFuncionarios = await funcionariosApi.json();
    return listFuncionarios.dados;

}

async function CreateTblRow(){

    const allFuncionarios = await getAllFuncionarios()

    console.log(allFuncionarios);

    allFuncionarios.forEach(async function(funcionario) {

        console.log(funcionario);

        const tr = document.createElement('tr')
        tr.classList.add('text-black', 'h-1/6', 'flex', 'flex-row', 'items-center', 'w-item', 'space-x-1')
        tr.innerHTML = `
        <th class="w-id h-full bg-white flex justify-center items-center">
            <input class="h-2/3 w-2/3" type="checkbox" data-id = ${funcionario.id}>
        </th>
        <th class="w-id bg-white flex justify-center items-center h-full">${funcionario.id}</th>
        <th class="w-nome bg-white flex justify-center items-center h-full">${funcionario.nome}</th>
        <th class="w-1/6 bg-white flex justify-center items-center h-full">${funcionario.cargos && funcionario.cargos.length > 0 ? getAllCargosFuncionario(funcionario.cargos) : 'não possui cargo'}</th>
        <th class="w-1/5 bg-white flex justify-center items-center h-full">${funcionario.email}</th>
        <th class="w-numero bg-white flex justify-center items-center h-full rounded-r-lg">${funcionario.total_agendamentos > 0 ? await contarAgendamentosHoje(funcionario.id) :  "Nunca teve um agendamento"}</th>`

        tr.addEventListener('click', function (event) {
            // Verifica se o elemento clicado não é o <th> com o input
            if (!event.target.closest('th > input')) {

                window.location.href='../editar funcionario/editar_funcionario.html?id='+funcionario.id
            }
        });

        tBody.appendChild(tr)
    });
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


function getAllCargosFuncionario(cargos){

    const nomesCargos = []

    cargos.forEach(cargo => {
        
        nomesCargos.push(cargo.nome)
    });

    const nomesString = nomesCargos.join(', ');

    return nomesString
}

async function getAllFuncionarios() {

    console.log('pegando');

    const endpoint = `${url}${versao}/laika/funcionarios`;
    const funcionariosApi = await fetch(endpoint);
    const listFuncionarios = await funcionariosApi.json();
    return listFuncionarios.dados;
}

async function deleteSelectedFuncionarios(id){


    const endpoint = `${url}${versao}/laika/funcionario/${id}`

    console.log(endpoint);
try {
    const response = await fetch(endpoint, {
        method: 'DELETE'
    });

    if (response.ok) {
        console.log(`Funcionario com ID ${id} deletado com sucesso.`);
    } else {
        console.error(`Erro ao deletar funcionario com ID ${id}.`);
    }
} catch (error) {
    console.error('Ocorreu um erro durante a solicitação:', error);
}

// window.location.reload()
}

CreateTblRow()