// template class:
// shopify-section-template--14860102500426__theridge-pdp
// shopify-section-template--14860102500426__shogun-above


// shopify-section-template--14860102500426__theridge-pdp

const sectionID = "template--14860102500426__theridge-pdp"
let variantSelectors = document.querySelectorAll('.variant-option')

const changeProductEvent = new Event("changeProduct");

const changeProduct = (productURL) => {
  let requestURL = `${
    window.location.origin
  }${productURL}?section_id=${sectionID}`
  fetch(requestURL).then(response => response.text()).then((responseText) => {
    const newHtml = new DOMParser().parseFromString(responseText, 'text/html').querySelector('.theridge-pdp__background').innerHTML;

    document.querySelector('.theridge-pdp__background').innerHTML = newHtml;
    history.pushState({}, '', `${productURL}`)
    document.dispatchEvent(changeProductEvent)
  })
};

document.querySelector('.variant-options').style.opacity = 1;

variantSelectors.forEach((selector) => {
  selector.addEventListener('click', (e) => {
    let productURL = e.currentTarget.dataset.href
    changeProduct(productURL)
  })
})

document.addEventListener("changeProduct", (e) => {
  console.log('changing product')
  const variantSelectors = document.querySelectorAll('.variant-option')
  variantSelectors.forEach((selector) => {
    selector.addEventListener('click', (e) => {
      let productURL = e.currentTarget.dataset.href
      changeProduct(productURL)
    })
  })
  
  setTimeout(() => {
    document.querySelector('.variant-options').style.opacity = 1;
  }, 300)
}, false,);

onpopstate = (event) => {
  const origin = event.currentTarget.location.origin
  const path = event.currentTarget.location.pathname
  let requestURL = `${
    origin
  }${path}?section_id=${sectionID}`
  fetch(requestURL).then(response => response.text()).then((responseText) => {
    const newHtml = new DOMParser().parseFromString(responseText, 'text/html').querySelector('.product-template__container').innerHTML;

    document.querySelector('.product-template__container').innerHTML = newHtml;
  }).then(() => {
    document.dispatchEvent(changeProductEvent)
  });
};
