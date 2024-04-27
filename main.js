(function () {
  const select = (el, all = false) => {
    el = el.trim();
    return all
      ? [...document.querySelectorAll(el)]
      : document.querySelector(el);
  };

  const cart = select(".cart"),
    cartOpenBtn = select(".cart__open-btn");

  cartOpenBtn.addEventListener("click", () => cart.classList.toggle("is-open"));

  const navMenu = select(".nav__list"),
    navToggler = select(".nav__toggler"),
    navCloseBtn = select(".nav__close-btn");

  navToggler.addEventListener("click", () => {
    navMenu.classList.add("is-open");
  });

  navCloseBtn.addEventListener("click", () => {
    navMenu.classList.remove("is-open");
  });

  // Update preview image when click on thumbnail image

  function changeImg(showImgs, clickedImg) {
    thumbnailImgs.forEach((img) => img.classList.remove("is-active"));
    select(
      `img[data-show-src="${clickedImg.getAttribute("data-show-src")}"]`,
      true
    ).forEach((img) => img.classList.add("is-active"));
    showImgs.forEach(
      (showImg) => (showImg.src = clickedImg.getAttribute("data-show-src"))
    );

    currentImg = [...clickedImg.parentElement.children].indexOf(clickedImg);
  }

  const previewImgs = select(".product__preview-img", true),
    thumbnailImgs = select(".product__thumbnail img", true);

  thumbnailImgs.forEach((thumbnailImg) => {
    thumbnailImg.addEventListener("click", () =>
      changeImg(previewImgs, thumbnailImg)
    );
  });

  // Toggle Lightbox

  const showLightboxImg = select(".product-details__img .product__preview-img"),
    lightbox = select(".product__lightbox"),
    lightboxCloseBtn = select(".product__lightbox .close-btn");

  showLightboxImg.addEventListener("click", () => {
    lightbox.classList.add("is-open");
  });
  lightboxCloseBtn.addEventListener("click", () =>
    lightbox.classList.remove("is-open")
  );

  // Slider

  const prevSlideBtns = select(".prev", true),
    nextSlideBtns = select(".next", true),
    allThumbnailImgs = select(
      ".product-details__img .product__thumbnail img",
      true
    ),
    thumbnailImgsCount = allThumbnailImgs.length;

  let currentImg = 0;

  function prevSlide() {
    currentImg--;
    if (currentImg < 0) {
      currentImg = thumbnailImgsCount - 1;
    }
    updatePreview();
  }

  function nextSlide() {
    currentImg++;
    if (currentImg >= thumbnailImgsCount) {
      currentImg = 0;
    }

    updatePreview();
  }

  function updatePreview() {
    let thumbnailActiveImgs = select(
      `.product__thumbnail img:nth-of-type(${currentImg + 1})`,
      true
    );
    thumbnailActiveImgs.forEach((thumbnailImg) => thumbnailImg.click());
  }

  prevSlideBtns.forEach((prevBtn) =>
    prevBtn.addEventListener("click", prevSlide)
  );

  nextSlideBtns.forEach((nextBtn) =>
    nextBtn.addEventListener("click", nextSlide)
  );

  // Increment / decrement products quantity
  const plusBtn = select(".plus-btn"),
    minusBtn = select(".minus-btn"),
    productQuantity = select(".product__qty"),
    cartQuantity = select(".cart__open-btn span");

  plusBtn.addEventListener("click", () => {
    productQuantity.innerText++;
  });

  minusBtn.addEventListener("click", () => {
    productQuantity.innerText <= 0
      ? (productQuantity.innerText = 0)
      : productQuantity.innerText--;
  });

  // Add to cart
  const addToCartBtn = select(".addToCart-btn"),
    cartBody = select(".cart__body");

  addToCartBtn.addEventListener("click", () => {
    const prodQty = +productQuantity.innerText;
    if (prodQty) {
      domObserver.observe(cartBody, { childList: true, subtree: true });
      cartBody.innerHTML = `
      <p>Your cart is empty.</p>
    <div class="cart__content">
                <div class="cart__product flex justify-between align-center">
                  <img src="images/image-product-1.jpg" alt="Image alt text" />
                  <div>
                    <h4>Fall Limited Edition Sneakers</h4>
                    <p>
                      $125.00 &times; ${prodQty} <span class="total-price">$${(
        125 * prodQty
      ).toFixed(2)}</span>
                    </p>
                  </div>
                  <button class="delete-btn">
                   <img src="images/icon-delete.svg" alt="Image alt text"/>
                  </button>
                </div>
                <button class="checkout-btn hvr-opacity-70">Checkout</button>
              </div>`;
      cartQuantity.innerHTML = prodQty;
      cartQuantity.classList.remove("is-hidden");
    } else {
      cartBody.innerHTML = `
      <p>Your cart is empty.</p>`;
      cartQuantity.classList.add("is-hidden");
    }
  });

  // Remove from cart
  const domObserver = new MutationObserver((mutationList) => {
    const deleteBtn = select(".delete-btn");

    if (deleteBtn) {
      deleteBtn.addEventListener("click", () => {
        deleteBtn.parentElement.parentElement.remove();
        productQuantity.innerText = 0;
        cartQuantity.classList.add("is-hidden");
      });
      domObserver.disconnect();
    }
  });

  domObserver.observe(cartBody, { childList: true, subtree: true });
})();
