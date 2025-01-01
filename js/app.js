let listCartHtml = document.querySelector('.ListCart');
let IconCartSpan = document.querySelector('.Cart_amount')
let Container = document.querySelector(".Container");
let TotalCartPrice = document.getElementById('TotalCartPrice');
const CheckOutBtn = document.getElementById('CheckOut');
let loader = document.querySelector('.Loader');
// localStorage.removeItem('cart');


let Products = [];
let  productsPerPage = 20;
let currentPage = 1;
let Carts = [];
initApp()

function showCart(){
    let CartDisplay = document.querySelector(".Cart");
    let body = document.querySelector('body');
    let Close = document.getElementById('Close');
    CartDisplay.onclick = () => {
        body.classList.toggle('ShowCart')
    }
    Close.onclick = () => {
        body.classList.toggle('ShowCart')
    }
}showCart();

function initApp(){
    fetch("json/products.json")
    .then(response => response.json())
    .then(data => {
    Products.push(...data);
    // AddDataToHtml();
    RenderProducts(currentPage);
    CreatePagination(Products.length);

    if(localStorage.getItem('cart')){
        Carts = JSON.parse(localStorage.getItem('cart'));
        AddCartToHtml();
        CalculateTotalPrice();
    }
})
}

function hideLoader() {
    loader.style.display = "none";
}

window.addEventListener("load", () => {
    setTimeout(hideLoader, 3000); // Simulate loading time
});
window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
        loader.style.display = "Flex";
        setTimeout(hideLoader, 1500); // Adjust timing as necessary
    }
});

function RenderProducts(page){
    Container.innerHTML = ``;//Clear Previous Page

    const starIndex = (page - 1) * productsPerPage;
    const endIndex = starIndex + productsPerPage;
    const productsToDisplay = Products.slice(starIndex ,endIndex);

    productsToDisplay.forEach( product => {
        let NewItem = document.createElement('a');
        let imageDiv = document.createElement('a');
        let nameDiv = document.createElement('div');
        let priceDiv = document.createElement('div');
        let cartDiv = document.createElement('div');


        imageDiv.href = '/details.html?id=' + product.id;
        
        NewItem.classList.add("Product-container");
        imageDiv.classList.add("img-container");
        nameDiv.classList.add("product-name");
        priceDiv.classList.add("product-price");
        cartDiv.classList.add('Add-Cart');
        

        
        
        NewItem.dataset.id = product.id;
        if(product.variants === undefined){
            nameDiv.innerHTML = `<h2>${product.name}</h2>`;
        }else{
            nameDiv.innerHTML = `<h2>${product.name}- ${product.color}</h2>`;
        }
        imageDiv.innerHTML = `<img src="images/${product.image}" alt="${product.name}" class="original_image">`;
        priceDiv.innerHTML = `<p>Ksh ${product.price.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits: 2})}</p>`;
        cartDiv.innerHTML = `
                <button class="Add_Cart_Btn">
                    Add To Cart
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7H7.312"/>
                    </svg>
                </button>
        `;

        
        NewItem.appendChild(imageDiv);
        NewItem.appendChild(nameDiv);
        NewItem.appendChild(priceDiv);
        NewItem.appendChild(cartDiv)
        Container.appendChild(NewItem);

        imageDiv.addEventListener("click",() =>{
            loader.style.display = "Flex";
        })
    } );
}

// function to create Pagination
function CreatePagination(totalProducts){
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = ``;//Clear Existing Buttons

    const totalPages = Math.ceil(totalProducts / productsPerPage);

    
    for(let i = 1; i <= totalPages; i ++){
        const button = document.createElement('button');
        const a = document.createElement('a');
        
        button.innerText = i;
        // a.href = "#pageUp"
        // a.innerText = i;
        button.classList.add("page-button");
        if(i === currentPage) button.classList.add("active");
        
        button.addEventListener("click" , () => {
            currentPage = i ;
            RenderProducts(currentPage);
            UpdateActiveButton();
        });
        
        if(totalPages <= 1){
            // alert(totalPages)
        }else{
            paginationContainer.appendChild(button);
        }
        // button.appendChild(a);
    }
};

function UpdateActiveButton(){
    const buttons = document.querySelectorAll(".page-button");
    buttons.forEach((button ,index) =>{
        if(index + 1 === currentPage){
            button.classList.add("active");
        }else{
            button.classList.remove("active");
        }
    })
}


Container.addEventListener("click", event => {
    let positionClick = event.target;
    // alert(positionClick)
    if(positionClick.classList.contains('Add_Cart_Btn')){
        let product_id = positionClick.parentElement.parentElement.dataset.id;
        AddToCart(product_id);
    }
})

function AddToCart(product_id){
    let PositionThisProductInCart = Carts.findIndex((value) => value.product_id == product_id)
    if(Carts.length <=0){
        Carts = [{
            product_id: product_id,
            quantity:1
        }]
        alert('Added to cart');
    }else if(PositionThisProductInCart < 0){
        Carts.push({
            product_id:product_id,
            quantity:1
        })
        alert('Added to cart');
    }else{
        alert("Product is already in  the Cart")
        Carts[PositionThisProductInCart].quantity = Carts[PositionThisProductInCart].quantity + 1;
    }
    AddCartToHtml();
    AddCartToMemory();
    CalculateTotalPrice();
}

function AddCartToHtml(){
    listCartHtml.innerHTML = '';
    let TotalQuantity = 0;
    TotalQuantity = TotalQuantity + Carts.length;
    
    if(Carts.length >= 0){
        IconCartSpan.style.display = 'inline-block';
        Carts.forEach(cart => {
            // TotalQuantity = cart.quantity;
            let NewCart = document.createElement('div');
            NewCart.classList.add('item');
            NewCart.dataset.id = cart.product_id;
            let PositionProduct = Products.findIndex( (value) => value.id == cart.product_id);
            if(PositionProduct >= 0){
                let info = Products[PositionProduct];
                if(cart.color === undefined){
                    if(info.variants === undefined){
                        NewCart.innerHTML = `
                        <div class="image">
                            <img src="images/${info.image}" alt="${info.name}">
                        </div>
                        <div class="name">
                            ${info.name}
                        </div>
                        <div class="totalPrice">
                            ${(info.price * cart.quantity).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits: 2})}
                        </div>
                        <div class="Quantity">
                            <span class="Decrease">-</span>
                            <span id="ProductQuantity" >${cart.quantity}</span>
                            <span class="Increase" >+</span>
                        </div>
                        `;                    
                    }else{
                        NewCart.innerHTML = `
                        <div class="image">
                            <img src="images/${info.image}" alt="${info.name}">
                        </div>
                        <div class="name">
                            ${info.name} - ${info.color}
                        </div>
                        <div class="totalPrice">
                            ${(info.price * cart.quantity).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits: 2})}
                        </div>
                        <div class="Quantity">
                            <span class="Decrease">-</span>
                            <span id="ProductQuantity" >${cart.quantity}</span>
                            <span class="Increase" >+</span>
                        </div>
                        `;                    
                    }
                }else{
                    NewCart.innerHTML = `
                    <div class="image">
                        <img src="images/${cart.image}" alt="${info.name} - ${cart.color}">
                    </div>
                    <div class="name">
                        ${info.name} - ${cart.color}
                    </div>
                    <div class="totalPrice">
                        ${(cart.price * cart.quantity).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits: 2})}
                    </div>
                    <div class="Quantity">
                        <span class="Decrease">-</span>
                        <span id="ProductQuantity" >${cart.quantity}</span>
                        <span class="Increase" >+</span>
                    </div>
                    `;                    
                }
                        listCartHtml.appendChild(NewCart);
            }
        });
    }else{
        IconCartSpan.style.display = 'none';
    }
    IconCartSpan.innerText = TotalQuantity;
}

function AddCartToMemory(){
    const validCarts = Carts.filter(item => item.product_id && item.quantity && item.quantity > 0);

    localStorage.setItem('cart', JSON.stringify(validCarts));
}

listCartHtml.addEventListener("click", (event) => {
    let positionClick = event.target;
    if(positionClick.classList.contains('Decrease')  || positionClick.classList.contains('Increase')){
        let product_id = positionClick.parentElement.parentElement.dataset.id;
        let type = 'Decrease';
        if(positionClick.classList.contains('Increase')){
            type = 'Increase';
        }
        changeQuantity(product_id,type);
    }
});

function changeQuantity(product_id,type){
    let positionItemInCart = Carts.findIndex((value) => value.product_id == product_id);
    if(positionItemInCart >= 0){
        switch(type){
            case 'Increase':
                Carts[positionItemInCart].quantity = Carts[positionItemInCart].quantity + 1;
                break;

            default:
                let valueChange = Carts[positionItemInCart].quantity -1;
                if(valueChange > 0){
                    Carts[positionItemInCart].quantity = valueChange;
                }else{
                    Carts.splice(positionItemInCart, 1);
                }
                break;
        }
    }
    AddCartToMemory();
    AddCartToHtml();
    CalculateTotalPrice();
}

function CalculateTotalPrice(){
    let total = 0;

    Carts.forEach(cart => {
        let PositionOfPrice = Products.findIndex((product) => product.id == cart.product_id);
        
        if(PositionOfPrice >= 0){
            let price = Products[PositionOfPrice];
            total += price.price * cart.quantity;
            localStorage.setItem('Price', JSON.stringify(total));
            localStorage.setItem('Quantity', JSON.stringify(Carts.length));
        }
    });
    TotalCartPrice.innerText = total.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits: 2});
}

    CheckOutBtn.addEventListener('click', () => {
        if(Carts.length === 0){
            alert("Your Cart is empty. Add some products before proceeding to checkout");
            return;
        }
        const checkoutInfo = Carts.map(cart => {
            const product = Products.find(p => p.id == cart.product_id);
            console.log(product.name);
            if(cart.color === undefined){
                return{
                    name:product.name,
                    image:`images/${product.image}`,
                    quantity:cart.quantity,
                    price:product.price * cart.quantity,
                }
            }else{
                return{
                    name:`${product.name}  ${cart.color}`,
                    image:`images/${cart.image}`,
                    quantity:cart.quantity,
                    price:cart.price * cart.quantity
                }

            }
        })
        localStorage.setItem('checkoutInfo', JSON.stringify(checkoutInfo));
        window.location.href = 'Account.html';
    });

