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

// Manipular opções de entrega
const deliveryOption = document.getElementById('delivery-option');
const pickupOption = document.getElementById('pickup-option');

// Manipular opções de pagamento
const paymentCash = document.getElementById('payment-cash');
const trocoCheckbox = document.getElementById('troco-checkbox');
const trocoInput = document.getElementById('troco-input');
const paymentCard = document.getElementById('payment-card');
const paymentPix = document.getElementById('payment-pix');



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


        const deliveryOption = document.getElementById('delivery-option');
        const pickupOption = document.getElementById('pickup-option');
        const paymentCash = document.getElementById('payment-cash');
        const paymentCard = document.getElementById('payment-card');
        const paymentPix = document.getElementById('payment-pix');
        const trocoCheckbox = document.getElementById('troco-checkbox');
        const trocoInput = document.getElementById('troco-input');
    
        let error = false;
    
        // Validação de campos obrigatórios para entrega
        if (deliveryOption.checked) {
            if (addressInput.value === "") {
                addressInput.classList.add("modal__dados__form__entrega__input--invalido");
                error = true;
            } else {
                addressInput.classList.remove("modal__dados__form__entrega__input--invalido");
            }
    
            if (cepInput.value === "") {
                cepInput.classList.add("modal__dados__form__entrega__input--invalido");
                error = true;
            } else {
                cepInput.classList.remove("modal__dados__form__entrega__input--invalido");
            }
        }
    
        // Validação de formas de pagamento para retirada no local e delivery
    let paymentMethod = '';
    if (pickupOption.checked || deliveryOption.checked) {
        if (!paymentCash.checked && !paymentCard.checked && !paymentPix.checked) {
            Toastify({
                text: "Por favor, selecione uma forma de pagamento.",
                duration: 3000,
                close: true,
                gravity: "top",
                position: "center",
                stopOnFocus: true,
                style: {
                  background: "#ef4444",
                },
            }).showToast();
            error = true;
        } else {
            if (paymentCash.checked) paymentMethod = 'Dinheiro';
            if (paymentCard.checked) paymentMethod = 'Débito/Crédito';
            if (paymentPix.checked) paymentMethod = 'Pix';
        }
    }

        if (error) {
            Toastify({
                text: "Por favor, preencha todos os campos obrigatórios.",
                duration: 3000,
                close: true,
                gravity: "top",
                position: "center",
                stopOnFocus: true,
                style: {
                background: "#ef4444",
                },
            }).showToast();
            return;
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
        const endereco = deliveryOption.checked ? `Endereço: ${addressInput.value}\n` : '';
        const cep = deliveryOption.checked ? `CEP: ${cepInput.value}\n\n` : '';

        let trocoMessage = '';
        if (paymentCash.checked && trocoCheckbox.checked) {
            const trocoValue = trocoInput.value.trim();
            if (trocoValue) {
                trocoMessage = `Troco para: R$${parseFloat(trocoValue).toFixed(2)}\n\n`;
            }
        }

        const paymentMessage = paymentMethod ? `Forma de pagamento: ${paymentMethod}\n` : '';

        const message = encodeURIComponent(`${cartItems}${totalMessage}${nameInputValue}${endereco}${cep}${trocoMessage}${paymentMessage}`);
    
        const phone = "5511961916701";
        window.open(`https://wa.me/${phone}?text=${message}`);
    
        cart = [];
        updateCartModal();

    });

    // Se o cliente escolher delivery
    deliveryOption.addEventListener('change', function(){
        const tabEntrega = document.getElementById('tabEntrega');

        if(deliveryOption.checked){
            addressInput.required  = true;
            cepInput.required  = true;
            tabEntrega.classList.add('modal__dados__form__entrega--is-active');
        } else{
            tabEntrega.classList.remove('modal__dados__form__entrega--is-active');
        }
    });

    // Se o cliente escolher retirar no local
    pickupOption.addEventListener('change', function(){
        const tabEntrega = document.getElementById('tabEntrega');

        if(pickupOption.checked){
            addressInput.required  = false;
            cepInput.required  = false;
            tabEntrega.classList.remove('modal__dados__form__entrega--is-active');
        }
    });

    // Se o cliente escolher pagar no dinheiro
    paymentCash.addEventListener('change', function(){
        const tabTroco = document.getElementById('troco-container');

        if(paymentCash.checked){
            tabTroco.classList.add('modal__dados__form__troco--is-active');
        } 
    });

    // Se o cliente precisa de troco
    trocoCheckbox .addEventListener('change', function(){
        const inputTroco = document.getElementById('troco-input');
        
        if(trocoCheckbox.checked){
            inputTroco.classList.add('modal__dados__form__troco__input--is-active');
        }else{
            inputTroco.classList.remove('modal__dados__form__troco__input--is-active');
        }
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
        return true;
        
    } else {
        spanItem.classList.remove('header__content__horario--is-open');
        return false;
    }
}


AOS.init();