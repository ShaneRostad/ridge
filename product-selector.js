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

   function load_js()
   {
      var head= document.getElementsByTagName('head')[0];
      var script= document.createElement('script');
      script.src= 'https://static.afterpay.com/shopify-afterpay-javascript.js';
      head.appendChild(script);
   }
   load_js();

  var sections = new theme.Sections();
  sections.register('product', theme.Product);

  const settings = {
    formSelector       : 'form[action^="/cart/add"]',
    cartContainer      : '#CartContainer',
    addToCartSelector  : 'input[type="submit"]',
    cartCountSelector  : null,
    cartCostSelector   : null,
    moneyFormat        : '${{amount}}',
    disableAjaxCart    : false,
    enableQtySelectors : false
  };


  // Select DOM elements
  $formContainer     = $(settings.formSelector);
  $cartContainer     = $(settings.cartContainer);
  $addToCart         = $formContainer.find(settings.addToCartSelector);
  $cartCountSelector = $(settings.cartCountSelector);
  $cartCostSelector  = $(settings.cartCostSelector);


  // General Selectors
  $body = $('body');

  // Track cart activity status
  isUpdating = false;
  
  itemAddedCallback = function (product) {
    $addToCart.removeClass('is-adding').addClass('is-added');
    $body.addClass('iscartpopup')

    ShopifyAPI.getCart(cartUpdateCallback);
  };

  itemErrorCallback = function (XMLHttpRequest, textStatus) {
    var data = eval('(' + XMLHttpRequest.responseText + ')');
    $addToCart.removeClass('is-adding is-added');

    if (!!data.message) {
      if (data.status == 422) {
        $formContainer.after('<div class="errors qty-error">'+ data.description +'</div>')
      }
    }
  };

  const upsell = function(cart){
    
    setTimeout(function(){ $('.drawer-upsell').css('opacity', '1') }, 1200);    
    if(cart.items.length === 1){
      //$('.drawer-upsell').fadeIn()
      setTimeout(function(){  $('.drawer-upsell .upsell-slider').css('opacity', '1') }, 1200);
      //       Getting handle of single product in cart
      var handle = $('.ajaxcart-title').data('handle');

      $.getJSON('/products/'+ handle +'.js', function(product) {
        
        var tags_count = product.tags.length
        var tags = product.tags;
        var cartitems;
        console.log(tags_count)
        for( var i = 0; i < tags_count; i++ ){
          var str1 = "upsell_";
          if(tags[i].indexOf(str1) != -1){
          if(tags[i].length > 0){
          $('.drawer-upsell').fadeIn();
          }else{
          $('.drawer-upsell').hide();
          }
          console.log(tags[i].length);
//                         console.log(tags[i]);
            var sometags = tags[i];
            sometags = sometags.replace('upsell_', '');

            
            $.getJSON('/products/'+sometags+'.js', function(upsell_product) {  
              cartitems =  '<div class="upsell-item " data-upsell="'+i+'"><div class="grid upsell-flex"><div class="grid__item two-tenths"><img class="lazyload" src="'+upsell_product.featured_image+'"/></div><div class="grid__item five-tenths"><h3 class="upsell-item-title">"'+upsell_product.title+'"</h3><div class="price">"'+theme.Currency.formatMoney(upsell_product.price_max, settings.moneyFormat)+'"</div></div><div class="grid__item three-tenths text-right"><a href="javascript:void(0);" data-variant-id="'+upsell_product.variants[0].id+'" class="upsell-addtocart btn">+ Add</a></div></div></div>';
                $('.upsell-slider').append(cartitems)
                setTimeout(function(){
                $('.drawer-upsell .upsell-slider').slick({
                  infinite: false,
                });
              }, 500);
              setTimeout(function(){  $('.drawer-upsell .upsell-slider').fadeIn() }, 700);
            })
            
          }
        }
      })    
    }
    else if(cart.items.length > 1){
      $('.drawer-upsell').hide()
      $('.upsell-slider').css('opacity','0')
    }
  }

  
  const cartUpdateCallback = function (cart) {
    // Update quantity and price
    updateCountPrice(cart);
    buildCart(cart);
    upsell(cart)
  };

  updateCountPrice = function (cart) {
    if ($cartCountSelector) {
      $cartCountSelector.html(cart.item_count).removeClass('hidden-count');

      if (cart.item_count === 0) {
        $cartCountSelector.addClass('hidden-count');
      }
    }
    if ($cartCostSelector) {
      $cartCostSelector.html(theme.Currency.formatMoney(cart.total_price, settings.moneyFormat));
    }
  };


  const buildCart = function (cart) {
    // Start with a fresh cart div
    $cartContainer.empty();

    // Show empty cart
    if (cart.item_count === 0) {
      $cartContainer
        .append('<p class="empty-cart hide">' + "empty cart" + '</p>');
      cartCallback(cart);
      $('.shipping-price').text('30');
      $('.FreeShipping__Message-success').addClass('hide')
      $('.FreeShipping__Message').addClass('hide')
      $('.empty-cart-menu').fadeIn();
      $('.bottom-cart').hide();
      return;
    }

    // Handlebars.js cart layout
    var items = [],
        item = {},
        data = {},
        source = $("#CartTemplate").html(),
        template = Handlebars.compile(source);

    // Add each item to our handlebars.js data
    $.each(cart.items, function(index, cartItem) {

      /* Hack to get product image thumbnail
       *   - If image is not null
       *     - Remove file extension, add _small, and re-add extension
       *     - Create server relative link
       *   - A hard-coded url of no-image
      */
      if (cartItem.image != null){
        var prodImg = cartItem.image.replace(/(\.[^.]*)$/, "_small$1").replace('http:', '');
      } else {
        var prodImg = "//cdn.shopify.com/s/assets/admin/no-image-medium-cc9732cb976dd349a0df1d39816fbcc7.gif";
      }
// 		console.log(cartItem.variant_title);
      // Create item's data object and add to 'items' array



      
      
      $.getJSON(window.Shopify.routes.root + `products/${cartItem.handle}.js`, function(product) {
        var comparePrice = product.compare_at_price * cartItem.quantity;
        var regPrice = product.price * cartItem.quantity;
        if(product.compare_at_price!= null){
          $(`.ajaxcart-item__price-strikethrough.cart-${cartItem.handle}`).find('s').text(theme.Currency.formatMoney(comparePrice));

          var saving = parseFloat(comparePrice - regPrice);
          $(`.ajaxcart-item__price-saving.savecart-${cartItem.handle}`).text(theme.Currency.formatMoney(saving)+' Savings');
          $(`.ajaxcart-item__price-saving.savecart-${cartItem.handle}`).show();
        }
      }); 


      
      item = {
        id: cartItem.variant_id,
        line: index + 1, // Shopify uses a 1+ index in the API
        url: cartItem.url,
        img: prodImg,
        name: cartItem.product_title,
        variation: cartItem.variant_title,
        properties: cartItem.properties,
        itemAdd: cartItem.quantity + 1,
        itemMinus: cartItem.quantity - 1,
        itemQty: cartItem.quantity,
        price: theme.Currency.formatMoney(cartItem.price, settings.moneyFormat),        
        vendor: cartItem.vendor,
        phandle: cartItem.handle,
        linePrice: theme.Currency.formatMoney(cartItem.line_price, settings.moneyFormat),
        originalLinePrice: theme.Currency.formatMoney(cartItem.original_line_price, settings.moneyFormat),
        discounts: cartItem.discounts,
        discountsApplied: cartItem.line_price === cartItem.original_line_price ? false : true
      };
//       console.log(item)
      items.push(item);
      
    });

    // Gather all cart data and add to DOM
    data = {
      items: items,
      note: cart.note,
      totalPrice:theme.Currency.formatMoney(cart.total_price, settings.moneyFormat),
      totalCartDiscount: cart.total_discount === 0 ? 0 : "savings",
      totalCartDiscountApplied: cart.total_discount === 0 ? false : true
    }
    
    $('.total-price').text(data.totalPrice);
    
    minPriceQualifyFreeShipping = parseFloat(minPriceQualifyFreeShipping); 
    var cleanPrice = data.totalPrice;
    var cleanPrice = cleanPrice.replace(/\$/g, '');
    if ( minPriceQualifyFreeShipping > 0 ){
        	var qfsDiff = minPriceQualifyFreeShipping - parseFloat(cleanPrice);
      	qfsDiff = parseFloat(qfsDiff);
      	if ( qfsDiff < 0 ){
        	//var qualifyFreeShippingHTML = '<div class="inner fs-yes"><i class="fa fa-check"></i> Hooray! Your order qualifies for free shipping! <i class="fa fa-truck fa-flip-horizontal"></i></div>';
            var qualifyFreeShippingHTML = '<div class="inner fs-yes"><i class="fa fa-check"></i>You\'ve unlocked free shipping!<i class="fa fa-truck fa-flip-horizontal"></i></div>';
        }else{
        	var qualifyFreeShippingHTML = '<div class="inner fs-no">You\'re <span class="diff">$'+qfsDiff.toFixed(2)+'</span> away from free shipping!</div>';
        }
    }else{
    	var qualifyFreeShippingHTML = '';
    }
    $('.free-shipping-qualify').html(qualifyFreeShippingHTML);
    
    $('.quadpay-widget-inner').attr('amount',data.totalPrice)
    var count_price = cart.total_price;
    count_price = 3000 - count_price;
    var count_price1 = 3000 - count_price;
    var count_rempPrice = 3000 - count_price1
    var count_rempPricenew = count_rempPrice / 100;
    var count_price3 = count_price1 / 100;
//     console.log(count_rempPricenew)
//     console.log(count_price3)

    if(cart.total_price >= 3000){
//       $('.FreeShipping__Message-success').removeClass('hide')
      $('.FreeShipping__Message').addClass('hide')
    } else if (cart.total_price < 3000){
      $('.shipping-price').text(count_rempPricenew);
//       $('.FreeShipping__Message-success').addClass('hide')
      $('.FreeShipping__Message').removeClass('hide')
    } 
    if(cart.total_price > 0){
      $('.empty-cart-menu').hide();
      $('.bottom-cart').fadeIn();
    }
    if (cart.item_count > 0) {
      $('.FreeShipping__Message-success').removeClass('hide')
    }
    
// console.log(cart.total_price);
    $cartContainer.append(template(data));

    cartCallback(cart);
  };

  const cartCallback = function(cart) {
    $body.removeClass('drawer--is-loading');
    $body.trigger('ajaxCart.afterCartLoad', cart);
    
     if (window.Shopify && Shopify.StorefrontExpressButtons) {
      Shopify.StorefrontExpressButtons.initialize();
    }   
    
  };

  

  const formOverride = function () {
    $formContainer.on('submit', function(evt) {
      evt.preventDefault();

      // Add class to be styled if desired
      $addToCart.removeClass('is-added').addClass('is-adding');

      // Remove any previous quantity errors
      $('.qty-error').remove();

      ShopifyAPI.addItemFromForm(evt.target, itemAddedCallback, itemErrorCallback);
    });
  };
  formOverride();

  document.querySelectorAll('#ProductSection-product-template .product-accordion').forEach((accordion) => {
    accordion.querySelectorAll('li .heading').forEach((heading) => {
      heading.addEventListener('click', () => {
        const content = heading.parentElement.querySelector('.content')
        if (content.style.display === 'block') {
          content.style.display = 'none'
          heading.querySelector('i').classList.remove('fa-minus')
          heading.querySelector('i').classList.add('fa-plus')
        } else {
          content.style.display = 'block'
          heading.querySelector('i').classList.remove('fa-plus')
          heading.querySelector('i').classList.add('fa-minus')
        }
      })
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
