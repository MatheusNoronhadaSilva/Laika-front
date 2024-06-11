'use strict'

const url = 'https://laika-back.onrender.com'
const versao = '/v1'

const tBody = document.querySelector('tbody')
const lixeira = document.getElementById('lixeira')
const telaPreta = document.getElementById('telaEscura')

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

// window.location.reload()
}



async function CreateTblRow(){

    const allServices = await GetAllAgendamentos()

    console.log(allServices);

    allServices.forEach(service => {

        console.log(service);

        const tr = document.createElement('tr')
        tr.classList.add('text-black', 'h-1/6', 'flex', 'flex-row', 'items-center', 'w-item', 'space-x-1')
        tr.innerHTML = `
        <th class="w-id h-full bg-white flex justify-center items-center">
            <input class="h-2/3 w-2/3" type="checkbox" data-id=${service.id}>
        </th>
        <th class="w-id bg-white flex justify-center items-center h-full clickable">${service.id}</th>
        <th id="data" class="w-1/6 bg-white flex justify-center items-center h-full clickable">${arrumarData(service.data_agendamento)}</th>
        <th class="w-1/4 bg-white flex justify-center items-center h-full clickable">${!service.funcionarios && service.funcionarios.length > 0 ? getServicoFuncionarios(service.funcionarios) : 'não possui funcionários'}</th>
        <th class="w-1/6 bg-white flex justify-center items-center h-full clickable">${getServicos(service.servicos)}</th>
        <th class="w-numero bg-white flex justify-center items-center h-full rounded-r-lg clickable">${service.animal.nome}</th>`

        tr.addEventListener('click', function (event) {
            // Verifica se o elemento clicado não é o <th> com o input
            if (!event.target.closest('th > input')) {

                console.log(`Row clicked for service ID: ${service.id}`);

                telaPreta.classList.remove('hidden')

                const dataAnterior = tr.querySelector('#data');
                if (dataAnterior) {
                    console.log(dataAnterior.textContent);
                }

                document.getElementById('dataAnterior').textContent = dataAnterior.textContent

                document.getElementById('editarData').addEventListener('click', async function(){

                    const dataReagendada = document.getElementById('dataReagendada').value

                    console.log('data reagendada: ' + dataReagendada);
                    //2024-06-03

                    const dataReagendadaDate = new Date(dataReagendada + 'T00:00:00')
                    const dataAnteriorDate = new Date(formatarDataAnterior(dataAnterior.textContent))

                    console.log(dataAnteriorDate);
                    console.log(dataReagendadaDate);
                    //2024-06-02

                    if(dataReagendadaDate < dataAnteriorDate){
                        alert('deve ser uma data posterior a data anterior')
                    } else {
                        const dataEditada = pegarAnoMesDia(dataReagendadaDate)

                        console.log(dataEditada, service.id);

                        await editarData(dataEditada, service.id)

                        window.location.reload()
                    }
                })

                document.getElementById('voltarEdicao').addEventListener('click', function(){

                    telaPreta.classList.add('hidden')
                })
            }
        });

        tBody.appendChild(tr)

    });
}

function pegarAnoMesDia(data){

    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
}

const formatarDataAnterior = (data) => {

    console.log(data);

    if (typeof data !== 'string') {
        console.log('Data não é uma string:', data);
        return 'Invalid Date';
    }
    const [dia, mes, ano] = data.split('/');
    return `${ano}/${mes}/${dia}`;
};

const arrumarData = (data) => {

    console.log(data);

    if (typeof data !== 'string') {
        console.log('Data não é uma string:', data);
        return 'Invalid Date';
    }
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
};

function getServicoFuncionarios (funcionarios){

    console.log('funcionários: ' + funcionarios);

    const nomesFuncionarios = []

    funcionarios.forEach(funcionario => {
        

        nomesFuncionarios.push(funcionario.nome)
    });

    const nomesString = nomesFuncionarios.join(', ');

    return nomesString

}

function getServicos (servicos){

    const nomesServicos = []

    servicos.forEach(servico => {
        
        nomesServicos.push(servico.nome)
    });

    const nomesString = nomesServicos.join(', ');

    return nomesString

}



async function GetAllAgendamentos(){

    console.log('iooio');

    const endpoint = `${url}${versao}/laika/agendamentos`;

    console.log(endpoint);
    const serviceApi = await fetch(endpoint);
    const listServices = await serviceApi.json();

    console.log(listServices);
    return listServices.dados;
}

async function editarData(data, id){

    console.log('editar: ' + id + ' com data: ' + data);

    const dataJSON = {
        data_agendamento: data
    }

    const endpoint = `${url}${versao}/laika/agendamento/${id}`
    
    const options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataJSON),
    };

    try {
        const response = await fetch(endpoint, options);
        return response.ok;
      } catch (error) {
        console.error('Erro ao editar agendamento: ', error);
      }
}

CreateTblRow()