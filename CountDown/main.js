const baseURL = 'https://geektech-project.herokuapp.com';

const endpoints = {
  products: `${baseURL}/products/`,
}

const state = {
  products: null,
  productId: null
};

const submit = document.getElementById('submit');

const inputs = {
  title: document.getElementById('name'),
  description: document.getElementById('description'),
  price: document.getElementById('price'),
  stock_price: document.getElementById('stock_price'),
  category: document.getElementById('category_id'),
  image: null
}


const deleteProduct = async (id) => {
  await fetch(`${endpoints.products}${id}`, {
    method: 'DELETE'
  });
  await getAllProducts();
}

const getProduct = async (id) => {
  const res = await fetch(`${endpoints.products}${id}`, {
    method: 'GET'
  })
  const data = await res.json()
  state.productId = data.id
  for (let key in data) {
    if (key !== "id" && key !== "image") {
      inputs[key].value = key === "category" ? data[key].id : data[key]
    }
  }
}


async function updateProduct(obj) {
  let options = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(obj)
  }
  let res = await fetch(`${endpoints.products}${state.productId}`, options)
  let data = await res.json()
  console.log(data)
}

const getAllProducts = async () => {
  const products = document.querySelector('.products');
  products.innerHTML = "";

  const res = await fetch(endpoints.products)
  const data = await res.json();
  state.products = data;

  for (let i = 0; i < data.length; i++) {
    products.innerHTML += `
  <div class="product_block">
   <img src="${baseURL}${data[i].image}" alt=""/>
   <h3>${data[i].title}</h3>
   <p class="description">${data[i].description}</p>
   <p class="price">${data[i].price}</p>
   <button onclick="deleteProduct(${data[i].id})">Delete</button>
   <button onclick="getProduct(${data[i].id})">Edit</button>
  </div>`;
  }
  return data;
}

getAllProducts();

const addProduct = async () => {
  const obj = {
    title: inputs.title.value,
    description: inputs.description.value,
    price: inputs.price.value,
    stock_price: inputs.stock_price.value,
    category_id: inputs.category.value,
    image: null
  }
  if (state.productId) {
    await updateProduct(obj)
  } else {
    await createProduct(obj)
  }
  await getAllProducts()
}

async function createProduct(obj) {
  let res = await fetch(endpoints.products, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(obj)
  })
  let data = await res.json()
}


submit.addEventListener('click', addProduct);





