'use strict'

const url = 'https://laika-back.onrender.com'
const versao = '/v1'

const tBody = document.querySelector('tbody')
const backAddProduct = document.getElementById('voltarTelaEscura')
const addProduct = document.getElementById('addProduto')
const blackScreen = document.getElementById('telaEscura')
const btnAddProduct = document.getElementById('btnAddProduct')
const btnEditProduct = document.getElementById('btnEditProduct')
const inserir_imagem = document.getElementById('urlImagem')
const divImagemProduto = document.getElementById('divImagemProduto')
const lixeira = document.getElementById('lixeira')
const editar = document.getElementById('editar')

const nome = document.getElementById('nome')
const descricao = document.getElementById('descricao')
const valor = document.getElementById('valor')
const quantidade = document.getElementById('quantidade')
const categoriaProduto = document.getElementById('categoriaProduto')
const urlImagem = document.getElementById('urlImagem')

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
        await deleteSelectedProducts(id);
        exclusao = true
    }
    if(exclusao){
        window.location.reload()
    }
});

async function deleteSelectedProducts(id){


    const endpoint = `${url}${versao}/laika/produto/${id}`

    console.log(endpoint);
try {
    const response = await fetch(endpoint, {
        method: 'DELETE'
    });

    if (response.ok) {
        console.log(`Produto com ID ${id} deletado com sucesso.`);
    } else {
        console.error(`Erro ao deletar produto com ID ${id}.`);
    }
} catch (error) {
    console.error('Ocorreu um erro durante a solicitação:', error);
}

}

inserir_imagem.addEventListener('keypress', function(event){

    if(event.key === "Enter") {
        console.log('aoeba');
        trocarimagem(inserir_imagem)
    }
})

addProduct.addEventListener('click', function(){

    console.log('aaaaaa');

    nome.value = ''
    descricao.value = ''
    valor.value = ''
    quantidade.value = ''
    categoriaProduto.value = ''
    urlImagem.value = '' 
    divImagemProduto.innerHTML = `
    <img class="h-2/3 w-2/3" src="../img/image-removebg-preview (8).png" alt="">
    `

    blackScreen.classList.remove('hidden')


    makeSelect()
})

function preSelecionarOpcao(id) {

    const selectElement = document.getElementById('categoriaProduto'); // Substitua 'seuSelectId' pelo id do seu elemento select

    for (let i = 0; i < selectElement.options.length; i++) {
        const option = selectElement.options[i];

        console.log('valor ' + option.value + ' id: ' + id);
        if (option.value == id) {
            option.selected = true; // Seleciona a opção com o valor desejado
            break;
        }
    }
}

async function makeSelect(){

    const categorias = await GetAllCategoryProduct()

    const select = document.getElementById('categoriaProduto')
    select.innerHTML = ''

    categorias.forEach(categoria => {
        
        const option = document.createElement('option')
        option.textContent = categoria.nome
        option.value = categoria.id

        select.appendChild(option)
    });
}

btnAddProduct.addEventListener('click', async function(){

    const nome = document.getElementById('nome').value
    const descricao = document.getElementById('descricao').value
    const valor = document.getElementById('valor').value
    const quantidade = document.getElementById('quantidade').value
    const categoriaProduto = document.getElementById('categoriaProduto').value
    const urlImagem = document.getElementById('urlImagem').value

    const categoriaNumero = parseInt(categoriaProduto)
    const valorNumero = parseFloat(valor);
    const quantidadeNumero = parseFloat(quantidade);

    if(nome == ''){

        const errorNome = document.getElementById('errorNome')
        errorNome.classList.remove('hidden')

        setTimeout(function() {
            errorNome.classList.add('hidden');
        }, 3000);
    }

    if(descricao == ''){

        const errorDescricao = document.getElementById('errorDescricao')
        errorDescricao.classList.remove('hidden')

        setTimeout(function() {
            errorDescricao.classList.add('hidden');
        }, 3000);
    }

    if(valor === ''){

        console.log('erroValor');

        const errorValor = document.getElementById('errorValorVazio')
        errorValor.classList.remove('hidden')

        setTimeout(function() {
            errorValor.classList.add('hidden');
        }, 3000);
    } else if (valor < 0 || valor > 999) {

        console.log('valor');

        const errorValor = document.getElementById('errorValorQuantidade')
        errorValor.classList.remove('hidden')

        setTimeout(function() {
            errorValor.classList.add('hidden');
        }, 3000);
    }

    console.log(quantidade);

    if(quantidade === ''){

        const errorQuantidade = document.getElementById('errorQuantidadeVazio')
        errorQuantidade.classList.remove('hidden')

        setTimeout(function() {
            errorQuantidade.classList.add('hidden');
        }, 3000);
    } else if (quantidade < 0 || quantidade > 999) {

        const errorQuantidade = document.getElementById('errorQuantidadeValor')
        errorQuantidade.classList.remove('hidden')

        setTimeout(function() {
            errorQuantidade.classList.add('hidden');
        }, 3000);
    }

    trocarimagem(inserir_imagem)


    const novoProdutoJSON = {
        nome: nome,
        descricao: descricao,
        preco: valorNumero,
        img: urlImagem,
        quantidade_estoque: quantidadeNumero,
        idCategoria: categoriaNumero
    }

    console.log(novoProdutoJSON);

    await PostProduct(novoProdutoJSON)

    // window.location.reload()

})

function trocarimagem(imagem) {
    divImagemProduto.innerHTML = ''
    const link = imagem.value

    function validarURL(String) {
        try {
            new URL(String)
            return true
        } catch (error) {
            console.log('link não enviado');

            divImagemProduto.innerHTML = ''
    
            const imagem = document.createElement('img')
            imagem.src = '../img/image-removebg-preview (8).png'
            imagem.classList.add('h-2/3', 'w-2/3')
    
            const errorLink = document.getElementById('errorLink')
            errorLink.classList.remove('hidden')
    
            setTimeout(function() {
                errorLink.classList.add('hidden');
            }, 3000);
    
            divImagemProduto.appendChild(imagem)

            return false
        }
    }
    if(validarURL(link)) {
        const imagem = document.createElement('img')
        imagem.src = link
        imagem.classList.add('h-2/3', 'w-2/3')

        divImagemProduto.appendChild(imagem)

        return link
    } else {
        return false
    }

}

backAddProduct.addEventListener('click', function(){

    blackScreen.classList.add('hidden')
    btnEditProduct.classList.add('hidden')
    btnAddProduct.classList.remove('hidden')
})

async function GetAllProducts(){

    console.log('iooio');

    const endpoint = `${url}${versao}/laika/produtos`;
    const productsApi = await fetch(endpoint);
    const listProducts = await productsApi.json();
    return listProducts.produtos;
}

async function GetAllCategoryProduct(){

    const endpoint = `${url}${versao}/laika/categorias`;

    console.log(endpoint);
    const categoryApi = await fetch(endpoint);
    const listCategory = await categoryApi.json();

    console.log(listCategory.dados);

    return listCategory.dados;
}

async function PostProduct(novoProdutoJSON){

    console.log(novoProdutoJSON);

    console.log('enviar');

    const endpoint = `${url}${versao}/laika/produto`
    
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(novoProdutoJSON),
    };

    try {
        const response = await fetch(endpoint, options);
        return response.ok;
      } catch (error) {
        console.error('Erro ao enviar produto: ', error);
      }
}

async function CreateTblRow(){

    
    const allProducts = await GetAllProducts()

    console.log(allProducts);

    allProducts.forEach(async function(product){

        console.log(product);

        const tr = document.createElement('tr')
        tr.classList.add('produto', 'text-black', 'h-1/6', 'flex', 'flex-row', 'items-center', 'w-item', 'space-x-1')

        tr.innerHTML = `
        <th class="w-id h-full bg-white flex justify-center items-center">
            <input class="h-2/3 w-2/3" type="checkbox" data-id=${product.id}>
        </th>
        <th class="w-id bg-white flex justify-center items-center h-full">${product.id}</th>
        <th class="w-nome bg-white flex justify-center items-center h-full">${product.nome}</th>
        <th class="w-1/6 bg-white flex justify-center items-center h-full">${product.categoria_id ? await getCategoryById(product.categoria_id) : 'não possui categoria'}</th>
        <th class="w-numero bg-white flex justify-center items-center h-full">${product.preco}</th>
        <th class="w-numero bg-white flex justify-center items-center h-full rounded-r-lg">${product.quantidade_estoque}</th>`

        tr.addEventListener('click', async function (event) {
            // Verifica se o elemento clicado não é o <th> com o input
            if (!event.target.closest('th > input')) {

                console.log(`Row clicked for service ID: ${product.id}`);

                blackScreen.classList.remove('hidden')
                btnAddProduct.classList.add('hidden')
                btnEditProduct.classList.remove('hidden')

                await makeSelect()

                nome.value = product.nome
                descricao.value = product.descricao
                valor.value = product.preco
                quantidade.value = product.quantidade_estoque
                urlImagem.value = product.img

                console.log(product.categoria_id);

                trocarimagem(urlImagem)
                preSelecionarOpcao(product.categoria_id)

                btnEditProduct.addEventListener('click', async function(){

                    const nome = document.getElementById('nome').value
                    const descricao = document.getElementById('descricao').value
                    const valor = document.getElementById('valor').value
                    const quantidade = document.getElementById('quantidade').value
                    const categoriaProduto = document.getElementById('categoriaProduto').value
                    const urlImagem = document.getElementById('urlImagem').value

                    const categoriaNumero = parseInt(categoriaProduto)
                    const valorNumero = parseFloat(valor);
                    const quantidadeNumero = parseFloat(quantidade);
                
                    if(nome == ''){
                
                        const errorNome = document.getElementById('errorNome')
                        errorNome.classList.remove('hidden')
                
                        setTimeout(function() {
                            errorNome.classList.add('hidden');
                        }, 3000);
                    }
                
                    if(descricao == ''){
                
                        const errorDescricao = document.getElementById('errorDescricao')
                        errorDescricao.classList.remove('hidden')
                
                        setTimeout(function() {
                            errorDescricao.classList.add('hidden');
                        }, 3000);
                    }
                
                    if(valorNumero === ''){
                
                        console.log('erroValor');
                
                        const errorValor = document.getElementById('errorValorVazio')
                        errorValor.classList.remove('hidden')
                
                        setTimeout(function() {
                            errorValor.classList.add('hidden');
                        }, 3000);
                    } else if (valor < 0 || valor > 999) {
                
                        console.log('valor');
                
                        const errorValor = document.getElementById('errorValorQuantidade')
                        errorValor.classList.remove('hidden')
                
                        setTimeout(function() {
                            errorValor.classList.add('hidden');
                        }, 3000);
                    }
                                
                    if(quantidadeNumero === ''){
                
                        const errorQuantidade = document.getElementById('errorQuantidadeVazio')
                        errorQuantidade.classList.remove('hidden')
                
                        setTimeout(function() {
                            errorQuantidade.classList.add('hidden');
                        }, 3000);
                    } else if (quantidadeNumero < 0 || quantidadeNumero > 999) {
                
                        const errorQuantidade = document.getElementById('errorQuantidadeValor')
                        errorQuantidade.classList.remove('hidden')
                
                        setTimeout(function() {
                            errorQuantidade.classList.add('hidden');
                        }, 3000);
                    }

                    const ProdutoEditadoJSON = {
                        nome: nome,
                        descricao: descricao,
                        preco: valorNumero,
                        img: urlImagem,
                        quantidade_estoque: quantidadeNumero,
                        idCategoria: categoriaNumero
                    }

                    await editProduct(ProdutoEditadoJSON, product.id)

                    window.location.reload()

                })
            }
        });

        tBody.appendChild(tr)
    });
}

async function getCategoryById(id){

    const endpoint = `${url}${versao}/laika/categoria/${id}`;
    console.log(endpoint);
    const categoryApi = await fetch(endpoint);
    const listCategory = await categoryApi.json();

    console.log(listCategory.dados.nome);

    return listCategory.dados.nome;
}

async function editProduct(produto, id){

    console.log('editando...');
    console.log('produto: ' +produto+ ' id: ' + id);

    const endpoint = `${url}${versao}/laika/produto/${id}`
    
    const options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(produto),
    };

    try {
        const response = await fetch(endpoint, options);
        return response.ok;
      } catch (error) {
        console.error('Erro ao editar produto: ', error);
      }

}
CreateTblRow()