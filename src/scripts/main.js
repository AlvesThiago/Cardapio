const cartBtn = document.getElementById('cart-btn');
const modal = document.getElementById('modal');
const fecharModal = document.getElementById('close');
const botaoAdd = document.getElementById('btn-buy');
const menu = document.getElementById('menu');
const modalContainer = document.querySelector('.modal__list');
const cartTotal = document.getElementById('cart-total');
const cartCounter = document.getElementById('cart-counter');
const nameInput = document.getElementById('name-input');
const addressInput = document.getElementById('address');
const cepInput = document.getElementById('cep');
const checkoutBtn = document.getElementById('checkoutBtn');


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
            const imageUrl = parentButton.getAttribute("data-image-url");

            addToCart(name, price, imageUrl);
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

    //botão para finalizar o pedido
    checkoutBtn.addEventListener('click', function(){
        const isOpen = checkOpen();

        if(!isOpen){ 
            Toastify({
                text: "Ops, Estamos fechado no momento!",
                duration: 3000,
                close: true,
                gravity: "top", // `top` or `bottom`
                position: "center", // `left`, `center` or `right`
                stopOnFocus: true, // Prevents dismissing of toast on hover
                style: {
                  background: "#ef4444",
                },
            }).showToast(); 
            return;
        }

        if(cart.length === 0) return;

        if(addressInput.value === ""){
            addressInput.classList.add("modal__dados__form__input--invalido");
        } else{
            addressInput.classList.remove("modal__dados__form__input--invalido");
        }

        if(cepInput.value === ""){
            cepInput.classList.add("modal__dados__form__input--invalido");
        } else{
            cepInput.classList.remove("modal__dados__form__input--invalido");
        }

        // Calcular o total do valor de todos os produtos escolhidos
        const total = cart.reduce((acc, item) => {
        return acc + (item.price * item.quantity);
        }, 0);

        //Enviar para API do Whats

        const cartItems = cart.map((item) => {

        let precoTotal = item.price * item.quantity;

        return(
            `${item.name}\n` +
            `Quantidade: (${item.quantity})\n` +
            `Preço: R$${precoTotal.toFixed(2)}\n\n`
        );

        }) .join("");

        const totalMessage = `*Total: R$${total.toFixed(2)}*\n\n`;

        const nameInputValue = `Nome: ${nameInput.value} \n`;
        
        const endereco = `Endereço: ${addressInput.value}\n`;
        const cep = `CEP: ${cepInput.value}`;

        const message = encodeURIComponent(`${cartItems}${totalMessage}${nameInputValue}${endereco}${cep}`);

        const phone = "5511961916701";

        window.open(`https://wa.me/${phone}?text=${message}`);

        cart = [];
        updateCartModal();

    });

    checkOpen();

});






// Logica para troca de abas
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

//logica para adicionar um produto
function addToCart(name, price, imageUrl){
    const existingItem = cart.find(item => item.name === name)

    if (existingItem) {
        existingItem.quantity += 1;
    }else{
        cart.push({
            name,
            price,
            imageUrl,
            quantity: 1,
        })
    }

    Toastify({
        text: "Produto adicionado",
        duration: 3000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "center", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "#65B741",
        },
    }).showToast();  

    updateCartModal();
}





//atualizando o carrinho quando adiciona um produto
function updateCartModal(){
    modalContainer.innerHTML = "";

    let total = 0;

    cart.forEach(item => {
        const modalItemElement = document.createElement('li');

        modalItemElement.innerHTML = `
            <li class="modal__list__item">
                <div class="modal__list__item__itens">
                    <div>
                        <img src="${item.imageUrl}" alt="${item.name}">
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





// logica para remover um item do carrinho
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

// verificando se o restaurante está aberto
function checkOpen(){
    const data = new Date();
    const hora = data.getHours();
    const spanItem = document.getElementById('date-span');
    

    if(hora >= 18 && hora < 23){
        spanItem.classList.add('header__content__horario--is-open');
        
    } else {
        spanItem.classList.remove('header__content__horario--is-open');
        
    }
}


AOS.init();