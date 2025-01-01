
    let orderSummary = document.querySelector('.order-summary');
    let checkoutInfo = JSON.parse(localStorage.getItem('checkoutInfo'));
    let userDetails = JSON.parse(localStorage.getItem('userDetails'));
    let Price = JSON.parse(localStorage.getItem('Price'));
    let Quantity = JSON.parse(localStorage.getItem('Quantity'));
    let loader = document.querySelector('.Loader');


    
    document.querySelector('.user-name').innerText = userDetails.name;
    document.querySelector('.userDetails').innerText = `${userDetails.county}-${userDetails.town}-${userDetails.number}`;

    if(checkoutInfo.forEach === undefined){

        document.getElementById('totalItems').innerText = checkoutInfo.quantity;
        document.getElementById('itemsPrice').innerText = checkoutInfo.price.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits: 2});
        document.getElementById('TotalPrice').innerText = checkoutInfo.price.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits: 2});


        let container = document.createElement('div');
        container.classList.add('oder');

        container.innerHTML = `
        <div class="container">
                <div class="img-con">
                        <img src="images/${checkoutInfo.image}" alt="">
                </div>
                <div class="title">
                    <p>
                        ${checkoutInfo.name}
                    </p>
                    <div class="color">
                        
                    </div>
                </div>
                <div class="price-quant">
                    <div class="price">
                        ksh ${checkoutInfo.price.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits: 2})}
                    </div>
                    <div class="quant">
                        x <span>${checkoutInfo.quantity}</span>
                    </div>
                </div>
        </div>
        `;
        orderSummary.appendChild(container);

    }else{

        document.getElementById('totalItems').innerText = Quantity;
        document.getElementById('itemsPrice').innerText = Price.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits: 2});
        document.getElementById('TotalPrice').innerText = Price.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits: 2});
    

        checkoutInfo.forEach((item) => {
            let container = document.createElement('div');
            container.classList.add('oder');
    
            container.innerHTML = `
            <div class="container">
                    <div class="img-con">
                            <img src="${item.image}" alt="">
                    </div>
                    <div class="title">
                        <p>
                            ${item.name}
                        </p>
                        <div class="color">
                            
                        </div>
                    </div>
                    <div class="price-quant">
                        <div class="price">
                            ksh ${item.price.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits: 2})}
                        </div>
                        <div class="quant">
                            x <span>${item.quantity}</span>
                        </div>
                    </div>
            </div>
            `;
    
            orderSummary.appendChild(container);
        });
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
    document.getElementById('PlaceOderBtn').addEventListener('click', () => {
        if(!checkoutInfo.one){
            var  emailContent ={
                user_name: `${userDetails.name}`,
                user_email: `${userDetails.email}`,
                user_address:`${userDetails.county},${userDetails.town} `,
                cart_details:`${checkoutInfo.map(item => `${item.name} - Quantity: ${item.quantity},  Total: Ksh ${item.price.toFixed(2)}`).join("\n")}`
            }
        }else{
            var  emailContent ={
                user_name: `${userDetails.name}`,
                user_email: `${userDetails.email}`,
                user_address:`County:${userDetails.county},Town:${userDetails.town}, Phone: ${userDetails.number}`,
                cart_details:`${checkoutInfo.name} - Quantity: ${checkoutInfo.quantity}, Total: Ksh ${checkoutInfo.price}`
            }
        }
        emailjs.send('service_rdhbkax','template_txvo14h', emailContent)
	    .then(function(response) {
	            console.log('SUCCESS!', response.status, response.text);
                window.alert('Your oder has been received and is being processed!');
                loader.style.display = "Flex";
                window.location = 'thankyou.html';

	    }, function(err) {
	                console.log('FAILED...', err);
                    alert('Something went wrong please try again');
	        });
    })
