const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTtotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCount = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addresswarn = document.getElementById("address-warn")

let cart = []

//abrindo modal do carrinho
cartBtn.addEventListener("click", function() {
    updateCartModal()
    cartModal.style.display = "flex"
})

//fechar o modal clicando fora
cartModal.addEventListener("click", function(event) {
    if(event.target === cartModal)
    cartModal.style.display = "none"
})

closeModalBtn.addEventListener("click", function() {
    cartModal.style.display = "none"
})

menu.addEventListener("click", function(event) {
    let parentButton = event.target.closest(".add-to-cart-btn")

    if(parentButton){
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))
   
        addToCart(name,price)
    }

})

//função para adicionar ao carrinho
function addToCart(name,price){
    const existingItem = cart.find(item => item.name === name)

    if(existingItem){
        existingItem.quantity += 1
        return
    } else{
    
        cart.push({
            name,
            price,
            quantity: 1,
        })

    }

    updateCartModal()
}

//atualizar o carrinho
function updateCartModal(){
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

        cartItemElement.innerHTML = `
        <div class="flex items-center justify-between">
          <div>
            <p class="font-medium">${item.name}</p>
            <p>QTD: ${item.quantity}</p>
            <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
          </div>

          <div>
            <button class="remove-btn" data-name="${item.name}">
                Remover
            </button>
          </div>
        </div>
        `

        total += item.price * item.quantity
        
        cartItemsContainer.appendChild(cartItemElement)
    })

    cartTtotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    })

    cartCount.innerHTML = cart.length
}

//função para remover item do carrinho
cartItemsContainer.addEventListener("click", function(event){
    if(event.target.classList.contains("remove-btn")){
        const name = event.target.getAttribute("data-name")
    
        removeItemCart(name)
    }
})

function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name)

    if(index !== -1){
        const item = cart[index]
    

        if(item.quantity > 1){
            item.quantity -=1
            updateCartModal()
            return
        }

        cart.splice(index,1)
        updateCartModal()
    }    
}

addressInput.addEventListener("input", function(event){
    let inputValue = event.target.value

    if(inputValue !== ""){
        addressInput.classList.remove("border-red-500")
        addresswarn.classList.add("hidden")
    }

})

//finalizar pedido
checkoutBtn.addEventListener("click", function(){

    const isOpen = checkRestauranteOpen()
    if(!isOpen){
        alert("Restaurante fechado no momento!")
        return
    }

    if(cart.length === 0) return
    
    if(addressInput.value === ""){
        addresswarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return
    }

    //enviar para a API do whatsapp
    const cartItems = cart.map((item) => {
        return(
            `${item.name} Quantidade: (${item.quantity}) Preço: R$${item.price} |`
        )
    }).join("")

    const message = encodeURIComponent(cartItems)
    const phone = "47999219404"

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank")

    cart = []
    updateCartModal()

})

//verificar a hora manipulando o card horario   
function checkRestauranteOpen(){
    const data = new Date()
    const hora = data.getHours()
    return hora >= 18 && hora < 23
}

const spanItem = document.getElementById("date-span")
const isOpen = checkRestauranteOpen()

if(isOpen){
    spanItem.classList.remove("bg-red-500")
    spanItem.classList.add("bg-green-600")
}else{
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-green-500")
    
}