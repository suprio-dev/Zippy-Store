const API = "https://dummyjson.com/products?limit=0";
const CATEGORY_API = "https://dummyjson.com/products/categories";

const productsContainer = document.querySelector("#products-container");
const categoryFilters = document.querySelector("#category-filters");


async function fetchProducts(url) {
  productsContainer.innerHTML = "Loading...";
  try {
    const response = await fetch(url);
    const data = await response.json();
    renderProducts(data.products);
  } catch (error) {

  }
}





function renderProducts(products) {
  productsContainer.innerHTML = "";
  products.forEach(({thumbnail,category,title,price}) => {

    let article = document.createElement("article");
    article.classList.add("bg-white", "border", "border-slate-200", "rounded-lg", "p-4", "flex", "flex-col", "justify-between", "hover:border-slate-300", "hover:shadow-sm", "transition");


    let card = `
          <div class="h-48 w-full flex items-center justify-center p-3 mb-4 bg-white">
            <img src=${thumbnail}
              alt=${title} class="max-h-full max-w-full object-contain" loading="lazy">
          </div>
          <div class="flex-grow flex flex-col">
            <span class="text-xs font-semibold text-teal-700 uppercase tracking-wider mb-1">
              ${formatCategory(category)}
            </span>
            <h2 class="font-semibold text-slate-900 text-sm mb-2 line-clamp-2" title=${title}>
              ${title}
            </h2>
            <div class="mt-auto pt-2">
              <span class="text-lg font-bold text-slate-900">
                ₹${Math.round(price * 40).toLocaleString("en-IN")}
              </span>
            </div>
            <a href="product-details.html"
              class="mt-4 block w-full text-center bg-teal-700 hover:bg-teal-800 text-white text-sm font-medium py-2 px-4 rounded transition">
              View Details
            </a>
          </div>
     `;

    article.innerHTML = card;

    productsContainer.append(article);

  })




}




function init() {

}


async function fetchCategories() {
  try {
    const response = await fetch(CATEGORY_API);
    const data = await response.json();
    renderCategories(data);
  } catch (error) {

  }
}

let categoryButtons = [];

function renderCategories(categories) {
  categoryFilters.innerHTML = "";
  [{ name: "all", slug: "all", url: API }, ...categories].forEach(({ name, slug, url }) => {

    let button = document.createElement("button");
    if (name === "all") {
      button.className = "px-4 py-1.5 rounded-md text-sm font-medium bg-teal-700 text-white transition capitalize";
    } else {
      button.className = "px-4 py-1.5 rounded-md text-sm font-medium bg-white text-slate-700 border capitalize border-slate-300 hover:bg-slate-100 transition";

    }

    button.type = "button";
    button.textContent = name;
    button.dataset.category = slug;
    button.dataset.url = url;

    categoryFilters.append(button);

    categoryButtons.push(button);

  })
}
fetchProducts(API);
fetchCategories();


function formatCategory(category) {
  return category.replace("-", " ");
}


categoryFilters.addEventListener('click', (e) => {
  e.stopPropagation();

  const element = e.target;

  if (element.type) {
    const text = element.dataset.category;
    const url = element.dataset.url;
    console.log(text, url);
    filterManage(element);
    fetchProducts(url);
  }

})


function filterManage(element) {
  categoryButtons.forEach((value) => {
    if (value !== element) {
      value.className = "px-4 py-1.5 rounded-md text-sm font-medium bg-white text-slate-700 border capitalize border-slate-300 hover:bg-slate-100 transition";
    } else {
      value.className = "px-4 py-1.5 rounded-md text-sm font-medium bg-teal-700 text-white transition capitalize";
    }
  })

}