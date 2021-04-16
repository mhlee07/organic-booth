if(document.readyState == 'loading'){
    document.addEventListener('DOMContentLoaded', start)
    } else{
        start()
    }

    function start(){
        const quantityInput = document.getElementsByClassName('quantity-input')
        for(let i = 0; i < quantityInput.length; i++){
            let input = quantityInput[i]
            input.addEventListener('change', quantityChanged)
        }

        const deleteButton = document.getElementsByClassName('btn-delete')
        for(let i = 0; i < deleteButton.length; i++){
            deleteButton[i].addEventListener('click', deleteCartItem)
        }

        const addToCartButton = document.getElementsByClassName('add-to-cart')
        for(let i = 0; i < addToCartButton.length; i++){
            addToCartButton[i].addEventListener('click', addtoCart)
        }

        const searchBar = document.querySelector('.item-input')
        searchBar.addEventListener('keyup', searchBarActive)
    }


    function quantityChanged(event){
        let input = event.target
        if(isNaN(input.value) || input.value <= 0){
            input.value = 1
        }
        updatePrice()
    }

    function deleteCartItem(event){
        let button = event.target
        button.parentElement.parentElement.remove()
        updatePrice()
    }

    function updatePrice(){
        const shoppingCart = document.getElementsByClassName('shopping-cart')[0]
        const cartItems = shoppingCart.getElementsByClassName('cart-items')
        let total = 0
        for(let i = 0; i < cartItems.length; i++){
            const cartItem = cartItems[i]
            let quantity = cartItem.getElementsByClassName('quantity-input')[0].value
            let unitprice = cartItem.getElementsByClassName('cart-price')[0].innerText.replace('$','')
            total = total + (quantity * unitprice)

            subtotal = quantity * unitprice
            subtotal = Math.round(subtotal*100) / 100
            let subtotalbox = cartItem.getElementsByClassName('cart-subtotal-price')[0]
            subtotalbox.innerText = '$' + subtotal
        }
        
        total = Math.round(total*100) / 100

        const totalPrice = document.getElementsByClassName('cart-total-price')[0]
        totalPrice.innerText = '$' + total
    }


    function addtoCart(event){
        let button = event.target
        let item = button.parentElement.parentElement
        let title = item.getElementsByClassName('item-title')[0].innerText
        let image = item.getElementsByClassName('item-image')[0].src
        let unitprice = item.getElementsByClassName('item-price')[0].innerText
        addedItem(title, image, unitprice)
    }
        
    function addedItem(title, image, unitprice){
        let itemRow = document.createElement('div')
        itemRow.className = 'cart-items'
        const shoppingCart = document.getElementsByClassName('shopping-cart')[0]
        const itemRowContent = 
        `<div class="cart-item cart-style">
            <img class="cart-item-image" src=${image}>
            <span class="cart-item-title">${title}</span>
        </div>
        <span class="cart-price cart-style">${unitprice}</span>
        <div class="cart-quantity cart-style">
            <input class="quantity-input" type="number" value="1">
        </div>
        <div class="cart-subtotal cart-style">
            <span class="cart-subtotal-price">$0</span>
            <button class="btn btn-delete" type="button">Remove</button>
        </div>`

        itemRow.innerHTML = itemRowContent

        // Avoid same item added to cart
        const cartTitles = shoppingCart.getElementsByClassName('cart-item-title')
        for(let i = 0; i< cartTitles.length; i++){
            const cartTitle = cartTitles[i]
            if(cartTitle.innerText == title){
                alert('Already added to cart!')
                return
            }
        }

        shoppingCart.append(itemRow)

        let input = itemRow.getElementsByClassName('quantity-input')[0]
        input.addEventListener('change', quantityChanged)

        let deleteItem = itemRow.getElementsByClassName('btn-delete')[0]
        deleteItem.addEventListener('click', deleteCartItem)
        
        updatePrice()
    }

    // Search bar function
    function searchBarActive(event){
            const inputContent = event.target.value.toLowerCase()
            const titleNames = document.querySelectorAll('.item-title')

            Array.from(titleNames).forEach(title => {
                if(title.textContent.toLowerCase().indexOf(inputContent)!= -1){
                    title.parentElement.style.display = 'block'
                } else{
                    title.parentElement.style.display = 'none'
                }
            })
    }


    // Cart modal
    const openModalButtons = document.querySelectorAll('[data-modal-target]')
    const closeModalButtons = document.querySelectorAll('[data-close-modal]')
    const purchaseModalButton = document.querySelector('[data-modal-purchase]')
    const overlay = document.getElementById('overlay')

    openModalButtons.forEach(openbutton => {
        openbutton.addEventListener('click', () => {
            const modal = document.querySelector(openbutton.dataset.modalTarget)
            openCartModal(modal)
        })
    })

    function openCartModal(modal){
        if(modal == null) return
        modal.classList.add('active')
        overlay.classList.add('active')
    }

    closeModalButtons.forEach(closebutton => {
        closebutton.addEventListener('click', () => {
            const modal = closebutton.parentElement.parentElement
            closeCartModal(modal)
        })
    })

    function closeCartModal(modal){
        if(modal == null) return
        modal.classList.remove('active')
        overlay.classList.remove('active')
    }

    purchaseModalButton.addEventListener('click', () => {
        alert('you have purchased')
        let items = document.querySelector('.shopping-cart')
        while(items.hasChildNodes()) {
            items.removeChild(items.firstChild)
        }
        updatePrice()
    })


    overlay.addEventListener('click', () => {
        const modals = document.querySelectorAll('.modal.active')
        modals.forEach(modal => {
            closeCartModal(modal)
        })
    })
