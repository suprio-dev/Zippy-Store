const API = "https://dummyjson.com/products?limit=0";
const CATEGORY_API = "https://dummyjson.com/products/categories";

const productsContainer = document.querySelector("#products-container");
const categoryFilters = document.querySelector("#category-filters");
const searchInput = document.querySelector("#search-input");
const wishlistCount = document.querySelector("#wishlist-count");
const cartCount = document.querySelector("#cart-count");


async function fetchProducts(url) {

  productsContainer.innerHTML = `<div class="col-span-full flex justify-center items-center py-16">
  <p class="text-lg font-semibold text-teal-700 animate-pulse">
    Loading...
  </p>
</div>`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.products.length) {
      renderProducts(data.products);
    } else {
      productsContainer.innerHTML = `<div class="col-span-full flex justify-center items-center py-16">
  <p class="text-lg font-semibold text-teal-700 animate-pulse">
    No items found...
  </p>
</div>`;
    }

  } catch (error) {
    console.log("Unable to fetch products!");
  }
}


function convertToINR(price) {
  return Math.round(price * 60).toLocaleString("en-IN");
}


function renderProducts(products) {
  productsContainer.innerHTML = "";
  products.forEach(({ thumbnail, category, title, price, id }) => {

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
                ₹${convertToINR(price)}
              </span>
            </div>
            <a href="product-details.html?id=${id}"
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
  if (productsContainer) {

    fetchProducts(API);
    fetchCategories();
  }
}

init();


let categoryData = [];


function getItem(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}


function setItem(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}




async function fetchCategories() {
  try {
    const response = await fetch(CATEGORY_API);
    const data = await response.json();
    categoryData = [{ name: "all", slug: "all", url: API }, ...data];
    renderCategories();

  } catch (error) {
    console.log("Unable to fetch categories!");
  }
}
function renderCategories(currentSlug = "all") {
  categoryFilters.innerHTML = "";
  [...categoryData].forEach(({ name, slug, url }) => {

    let button = document.createElement("button");
    if (currentSlug === slug) {
      button.className = "px-4 py-1.5 rounded-md text-sm font-medium bg-teal-700 text-white transition capitalize";
    } else {
      button.className = "px-4 py-1.5 rounded-md text-sm font-medium bg-white text-slate-700 border capitalize border-slate-300 hover:bg-slate-100 transition";

    }
    button.type = "button";
    button.textContent = name;
    button.dataset.category = slug;
    button.dataset.url = url;
    categoryFilters.append(button);
  })
}

function showToast(message, type = "success") {

  const toastContainer = document.querySelector("#toast-container");

  if (!toastContainer) return;

  const config = {
    success: {
      icon: "✓",
      title: "Success",
      color: "text-emerald-600",
      bg: "bg-emerald-50"
    },
    error: {
      icon: "✕",
      title: "Oops!",
      color: "text-red-600",
      bg: "bg-red-50"
    },
    info: {
      icon: "i",
      title: "Notice",
      color: "text-blue-600",
      bg: "bg-blue-50"
    }
  };

  const { icon, title, color, bg } = config[type] || config.success;

  const toast = document.createElement("div");

  toast.className = `
    relative overflow-hidden flex items-center gap-3
    w-[340px] max-w-[calc(100vw-32px)]
    p-4 bg-white rounded-xl
    border border-gray-100
    shadow-[0_10px_35px_rgba(0,0,0,0.12)]
    toast-enter
  `;

  toast.innerHTML = `
    <div class="w-10 h-10 shrink-0 rounded-full ${bg}
      ${color} flex items-center justify-center
      text-lg font-bold">
      ${icon}
    </div>

    <div class="flex-1 min-w-0">
      <h4 class="text-sm font-semibold text-gray-900">
        ${title}
      </h4>

      <p class="text-xs text-gray-500 mt-1">
        ${message}
      </p>
    </div>

    <button class="toast-close text-gray-400 hover:text-gray-800
      transition text-xl leading-none" aria-label="Close">
      &times;
    </button>

    <div class="toast-progress absolute bottom-0 left-0
      h-[3px] ${type === "error" ? "bg-red-500" : "bg-emerald-500"}">
    </div>
  `;

  toastContainer.append(toast);

  const removeToast = () => {
    if (!toast.isConnected) return;
    toast.classList.replace("toast-enter", "toast-exit");
    setTimeout(() => toast.remove(), 250);
  };

  const timeout = setTimeout(removeToast, 3000);

  toast.querySelector(".toast-close").addEventListener("click", () => {
    clearTimeout(timeout);
    removeToast();
  });
}


function formatCategory(category) {
  return category.replace("-", " ");
}

if (categoryFilters) {
  categoryFilters.addEventListener('click', (e) => {
    e.stopPropagation();

    const element = e.target;

    if (element.type) {
      const slug = element.dataset.category;
      const url = element.dataset.url;
      console.log(slug, url);
      renderCategories(slug);
      fetchProducts(url);
    }

  })
}



function toINR(price) {
  return Math.round(price * 60);
}



if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    e.stopPropagation();

    fetchProducts(`https://dummyjson.com/products/search?q=${searchInput.value}`);
  })
}




async function loadProductPage() {
  const productDetailtContainer = document.querySelector("#product-detail-container");
  if (!productDetailtContainer) {
    return;
  }

  console.log(productDetailtContainer);
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const url = `https://dummyjson.com/products/${id}`;
  // console.log(id);

  productDetailtContainer.innerHTML = `<div class="col-span-full flex justify-center items-center py-16">
  <p class="text-lg font-semibold text-teal-700 animate-pulse">
    Loading...
  </p>
</div>`;
  const response = await fetch(url);
  const data = await response.json();
  if (data.message) {
    productDetailtContainer.innerHTML = `<div class="col-span-full flex justify-center items-center py-16">
  <p class="text-lg font-semibold text-teal-700 animate-pulse">
    Failed to load product details...
  </p>
</div>`;
    return;
  }
  console.log(data);
  const { thumbnail, category, price, rating, reviews, title, description } = data;

  const div = `<div class="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        
        <div class="bg-white border border-slate-200 rounded-lg p-8 flex items-center justify-center min-h-[350px] md:min-h-[440px]">
          <img 
            src=${thumbnail} 
            alt=${title} 
            class="max-h-96 max-w-full object-contain"
          >
        </div>

        <div class="flex flex-col">
          <div>
            <span class="inline-block text-xs font-semibold text-teal-700 uppercase tracking-wider mb-2">
              ${category}
            </span>
          </div>

          <h1 class="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight mb-3">
           ${title}
          </h1>

          <div class="flex items-center gap-1 mb-4">
            <div class="flex items-center" aria-label="2.6 out of 5 stars">
              <svg class="w-5 h-5 text-amber-400 fill-current" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
            </div>
            <span class="ml-2 text-sm text-slate-500 font-medium">
              ${rating.toFixed(1)} (${reviews.length} reviews)
            </span>
          </div>

          <div class="mb-6">
            <span class="text-2xl sm:text-3xl font-bold text-slate-900">
              ₹${convertToINR(price)}
            </span>
          </div>

          <div class="border-t border-b border-slate-200 py-6 mb-6">
            <p class="text-slate-600 text-base leading-relaxed">
              ${description}
            </p>
          </div>

          <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            
            <div class="flex items-center border border-slate-300 rounded-md bg-white w-fit">
              <button 
                type="button" 
                id="qty-minus" 
                class="p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-l-md transition"
                aria-label="Decrease quantity"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                </svg>
              </button>

              <span id="qty-value" class="w-12 text-center text-sm font-semibold text-slate-900 select-none">
                1
              </span>

              <button 
                type="button" 
                id="qty-plus" 
                class="p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-r-md transition"
                aria-label="Increase quantity"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
              </button>
            </div>

            <button 
              type="button" 
              id="add-to-cart-btn" 
              class="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-teal-700 hover:bg-teal-800 text-white font-medium py-2.5 px-6 rounded-md shadow-sm transition"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
              <span>Add to Cart</span>
            </button>

            <button 
              type="button" 
              id="add-to-wishlist-btn" 
              class="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 border border-teal-700 text-teal-700 hover:bg-teal-50 font-medium py-2.5 px-6 rounded-md shadow-sm transition"
            >
              <svg id="wishlist-btn-icon" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
              <span id="wishlist-btn-text">Add to Wishlist</span>
            </button>
          </div>

        </div>
      </div>`;

  productDetailtContainer.innerHTML = div;
  const addToWishlistBtn = document.querySelector("#add-to-wishlist-btn");
  const addToCartBtn = document.querySelector("#add-to-cart-btn");
  addToWishlistBtn.addEventListener('click', (e) => {
    e.preventDefault();
    addToWishlist(data);


  })

  addToCartBtn.addEventListener('click', (e) => {
    e.preventDefault();

    if (getItem("cart").length) {
      const isExist = getItem("cart").some(p => p.id === data.id);

      if (!isExist) {
        setItem("cart", [data, ...getItem("cart")]);
        showToast("Product added to cart!");
      } else {
        showToast("Product is already in your cart!", "error");
      }

    } else {
      setItem("cart", [data, ...getItem("cart")]);
      showToast("Product added to cart!");
    }



    updateCartCount();


  })



}

loadProductPage();

function addToWishlist(data) {
  if (getItem("wishlist").length) {
    const isExist = getItem("wishlist").some(p => p.id === data.id);

    if (!isExist) {
      setItem("wishlist", [data, ...getItem("wishlist")]);
      showToast("Product added to wishlist!");
    } else {
      showToast("Product is already in your wishlist!", "error");
    }

  } else {
    setItem("wishlist", [data, ...getItem("wishlist")]);
    showToast("Product added to wishlist!");
  }


  updateWishlistCount();
}

function updateCartCount() {
  cartCount.textContent = getItem("cart").length;

}

updateCartCount();

function updateWishlistCount() {
  wishlistCount.textContent = getItem("wishlist").length;
}


updateWishlistCount();


function loadWishlistPage() {
  const wishListContainer = document.querySelector("#wishlist-container");
  if (!wishListContainer) {
    return;
  }
  const wishlistProducts = getItem("wishlist");
  const outterDiv = document.createElement("div");


  if (wishlistProducts.length) {
    wishListContainer.innerHTML = "";
    outterDiv.className = "bg-white border border-slate-200 rounded-lg divide-y divide-slate-200 overflow-hidden shadow-sm";
    wishlistProducts.forEach(({ title, thumbnail, price, id }) => {
      const card = document.createElement("div");
      card.className = "p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 justify-between";
      card.innerHTML = `
          <div class="flex items-center gap-4 w-full sm:w-auto flex-1 min-w-0">
            <div class="w-16 h-16 sm:w-20 sm:h-20 bg-white border border-slate-200 rounded p-1.5 flex items-center justify-center shrink-0">
              <img 
                src=${thumbnail}
                alt=${title} 
                class="max-h-full max-w-full object-contain"
              >
            </div>
            <div class="min-w-0 flex-1">
              <a 
                href="product-details.html?id=${id}" 
                class="text-sm font-semibold text-slate-900 hover:text-teal-700 line-clamp-2 transition" 
                title=${title}
              >
                ${title}
              </a>
              <p class="text-sm font-bold text-slate-900 mt-1">₹${convertToINR(price)}</p>
            </div>
          </div>
          <div class="flex items-center gap-3 w-full sm:w-auto shrink-0 justify-end">
            <button 
              type="button"
              data-id=${id} 
              class="wishlist-add-cart-btn inline-flex items-center justify-center gap-1.5 bg-teal-700 hover:bg-teal-800 text-white text-sm font-medium py-2 px-4 rounded transition shadow-sm"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
              <span>Add to Cart</span>
            </button>
            <button 
              type="button"
              data-id=${id} 
              class="wishlist-remove-btn inline-flex items-center justify-center gap-1.5 text-slate-500 hover:text-red-600 border border-slate-300 hover:border-red-300 text-sm font-medium py-2 px-3 rounded transition"
              title="Remove from Wishlist"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
              <span>Remove from Wishlist</span>
            </button>
          </div>
      `

        ;

      outterDiv.append(card);

    })


    wishListContainer.append(outterDiv);
  } else {
    wishListContainer.innerHTML = `<div class="bg-white border border-slate-200 rounded-lg p-12 text-center max-w-md mx-auto my-8">
        <div class="w-16 h-16 mx-auto mb-4 text-slate-300 flex items-center justify-center">
          <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
          </svg>
        </div>
        <h2 class="text-xl font-semibold text-slate-800 mb-2">Your wishlist is empty</h2>
        <p class="text-slate-500 text-sm mb-6">Looks like you haven't saved any products to your wishlist yet.</p>
        <a href="index.html" class="inline-flex items-center justify-center bg-teal-700 hover:bg-teal-800 text-white font-medium px-6 py-2.5 rounded-md transition text-sm">
          Start Shopping
        </a>
      </div>`;
  }



  wishListContainer.addEventListener('click', (e) => {
    e.stopPropagation();

    const wishlistAddCartBtn = e.target.closest(".wishlist-add-cart-btn");
    if (wishlistAddCartBtn) {

      const ProductId = Number(wishlistAddCartBtn.dataset.id);
      const findProduct = getItem("wishlist").find(({ id }) => id === ProductId);
      cartAdding(findProduct);
    }






    const removewishlistBtn = e.target.closest(".wishlist-remove-btn");
    if (removewishlistBtn) {

      const removeProductId = Number(removewishlistBtn.dataset.id);
      const filterProducts = getItem("wishlist").filter(({ id }) => id !== removeProductId);
      setItem("wishlist", filterProducts);
      showToast("Product removed from wishlist!");
      updateWishlistCount();
      loadWishlistPage();
    }
  })

}


loadWishlistPage();



function loadCartPage() {
  const cartContainer = document.querySelector("#cart-container");
  if (!cartContainer) {
    return;
  }

  const cartData = getItem("cart");
  if (!cartData.length) {
    cartContainer.innerHTML = ` <div class="bg-white border border-slate-200 rounded-lg p-12 text-center max-w-md mx-auto my-8">
        <div class="w-16 h-16 mx-auto mb-4 text-slate-300 flex items-center justify-center">
          <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
          </svg>
        </div>
        <h2 class="text-xl font-semibold text-slate-800 mb-2">Your cart is empty</h2>
        <p class="text-slate-500 text-sm mb-6">Looks like you haven't added anything to your cart yet.</p>
        <a href="index.html" class="inline-flex items-center justify-center bg-teal-700 hover:bg-teal-800 text-white font-medium px-6 py-2.5 rounded-md transition text-sm">
          Start Shopping
        </a>
      </div>`;
    return;
  }
  let totalAmount = 0;
  cartContainer.innerHTML = "";
  const mainDiv = document.createElement("div");
  mainDiv.className = "grid grid-cols-1 lg:grid-cols-3 gap-8 items-start";
  const div1 = document.createElement("div");
  div1.className = "lg:col-span-2 bg-white border border-slate-200 rounded-lg divide-y divide-slate-200 overflow-hidden shadow-sm";
  cartData.forEach(item => {
    const { title, thumbnail, price, id } = item;
    totalAmount += toINR(Number(price));
    const itemDiv = document.createElement("div");
    itemDiv.className = "p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 justify-between";
    itemDiv.innerHTML = `<div class="flex items-center gap-4 w-full sm:w-auto flex-1 min-w-0">
              <div
                class="w-16 h-16 sm:w-20 sm:h-20 bg-white border border-slate-200 rounded p-1.5 flex items-center justify-center shrink-0">
                <img src=${thumbnail}
                  alt=${thumbnail} class="max-h-full max-w-full object-contain">
              </div>
              <div class="min-w-0 flex-1">
                <a href="product-details.html?id=${id}"
                  class="text-sm font-semibold text-slate-900 hover:text-teal-700 line-clamp-2 transition"
                  title=${title}>
                  ${title}
                </a>
                <p class="text-xs text-slate-500 mt-1">₹${convertToINR(price)} each</p>
              </div>
            </div>
            <div class="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 w-full sm:w-auto shrink-0">
              <div class="flex items-center border border-slate-300 rounded bg-white">
                <button type="button"
                  class="cart-qty-minus p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-l transition"
                  aria-label="Decrease quantity">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                  </svg>
                </button>
                <span class="w-8 text-center text-xs font-semibold text-slate-800 select-none">1</span>
                <button type="button"
                  class="cart-qty-plus p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-r transition"
                  aria-label="Increase quantity">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                  </svg>
                </button>
              </div>
              <div class="w-20 text-right">
                <span class="text-sm font-bold text-slate-900">₹${convertToINR(price)}</span>
              </div>
              <button type="button" data-id=${id}
                class="cart-wishlist-btn text-slate-400 hover:text-teal-700 p-1.5 rounded transition"
                title="Add to Wishlist" aria-label="Add to Wishlist">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z">
                  </path>
                </svg>
              </button>
              <button type="button" data-id=${id} class="cart-remove-btn text-slate-400 hover:text-red-600 p-1.5 rounded transition"
                title="Remove from cart" aria-label="Remove item">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                  </path>
                </svg>
              </button>
            </div>`;
    div1.append(itemDiv);
    itemDiv.addEventListener('click', (e) => {
      const cartRemoveBtn = e.target.closest(".cart-remove-btn");
      if (cartRemoveBtn) {

        const removeCartId = Number(cartRemoveBtn.dataset.id);
        const filterProducts = getItem("cart").filter(({ id }) => id !== removeCartId);
        setItem("cart", filterProducts);
        showToast("Product removed from cart!");
        updateCartCount();
        loadCartPage();
      }

      const cartWishlistBtn = e.target.closest(".cart-wishlist-btn");
      if (cartWishlistBtn) {
        addToWishlist(item);
      }



    })
  })

  const div2 = document.createElement("div");
  div2.className = "bg-white border border-slate-200 rounded-lg p-6 shadow-sm sticky top-24";
  div2.innerHTML = ` <h2 class="text-lg font-bold text-slate-900 mb-4 pb-3 border-b border-slate-200">
            Order Summary
          </h2>

          <div class="flex items-center justify-between text-base font-semibold text-slate-900 mb-6">
            <span>Total Amount</span>
            <span class="text-xl font-bold text-teal-700">₹${convertTotalAmountINR(totalAmount)}</span>
          </div>

          <button type="button" id="checkout-btn"
            class="w-full bg-teal-700 hover:bg-teal-800 text-white font-medium py-3 px-4 rounded-md shadow-sm transition text-center">
            Proceed to Checkout
          </button>
        </div>`;
  mainDiv.append(div1, div2);
  cartContainer.append(mainDiv);

  const checkoutBtn = document.querySelector("#checkout-btn");
  checkoutBtn.addEventListener('click', (e) => {
    showToast(`
  <div class="flex flex-col gap-1">
    <h3 class="font-semibold text-base">Checkout Coming Soon!</h3>
    <p class="text-sm opacity-90">Your cart is ready! We're working on making checkout available soon. Stay tuned!</p>
    <span class="text-xs opacity-70 mt-1">Zippy Store · Just now</span>
  </div>
`, "success");
  })


}


loadCartPage();

function convertTotalAmountINR(totalAmount) {
  return totalAmount.toLocaleString("en-IN");
}

function cartAdding(data) {
  if (getItem("cart").length) {
    const isExist = getItem("cart").some(p => p.id === data.id);

    if (!isExist) {
      setItem("cart", [data, ...getItem("cart")]);
      showToast("Product added to cart!");
    } else {
      showToast("Product is already in your cart!", "error");
    }

  } else {
    setItem("cart", [data, ...getItem("cart")]);
    showToast("Product added to cart!");
  }
  updateCartCount();
}