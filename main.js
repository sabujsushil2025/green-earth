
let categories= [];  
let plants= [];      
let cart= [];      
let currentCategory= 'all';

// categories
function getCategories() {
    fetch('https://openapi.programming-hero.com/api/categories')
        .then(function(response){
            return response.json();
        })
        .then(function(data){
            categories = data.categories;
            showCategories();
        })
        .catch(function(error){
            console.log('Error categories:', error);
        });
}

function getAllPlants(){
    showLoading(true);
    fetch('https://openapi.programming-hero.com/api/plants')
        .then(function(response){
            return response.json();
        })
        .then(function(data){
            plants= data.plants || data.data;
            console.log('Got plants:', plants.length);
            showPlants(plants);
            showLoading(false);
        })
        .catch(function(error){
            console.log('Error getting plants:', error);
            showLoading(false);
        });
}

// category
function getPlantsByCategory(categoryId) {
    showLoading(true);
    const url= 'https://openapi.programming-hero.com/api/category/' + categoryId;
    fetch(url)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            const categoryPlants = data.plants || data.data;
            console.log('Got category plants:', categoryPlants.length);
            showPlants(categoryPlants);
            showLoading(false);
        })
        .catch(function(error) {
            console.log('Error getting category plants:', error);
            showLoading(false);
        });
}

function showCategories() {
    const categoryContainer= document.getElementById('categoryList');
    categoryContainer.innerHTML= ''; 
    const allButton= document.createElement('button');
    allButton.innerText= 'All Trees';
    allButton.className= 'flex-shrink-0 rounded-sm px-3 py-1 text-left hover:bg-[#157f3d]';
    allButton.onclick= function(){
        selectCategory('all');
    };
    categoryContainer.appendChild(allButton);
  
    for (let i= 0;i<categories.length;i++){
        const category= categories[i];
        const button= document.createElement('button');
        
        button.innerText= category.category_name;
        button.className= 'flex-shrink-0 rounded-sm px-3 py-1 text-left hover:bg-[#157f3d]';
        button.setAttribute('data-id', category.id);

        button.onclick= function(){
            const categoryId= this.getAttribute('data-id');
            selectCategory(categoryId);
        };
        categoryContainer.appendChild(button);
    }
    updateActiveCategory();
}

function updateActiveCategory() {
    const buttons= document.querySelectorAll('#categoryList button');
    
    for (let i= 0;i<buttons.length;i++){
        const button= buttons[i];
        const buttonId= button.getAttribute('data-id') || 'all';
        
        if(buttonId == currentCategory){
            button.classList.add('bg-[#157f3d]', 'text-white');
        } 
        else{
            button.classList.remove('bg-[#157f3d]', 'text-white');
        }
    }
}

function selectCategory(categoryId) {
    console.log('Selected category:', categoryId);
    currentCategory= categoryId;
    updateActiveCategory();
    if (categoryId== 'all') {
        getAllPlants();
    } else {
        getPlantsByCategory(categoryId);
    }
}

function showPlants(plantList) {
    const container= document.getElementById('cardsContainer');
    container.innerHTML= ''; 
    
    if (plantList.length==0) {
        document.getElementById('emptyState').classList.remove('hidden');
        return;
    } 
    else{
        document.getElementById('emptyState').classList.add('hidden');
    }
    for (let i=0;i<plantList.length;i++) {
        const plant= plantList[i];
        const card= createPlantCard(plant);
        container.appendChild(card);
    }
}
function createPlantCard(plant){
    const card= document.createElement('div');
    card.className= 'rounded-2xl bg-white p-4 shadow-sm border bg-[#166434] flex flex-col';
    
    const imageDiv= document.createElement('div');
    imageDiv.className= 'aspect-[4/3] w-full bg-[#166434] rounded-xl overflow-hidden';
    const image= document.createElement('img');
    image.src= plant.image;
    image.alt= plant.name;
    image.className= 'w-full h-full object-cover';
    imageDiv.appendChild(image);
    
    const name= document.createElement('h4');
    name.className= 'mt-3 text-lg font-bold hover:underline cursor-pointer';
    name.innerText= plant.name;
    name.onclick= function(){
        showPlantInfo(plant);
    };
    
    const description= document.createElement('p');
    description.className= 'mt-1 text-sm text-slate-600 line-clamp-2';
    let desc= plant.description || 'Beautiful plant';
    description.innerText = desc;
    

    const infoDiv = document.createElement('div');
    infoDiv.className = 'mt-3 flex items-center justify-between text-sm';
    
    const categorySpan = document.createElement('span');
    categorySpan.className = 'rounded-full bg-emerald-100 px-2 py-1 text-emerald-800';
    categorySpan.innerText = plant.category || 'Tree';
    
    const priceSpan = document.createElement('span');
    priceSpan.className = 'font-semibold';
    priceSpan.innerText = '$' + plant.price;
    
    infoDiv.appendChild(categorySpan);
    infoDiv.appendChild(priceSpan);
    
    const button = document.createElement('button');
    button.className = 'mt-4 rounded-lg bg-emerald-600 py-2 text-white font-semibold hover:bg-emerald-700';
    button.innerText = 'Add to Cart';
    button.onclick = function() {
        addToCart(plant);
    };
    
    card.appendChild(imageDiv);
    card.appendChild(name);
    card.appendChild(description);
    card.appendChild(infoDiv);
    card.appendChild(button);
    
    return card;
}

function showPlantInfo(plant) {
    const message = 'Plant Details:\n\n' +
        'Name: ' + plant.name + '\n' +
        'Category: ' + (plant.category || 'Unknown') + '\n' +
        'Price: $' + plant.price + '\n' +
        'Description: ' + (plant.description || 'No description');
    alert(message);
}


function addToCart(plant) {
    const item = {
        id: plant.id,
        name: plant.name,
        price: parseFloat(plant.price) || 0
    };
    cart.push(item);
    console.log('Added to cart:', item.name);
    updateCart();
}
function removeFromCart(plantId) {
    const newCart = [];
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id != plantId) {
            newCart.push(cart[i]);
        }
    }
    cart = newCart;
    updateCart();
}

function updateCart() {
    const cartList = document.getElementById('cartList');
    cartList.innerHTML = ''; 
    

    for (let i = 0; i < cart.length; i++) {
        const item = cart[i];
        
        const listItem = document.createElement('li');
        listItem.className = 'flex items-center justify-between gap-2 rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2';
        
        const nameSpan = document.createElement('span');
        nameSpan.className = 'truncate';
        nameSpan.innerText= item.name;
        
        const priceSpan = document.createElement('span');
        priceSpan.className = 'font-medium';
        priceSpan.innerText = '$' + item.price.toFixed(2);
        
        const removeButton = document.createElement('button');
        removeButton.innerText = 'X';
        removeButton.className = 'text-emerald-700 hover:text-red-600';
        removeButton.setAttribute('data-id', item.id);
        removeButton.onclick = function() {
            const itemId = this.getAttribute('data-id');
            removeFromCart(itemId);
        };
        
        listItem.appendChild(nameSpan);
        listItem.appendChild(priceSpan);
        listItem.appendChild(removeButton);
        cartList.appendChild(listItem);
    }
    
    let total = 0;
    for (let i = 0; i < cart.length; i++) {
        total += cart[i].price;
    }
    
    document.getElementById('cartTotal').innerText = '$' + total.toFixed(2);
    
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (cart.length > 0) {
        checkoutBtn.disabled = false;
    } else {
        checkoutBtn.disabled = true;
    }
}

function checkout(){
    if (cart.length == 0) {
        alert('Your cart is empty!');
        return;
    }
    let total = 0;
    for (let i=0;i<cart.length;i++){
        total += cart[i].price;
    }
    
    alert('Thank you for your purchase!\nItems: ' + cart.length + '\nTotal: $' + total.toFixed(2));
    
    cart = [];
    updateCart();
}

function showLoading(show){
    const loading = document.getElementById('loading');
    if (show) {
        loading.classList.remove('hidden');
    } else {
        loading.classList.add('hidden');
    }
}

function setupButtons(){
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn){
        checkoutBtn.onclick = checkout;
    }
}


function startWebsite(){
    setupButtons();
    updateCart();
    getCategories();  
    getAllPlants();   
}

startWebsite();