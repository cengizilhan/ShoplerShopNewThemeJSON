var shoppingCart = (() => {

    shoppingCartModel = {
        userId: null,
        selectedCargoCompanyId: null,
        cargoCost: 0,
        paymentTypeId: null,
        selectedBillingAddressId: null,
        selectedShippingAressId: null,
        orderNote: '',
        discountCode: '',
        discountDescription: '',
        requestIP: '',
        subTotal: 0,
        totalTaxAmount: 0,
        totalAmount: 0,
        discountAmount: 0,
        installmentRate: 0,
        installmentRateAmount: 0,
        installmentCount: 0,
        items: [],
        paymentInfo: null,
        paymentSurchargeDescription: '',
        paymentSurchargeAmount: 0
    };

    paymentTypeList = [];
    cardInstallmentRates = null;
    cargoCompanyList = [];

    //#region shopping cart methods

    //service functions
    getItems = () => {

        var defer = $.Deferred();
        const userIdForChart = getUserId();
        $.get("/store/shopping-cart?userId=" + userIdForChart, function (resp) {
            if (resp.success === false) {
                shoppingCartModel.items = [];
            } else {
                shoppingCartModel.items = resp.cart.cartItems;
                shoppingCartModel.subTotal = resp.cart.subTotal;
                shoppingCartModel.totalAmount = resp.cart.totalAmount;
                shoppingCartModel.totalTaxAmount = resp.cart.totalTaxAmount;
                shoppingCartModel.userId = resp.userId;
                shoppingCartModel.isAuthenticated = resp.isAuthenticated;
            }
            defer.resolve(shoppingCartModel.items);
        });
        return defer.promise();
    };

    // helper functions 
    setUserId = (userIdToRegister) => {
        localStorage.setItem("uid", userIdToRegister);
    }

    getUserId = () => {
        return localStorage.getItem("uid");
    }

    removeUserId = () => {
        localStorage.removeItem("uid");
    }

    getItemHTMLTrTemplate = (item) => {

        let variantTemplate = "";
        if (item.variantId !== undefined && item.variantId !== null && item.variantId.length > 0)
            variantTemplate = `<br><b>${item.variantName}</b>`;

        var itemTemplate = `<div class="cart-item">
                <div class="row align-items-center no-gutters">
                    <div class="col-md-2 col-3">
                        <div class="cart-product-image">
                            <a href="${item.productUrl}"><img class="img-fluid" src="${item.defaultImagePath}" /></a>
                        </div>
                    </div> 

                    <div class="col-md-6 col-lg-8 col-6 pl-xl-4">
                        <div class="cart-product-name">${item.name} ${variantTemplate}</div>
                        <div class="cart-product-price">${item.price} <span class="currency">${item.currencyType}</span></div>
                    </div>
                    <div class="col-md-4 col-lg-2 col-3">

                        <div class="quantity-container d-flex justify-content-end align-items-center">
                            <a class="delete-item" onclick="deleteItem('${item.id}','${item.variantId}')" title="@SharedLocalizer["Remove"]"><i class="ti-trash"></i></a>

                            <div class="cart-product-quantity">
                                <button class="quantity-plus" onclick="increaseQuantity('${item.id}',${item.quantity},'${item.variantId}')"><i class="fas fa-plus"></i></button>
                                <input type="text" id="count" value="${item.quantity}" step="1" min="1" />
                                <button class="quantity-minus" onclick="descreaseQuantity('${item.id}',${item.quantity},'${item.variantId}')"><i class="fas fa-minus"></i></button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>`;
        return itemTemplate;
    };


    refreshCartItemCount = () => {
        const userIdForChart = localStorage.getItem("uid");
        $.get("/store/shopping-cart/count?userId=" + userIdForChart, function (resp) {
            let itemCount = 0;
            if (resp.success) {
                itemCount = resp.itemCount;
            }
            $(".cartItemCount").html(itemCount);
        });
    };
    //#endregion


    //#region cargo methods

    getCargoSurchargeByCargoId = (id) => {

        const existCargo = cargoCompanyList.find(x => x.id === id);
        if (existCargo === null) {
            return 0;
        }
        if (getSubTotal() >= existCargo.freeCargoSubLimit) {
            return 0;
        } else if (existCargo.defaultPriceActive) {
            return existCargo.defaultPrice;
        } else {
            let totalDesi = 0;
            for (let i = 0; i < shoppingCartModel.items.length; i++) {
                totalDesi += shoppingCartModel.items[i].desi;
            }
            const eCargoDesi = existCargo.eCargoDesi.find(x => totalDesi >= x.min && totalDesi <= x.max);
            if (eCargoDesi !== null && eCargoDesi !== undefined) {
                return eCargoDesi.price;
            }
        }
        return 0;
    }

    //#endregion


    //#region price calculations methods

    getSubTotal = () => {
        //items = getItems();
        return shoppingCartModel.subTotal;
    }
    getTotalTaxAmount = () => {
        return shoppingCartModel.totalTaxAmount;
    }

    //#endregion


    //#region payment methods

    setCardInstallmentRates = () => {
        $.get("/paytr-installment-rates", function (resp) {
            if (resp.success) {
                var data = JSON.parse(resp.data)
                cardInstallmentRates = data.oranlar;
            }
        });
    }

    getCardInstallmentRate = (bankName, installmentCount) => {
        if (installmentCount >= 2)
            return cardInstallmentRates[bankName]['taksit_' + installmentCount];
        return 0;
    }

    //#endregion


    //#region order methods

    checkCreditCardFormIsValid = () => {
        return $("#cc-name").val().length > 0 && $("#cc-number").val().length > 0 && $("#cc-expiration").val().length > 0 && $("#cc-cvv").val().length > 0;
    }


    //#endregion


    showToastMessage = (title, message, toast_module_name, messageType = "success") => {
        $(`.${toast_module_name}-toast #toast_title`).html(title);
        $(`.${toast_module_name}-toast #toast-message`).html(message);
        $(`.${toast_module_name}-toast`).toast('dispose');
        $(`.${toast_module_name}-toast`).toast('show');
    }


    return {
        // shopping cart
        addToCart: (cartItem) => {

            var defer = $.Deferred();

            var pId = cartItem.productId
            var quantity = cartItem.quantity;

            const userIdForChart = getUserId();
            $.post("/store/addToCart", { productId: pId, quantity: quantity, userId: userIdForChart, variantId: cartItem.variantId }, function (resp) {
                if (resp.success) {
                    if (resp.isAuthenticated === false) {
                        setUserId(resp.userId);
                    }
                    shoppingCartModel.userId = resp.userId;
                    refreshCartItemCount();
                    defer.resolve(true);
                    showToastMessage("Sepetim", "Ürün sepetinize eklendi.", "shoppingcart");
                } else {
                    showToastMessage("Sepete Ekleme Hatası", resp.userMessage, "shoppingcart");
                    defer.resolve(false);
                }

            });
            return defer.promise();
        },
        removeFromCart: (productId, variantId) => {
            var defer = $.Deferred();

            const userIdForChart = getUserId();
            $.post("store/removeFromCart", { productId: productId, userId: userIdForChart, variantId: variantId }, function (resp) {
                defer.resolve(resp);
                refreshCartItemCount();
                showToastMessage("Sepetim", "Ürün sepetinizden silindi.", "shoppingcart");
            });
            return defer.promise();
        },
        getItemHTMLRows: () => {
            var itemsHTML = '';
            var defer = $.Deferred();
            $.when(getItems()).then(function (items) {
                for (var i = 0; i < items.length; i++) {
                    itemsHTML += getItemHTMLTrTemplate(items[i]);
                }
                defer.resolve(itemsHTML)
            });

            return defer.promise();
        },
        getTotalAmount: () => {
            shoppingCartModel.totalAmount = getSubTotal() + getTotalTaxAmount() + shoppingCartModel.cargoCost + shoppingCartModel.installmentRateAmount + shoppingCartModel.paymentSurchargeAmount;
            return shoppingCartModel.totalAmount;
        },
        updateCartItemQuantity: (productId, quantity, variantId) => {
            var defer = $.Deferred();
            const userIdForChart = localStorage.getItem("uid");

            $.post("/store/shopping-cart/update-quantity", { userId: userIdForChart, productId: productId, quantity: quantity, variantId: variantId }, function (resp) {
                refreshCartItemCount();
                showToastMessage("Sepetim", "Sepetteki ürün adedi güncellendi.", "shoppingcart");
                defer.resolve(resp);
            });
            return defer.promise();
        },
        getTotalTaxAmount: () => getTotalTaxAmount(),
        getItems: () => getItems(),
        getSubTotalAmount: () => getSubTotal(),
        refreshCartItemCount: () => refreshCartItemCount(),
        // user 
        getUserAddresses: () => {
            var defer = $.Deferred();

            $.get("/store/user-address", function (resp) {
                defer.resolve(resp);
            });

            return defer.promise();
        },
        setSelectedAddressByType: (id, addressType) => {
            var defer = $.Deferred();
            $.post("/store/user-address/set-default", { id: id, type: addressType }, function (resp) {
                if (addressType === 'billing')
                    shoppingCartModel.selectedBillingAddressId = id;
                else
                    shoppingCartModel.selectedShippingAressId = id;
                defer.resolve(resp);
            });
            return defer.promise();
        },
        getCities: () => {
            var defer = $.Deferred();
            $.get("/store/cities", function (resp) {
                defer.resolve(resp);
            });
            return defer.promise();

        },
        getTownsByCityId: (cityId) => {
            var defer = $.Deferred();
            $.get("/store/towns?cityId=" + cityId, function (resp) {
                defer.resolve(resp);
            });
            return defer.promise();
        },
        saveAddress: (addressItem, isDefault) => {
            var defer = $.Deferred();
            $.post("/store/user-address/save", { userAddress: addressItem, isDefault: isDefault }, function (resp) {
                defer.resolve(resp);
            });
            return defer.promise();
        },
        removeAddress: (addressId) => {
            var defer = $.Deferred();
            $.post("/store/user-address/delete", { id: addressId }, function (resp) {
                defer.resolve(resp);
            });
            return defer.promise();
        },
        getUserAddressById: (id) => {
            var defer = $.Deferred();
            $.get("/store/user-address/" + id, function (resp) {
                defer.resolve(resp);
            });
            return defer.promise();
        },

        // cargo
        getCargoCompanies: () => {
            var defer = $.Deferred();
            $.get("/store/cargo-companies", function (resp) {
                cargoCompanyList = resp.cargoCompanyList;
                defer.resolve(resp);
            });
            return defer.promise();
        },
        setSelectedCargoCompany: (id) => {
            shoppingCartModel.selectedCargoCompanyId = id;
            shoppingCartModel.cargoCost = getCargoSurchargeByCargoId(id);
        },
        getCargoSurcharge: () => {
            if (shoppingCartModel.selectedCargoCompanyId !== null) {
                shoppingCartModel.cargoCost = getCargoSurchargeByCargoId(shoppingCartModel.selectedCargoCompanyId);
            }
            return shoppingCartModel.cargoCost;
        },
        getSelectedCargoCompanyId: () => {
            return shoppingCartModel.selectedCargoCompanyId;
        },
        getCargoSurchargeByCargoId: (id) => getCargoSurchargeByCargoId(id),

        // payment
        proceedOrder: () => {

            removeUserId();
            if (shoppingCartModel.PaymentType === "PayTR" && !checkCreditCardFormIsValid()) {

                $('.creditCardForm').find(":invalid").first().focus();
                swal({
                    title: "Eksik Alan!",
                    text: "Lütfen 'Kredi Kartı Bilgileri' bölümündeki tüm gerekli alanları doldurunuz!",
                    icon: "warning",
                    type: 'warning',
                    button: "Tamam",
                });
                return;
            }

            if (shoppingCartModel.paymentTypeId === null) {
                swal({
                    title: "Eksik Alan!",
                    text: "Lütfen ödeme seçimini yapınız!",
                    icon: "error",
                    button: "Tamam",
                });
                return;
            }
            if (shoppingCartModel.selectedBillingAddressId === null || shoppingCartModel.selectedBillingAddressId === undefined) {
                swal({
                    title: "Eksik Alan - Adres",
                    text: "Fatura adresi ekleyiniz!",
                    icon: "error",
                    button: "Tamam",
                });
                return;
            }
            if (shoppingCartModel.selectedShippingAressId === null || shoppingCartModel.selectedShippingAressId === undefined) {
                swal({
                    title: "Eksik Alan - Adres",
                    text: "Teslimat adresi ekleyiniz!",
                    icon: "error",
                    button: "Tamam",
                });
                return;
            }



            shoppingCartModel.orderNote = $("#order-note").val();
            if (shoppingCartModel.PaymentType === "PayTR") {
                shoppingCartModel.paymentInfo = {
                    cardOwner: $("#cc-name").val(),
                    cardNumber: $("#cc-number").val().split('-').join(''),
                    expiryMonth: $("#cc-expiration").val().split('/')[0],
                    expiryYear: $("#cc-expiration").val().split('/')[1],
                    cvv: $("#cc-cvv").val(),
                    bankName: $("#card-bank-name").val(),
                    installmentCount: $('#installment-count').val(),
                    store_card: ($('#cc-store_card').is(':checked') ? 1 : 0),
                };

                if ($("#card-bank-name").val().length < 1) {
                    swal({
                        title: "Tanımsız Kart!",
                        text: "Lütfen kart bilgilerinizi kontrol edip tekrar deneyiniz.",
                        icon: "warning",
                        type: 'warning',
                        button: "Tamam",
                    });
                    return;
                }

                if (shoppingCartModel.paymentInfo.cardOwner.length < 1 ||
                    shoppingCartModel.paymentInfo.cardNumber.length < 1 ||
                    shoppingCartModel.paymentInfo.expiryMonth === undefined || shoppingCartModel.paymentInfo.expiryMonth.length < 1 ||
                    shoppingCartModel.paymentInfo.expiryYear === undefined || shoppingCartModel.paymentInfo.expiryYear.length < 1 ||
                    shoppingCartModel.paymentInfo.cvv.length < 1) {
                    swal({
                        title: "Eksik Alan - Kart Bilgileri ",
                        text: "Lütfen kart bilgilerinizi eksiksiz giriniz!",
                        icon: "warning",
                        type: 'warning',
                        button: "Tamam",
                    });
                    return;
                }
                if (shoppingCartModel.paymentInfo.cardNumber.length !== 16) {
                    swal({
                        title: "Eksik Alan - Kart Bilgileri ",
                        text: "Kart numarası 16 hane olmalıdır. Lütfen kontrol edip tekrar deneyiniz.",
                        icon: "warning",
                        type: 'warning',
                        button: "Tamam",
                    });
                    return;
                }
                if (shoppingCartModel.paymentInfo.cvv.length !== 3) {
                    swal({
                        title: "Eksik Alan - Kart Bilgileri ",
                        text: "Kart güvenlik numarası(cvv) 3 haneli olmalıdır. Lütfen kontrol edip tekrar deneyiniz.",
                        icon: "warning",
                        type: 'warning',
                        button: "Tamam",
                    });
                    return;
                }

                if (shoppingCartModel.paymentInfo.expiryYear.length !== 2 || shoppingCartModel.paymentInfo.expiryMonth.length !== 2) {
                    swal({
                        title: "Eksik Alan - Kart Bilgileri ",
                        text: "Kart ay ve yıl alanı 2 hane ay ve 2 hane yıl olacak şekilde girilmelidir. Lütfen kontrol edip tekrar deneyiniz.",
                        icon: "warning",
                        type: 'warning',
                        button: "Tamam",
                    });
                    return;
                }

            }

            $("#proceed-order").prop('disabled', true);
            $("#proceed-order").html("İşlem yapılıyor...");
            $("#proceed-order").addClass('processing-order');
            $.post("/create-order", shoppingCartModel, function (resp) {
                if (resp.success) {
                    window.location.href = resp.redirectUrl;
                } else {
                    swal({
                        title: "Ödeme Başarısız!",
                        text: "Bilgilerinizi kontrol ederek yeniden deneyiniz.",
                        icon: "error",
                        type: 'error',
                        button: "Tamam",
                    });

                }
            });
        },
        setPaymentTypeSelection: (id, paymentType, paymentDescription) => {
            shoppingCartModel.paymentTypeId = id;
            shoppingCartModel.PaymentType = paymentType;
            shoppingCartModel.PaymentDescription = paymentDescription;
            shoppingCartModel.paymentSurchargeDescription = '';
            shoppingCartModel.paymentSurchargeAmount = 0;
            if (paymentType === "PayTR") {
                setCardInstallmentRates();
            } else {
                const paymentTypeObj = paymentTypeList.find(x => x.id === id);
                if (paymentTypeObj !== null && paymentTypeObj !== undefined) {
                    if (paymentTypeObj.priceIsAdding !== null && paymentTypeObj.priceIsAdding === true) {
                        shoppingCartModel.paymentSurchargeDescription = `${paymentDescription} Masrafı`;
                        shoppingCartModel.paymentSurchargeAmount = paymentTypeObj.priceValue;
                    } else {
                        shoppingCartModel.discountDescription = `${paymentDescription} İndirimi`;
                        shoppingCartModel.discountAmount = paymentTypeObj.priceValue;
                    }
                }
            }



        },
        getInstallmentRateAmount: () => {
            if (shoppingCartModel.installmentRateAmount && shoppingCartModel.installmentRateAmount > 0)
                return shoppingCartModel.installmentRateAmount;
            else
                return 0;

        },
        setCardInstallment: (bankName, installmentCount) => {
            var installmentRate = getCardInstallmentRate(bankName, installmentCount);
            shoppingCartModel.installmentCount = installmentCount;
            shoppingCartModel.installmentRate = installmentRate;
            var subTotal = getSubTotal();
            shoppingCartModel.installmentRateAmount = parseFloat((subTotal * (shoppingCartModel.installmentRate / 100)).toFixed(2));
        },
        getPaymentTypeList: () => {
            var defer = $.Deferred();
            $.get("/store/payment-types", function (resp) {
                paymentTypeList = resp.paymentTypeList;
                defer.resolve(resp);
            });
            return defer.promise();
        },
        ContinueToPaymentWithEmail: (email) => {
            var email_regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;
            if (!email_regex.test(email)) {

                swal({
                    title: "Geçersiz E-posta!",
                    text: "Üyeliksiz alışverişe devam etmek için lütfen geçerli bir eposta adresi giriniz!",
                    type: 'warning',
                    button: "Tamam",
                });
                return;
            }
            var defer = $.Deferred();
            const userIdForChart = getUserId();
            $.post("/store/continue-without-register", { email: email, userId: userIdForChart }, function (resp) {
                defer.resolve(resp);
            });
            return defer.promise();
        },
        getPayTRBanksAndInstallmentRates: () => {
            var defer = $.Deferred();
            $.get("/paytr-installment-rates", function (resp) {
                defer.resolve(resp);

            });
            return defer.promise();
        },
        addToFavorites: (productId) => {

            var defer = $.Deferred();
            $.post("/store/favorites", { productId: productId }, function (resp) {
                defer.resolve(resp);
            });

            return defer.promise();

        },
        removeFromFavorites: (productId) => {

            var defer = $.Deferred();
            $.post("/store/favorites/delete", { productId: productId }, function (resp) {
                defer.resolve(resp);
            });

            return defer.promise();

        },
        showMessage: showToastMessage
    };

})();



function addToMyFavorites(productId) {

    $.when(shoppingCart.addToFavorites(productId)).then(resp => {

        if (resp.success) {
            refreshFavoriteItemCount();

            shoppingCart.showMessage("Favorilerim", resp.userMessage, "favorite");
        } else {
            if (resp.authorized) {
                shoppingCart.showMessage("Favorilerime Ekleme Hatası", resp.userMessage, "favorite");

            } else {
                shoppingCart.showMessage("Favorilerime Ekleme", "Favori işlemleri için üye girişi yapmanız gerekmektedir.", "favorite");
            }
        }

    });

}






function refreshFavoriteItemCount() {
    $.get("/store/favorites/count", function (resp) {
        let itemCount = 0;
        if (resp.success) {
            itemCount = resp.itemCount;
        }
        $(".eFavoritesCount").html(itemCount);
    });
}




