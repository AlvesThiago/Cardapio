const cartBtn = document.getElementById('cart-btn');
const modal = document.getElementById('modal');
const fecharModal = document.getElementById('close');
const botaoAdd = document.getElementById('btn-buy');
const menu = document.getElementById('menu');
const modalContainer = document.querySelector('.modal__list');
const cartTotal = document.getElementById('cart-total');
const cartCounter = document.getElementById('cart-counter');


let cart = [];


document.addEventListener('DOMContentLoaded', function(){
    const buttons = document.querySelectorAll('[data-tab-button]');

    // produtos 
    for(let i=0; i < buttons.length; i++){
        buttons[i].addEventListener('click', function(botao){
            const abaAlvo = botao.target.dataset.tabButton;
            const aba = document.querySelector(`[data-tab-id=${abaAlvo}]`)
            esconderTodasAbas();
            aba.classList.add('shows__list--is-active');
            removerButtonAtivo();
            botao.target.classList.add('btn--is-active')
        });
    };

    // abrir modal 
    cartBtn.addEventListener('click', function(){
        updateCartModal();
        modal.style.display = "flex";
        
    });    

    // fechar modal apertando no X 
    fecharModal.addEventListener('click', function(){
        modal.style.display = "none";
    });

    // fechar modal apertando na parte de fora
    modal.addEventListener('click', function(event){
        if(event.target === modal){
            modal.style.display = "none";
        };   
    });

    // Adicionar item ao carrinho
    menu.addEventListener('click', function(event){
        let parentButton = event.target.closest('#btn-buy');

        if(parentButton){
            const name = parentButton.getAttribute("data-name");
            const price = parseFloat(parentButton.getAttribute("data-price"));

            addToCart(name, price);
        };
    });


    // Remover item do carrinho
    modalContainer.addEventListener('click', function(event) {
        if (event.target.closest('.remove-from-cart-btn')) {
            const button = event.target.closest('.remove-from-cart-btn');
            const name = button.getAttribute('data-name');
            removeItemCart(name);
        }
    });

});


function esconderTodasAbas(){
    const tabContainer = document.querySelectorAll('[data-tab-id]');

    for(let i= 0; i < tabContainer.length; i++){
        tabContainer[i].classList.remove('shows__list--is-active');
    }
};

function removerButtonAtivo(){
    const buttons = document.querySelectorAll('[data-tab-button]');

    for(let i=0; i < buttons.length; i++){
        buttons[i].classList.remove('btn--is-active');
    }
};


function addToCart(name, price){
    const existingItem = cart.find(item => item.name === name)

    if (existingItem) {
        existingItem.quantity += 1;
    }else{
        cart.push({
            name,
            price,
            quantity: 1,
        })
    }

    Toastify({
        text: "Produto adicionado",
        duration: 3000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "#65B741",
        },
    }).showToast();  

    updateCartModal();

}

function updateCartModal(){
    modalContainer.innerHTML = "";

    let total = 0;

    cart.forEach(item => {
        const modalItemElement = document.createElement('li');

        modalItemElement.innerHTML = `
            <li class="modal__list__item">
                <div class="modal__list__item__itens">
                    <div>
                        <img src="dist/img/hamb-1.png" alt="">
                    </div>
                    <div>
                        <p>${item.name}</p>
                        <p>Qtd: ${item.quantity}</p>
                        <p>R$ ${item.price.toFixed(2)}</p>
                    </div>
                </div>
                <div class="modal__list__delete">
                    <button class="remove-from-cart-btn" data-name="${item.name}">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </li>     
        `   
        total += item.price * item.quantity;

        modalContainer.appendChild(modalItemElement);
        
    });

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    }); 

    cartCounter.innerHTML = cart.length;
}


function removeItemCart(name) {
    const index = cart.findIndex(item => item.name === name);

    if (index !== -1) {
        const item = cart[index];

        if (item.quantity > 1) {
            item.quantity -= 1;
            updateCartModal();
            return;
        }
    }

    cart.splice(index, 1);
    updateCartModal();
}


