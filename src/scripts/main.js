const cartBtn = document.getElementById('cart-btn');
const modal = document.getElementById('modal');
const fecharModal = document.getElementById('close');


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
        modal.style.display = "flex";
    });    

    // fechar modal apertando no X 
    fecharModal.addEventListener('click', function(){
        modal.style.display = "none";
    })

    // fechar modal apertando na parte de fora
    modal.addEventListener('click', function(event){
        if(event.target === modal){
            modal.style.display = "none";
        }   
    })

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