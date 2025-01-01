let Carts = [];
let Items = [];
let  Remove_Display = document.getElementById('Remove_Display');
let optionsBtn = document.querySelector('.options');
let optionsDis = document.querySelector('.optionsDis');
let closeDisBtn = document.getElementById('closeBtn');
let selectedVariant = null;
let addToCart = document.querySelector('.addToCart');
const loader = document.querySelector('.Loader');


function innitApp(){
        fetch("json/products.json")
        .then(response => response.json())
        .then(data => {
            Items = data;
    
            AddDataToDetails();
        });

        if(localStorage.getItem('cart')){
                Carts = JSON.parse(localStorage.getItem('cart'));
            }

}innitApp();

function AddDataToDetails(){
    let Content = document.querySelector(".Content");

        let productId = new URLSearchParams(window.location.search).get('id');
        let ThisProduct = Items.filter(data => {
            return data.id == productId
        })[0];
        if(!ThisProduct){
            window.location.href = "/";
        }
            
        if(ThisProduct.variants == undefined){
            Content.querySelector(".dis_img img").src =`images/${ThisProduct.image}`;
            Content.querySelector(".dis-name").innerText = ThisProduct.name;
            Content.querySelector(".dis-price h1").innerText = ThisProduct.price;
            Content.querySelector(".dis-des p").innerText = ThisProduct.description;
        }else{
            Content.querySelector(".dis_img img").src =`images/${ThisProduct.image}`;
            Content.querySelector(".dis-name").innerText = `${ThisProduct.name} - ${ThisProduct.color}`;
            Content.querySelector(".dis-price h1").innerText = ThisProduct.price;
            Content.querySelector(".dis-des p").innerText = ThisProduct.description;
            optionsBtn.style.display = "grid";


            let values = document.querySelector('.values');
            let variants = ThisProduct.variants;
            variants.forEach((variant, index) => {
                    let modal = document.createElement('div');
                    let modalImage = document.createElement('img');
                    let Label = document.createElement('label');
                    let CheckBox = document.createElement('input');



                    modal.classList.add('modal');
                    modalImage.id = 'modalImage';

                    modalImage.src = `images/${variant.image}`;
                    Label.innerText = `${variant.color}  -   ${variant.price}`;
                    CheckBox.type = 'checkbox';
                    CheckBox.name = "variant";
                    CheckBox.value = index;
                    
                    modal.appendChild(modalImage);
                    modal.appendChild(Label);
                    modal.appendChild(CheckBox);
                    values.appendChild(modal);

                    
                    CheckBox.addEventListener("change" , () => {

                        document.querySelectorAll('input[name="variant"]').forEach((cb) => {
                            if(cb.checked === false){
                                // alert("hae");
                                
                                Content.querySelector(".dis_img img").src =`images/${ThisProduct.image}`;
                                Content.querySelector(".dis-name").innerText = `${ThisProduct.name} - ${ThisProduct.color}`;
                                Content.querySelector(".dis-price h1").innerText = ThisProduct.price;
                            }else if(cb !== CheckBox){
                                cb.checked = false;
                            }else{
                                selectedVariant = variants[cb.value];
                                Content.querySelector(".dis_img img").src =`images/${selectedVariant.image}`;
                                Content.querySelector(".dis-name").innerText = `${ThisProduct.name} - ${selectedVariant.color}`;
                                Content.querySelector(".dis-price h1").innerText = selectedVariant.price;
                            }
                        });

                        if(![...document.querySelectorAll('input[name="variant"]')].some(cb => cb.checked)){
                            selectedVariant = null;
                        }
                        
                    });
                    
                });




                
            optionsBtn.querySelector('button').addEventListener('click' , () =>{
                optionsDis.classList.toggle('displayOptions');
            })
            closeDisBtn.addEventListener('click' , () =>{
                optionsDis.classList.toggle('displayOptions');
            })
        }
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

Remove_Display.addEventListener("click", () =>{
            loader.style.display = "Flex";
            window.location.href = "./"
}
);


addToCart.addEventListener("click", () => {
    let product_id = new URLSearchParams(window.location.search).get('id');
        AddToCart(product_id,selectedVariant);
        console.log(selectedVariant)
})

function AddToCart(product_id,selectedVariant){
    let PositionThisProductInCart = Carts.findIndex((value) => value.product_id == product_id)
    if(Carts.length <=0){
        if(selectedVariant !== null){
            Carts = [{
                product_id: product_id,
                quantity:1,
                color:selectedVariant.color,
                image:selectedVariant.image,
                price:selectedVariant.price
            }];
            console.log(selectedVariant);
            alert('Added to cart');
        }else{
            Carts = [{
                product_id: product_id,
                quantity:1
            }];
            alert('Added to cart');
        }
    }else if(PositionThisProductInCart < 0){
        if(selectedVariant === null){
            alert('Added to cart');
            console.log(selectedVariant + product_id)
            Carts.push({
                product_id:product_id,
                quantity:1
            });
        }else{
            Carts.push({
                product_id: product_id,
                quantity:1,
                color:selectedVariant.color,
                image:selectedVariant.image,
                price:selectedVariant.price
            });
            alert('Added to cart');
        }
    }else{
        Carts[PositionThisProductInCart].quantity = Carts[PositionThisProductInCart].quantity + 1;
        alert('Product is already in the Cart');
    }
    console.log(Carts)
    AddCartToMemory();
}

function AddCartToMemory(){
const validCarts = Carts.filter(item => item.product_id && item.quantity && item.quantity > 0);

localStorage.setItem('cart', JSON.stringify(validCarts));
}

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
}
document.getElementById('buyNow').addEventListener('click', () => {
    let productId = new URLSearchParams(window.location.search).get('id');
        let ThisProduct = Items.filter(data => {
            return data.id == productId
        })[0];
        localStorage.removeItem('checkoutInfo');

        if(selectedVariant == null){
            let checkoutInfo = {
                    one:true,
                    name:ThisProduct.name,
                    image:ThisProduct.image,
                    quantity: 1,
                    price:ThisProduct.price
            }
            localStorage.setItem('checkoutInfo', JSON.stringify(checkoutInfo));
        }else{
            let checkoutInfo = {
                    one:true,
                    name:`${ThisProduct.name} - ${selectedVariant.color} `,
                    image:selectedVariant.image,
                    quantity: 1,
                    price:selectedVariant.price
            }

            localStorage.setItem('checkoutInfo', JSON.stringify(checkoutInfo));
        }
    
    loader.style.display = "Flex";
    window.location.href = 'Account.html';
});
