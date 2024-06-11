'use strict'


const url = 'https://laika-back.onrender.com'
const versao = '/v1'

let visivel = false
document.getElementById('olho').addEventListener('click', function(){
    if(visivel){
        document.getElementById('senha').setAttribute('type', 'password')
        document.getElementById('olho').src = 'https://www.svgrepo.com/show/524041/eye-closed.svg'
        visivel = false
    } else {
        document.getElementById('senha').setAttribute('type', 'text')
        document.getElementById('olho').src = 'https://www.svgrepo.com/show/522847/eye.svg'
        visivel = true
    }
})

async function getAllFuncionarios() {

    console.log('pegando');

    const endpoint = `${url}${versao}/laika/funcionarios`;
    const funcionariosApi = await fetch(endpoint);
    const listFuncionarios = await funcionariosApi.json();
    return listFuncionarios.dados;
}


document.getElementById('logar').addEventListener('click', async function(){
    const email = document.getElementById('email').value
    const senha = document.getElementById('senha').value
    const allFuncionarios = await getAllFuncionarios()
    const errorMessage = document.getElementById('errorMessage')

    let naoLogou = false

    console.log(allFuncionarios);

    allFuncionarios.forEach(funcionario => {

        if(funcionario.email == email && funcionario.senha == senha){

            console.log(funcionario);
            
            funcionario.cargos.forEach(cargo => {

                console.log(cargo);

                if(cargo.id == 1){
                    window.location.href = `./tela veterinario/tela_veterinario.html?id=${funcionario.id}`
                } else if (cargo.id == 7){
                    window.location.href = `./administração (ADM)/administração_ADM.html?nome=${funcionario.nome}`
                } else {
                    window.location.href = `./administração (funcionário)/administração_funcionário.html?nome=${funcionario.nome}`
                }
                
            });
        } else {    
            naoLogou = true
        }
    });

    if(naoLogou){
        
        errorMessage.classList.remove('hidden')

        setTimeout(function () {
            errorMessage.classList.add('hidden');
        }, 3000);
    }
})