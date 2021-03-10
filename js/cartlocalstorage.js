
function AddCart(json, piece) {
    if (localStorage.getItem(Cart) === null) {
        json.basket_piece = piece;
        localStorage.setItem(Cart, JSON.stringify([json]));
    }
    else {
        var arr = ReadCart();
        var flag = false;
        $.each(arr, function (index, value) {
            if (value.id == json.id) {
                arr[index].basket_piece = parseInt(arr[index].basket_piece) + parseInt(piece);
                localStorage.setItem(Cart, JSON.stringify(arr));
                flag = true;
            }
        })
        if (flag == false) {
            json.basket_piece = piece;
            arr.push(json);
            localStorage.setItem(Cart, JSON.stringify(arr));
        }
    }
}




function RemoveCart(itemid) {
    var arr = ReadCart();
    var flag;
    $.each(arr, function (index, value) {
        if (value.id == itemid) {
            flag = index;
            
        }
       
    })
    
    
    arr.splice(flag,1);
    

    localStorage.setItem(Cart, JSON.stringify(arr));

}

function CartCountChanger(itemid, operation) {
    var arr = ReadCart();
    var flag;
    $.each(arr, function (index, value) {
        if (value.id == itemid) {
            if (value.basket_piece == 1) {
                operation == "+" ? ++value.basket_piece : false;
            } else {
                operation == "-" ? --value.basket_piece : false;
                operation == "+" ? ++value.basket_piece : false;

            }

        }
    })

    localStorage.setItem(Cart, JSON.stringify(arr));

}


function TotalPriceCalculator() {
    var arr = ReadCart();
    var counter = 0;
    var totalcount = 0;
    $.each(arr, function (index, value) {
        counter = parseInt(value.price) * parseInt(value.basket_piece);
        totalcount = counter + totalcount;
    })

return totalcount;
}

function ReadCart() {
    var arr = JSON.parse(localStorage.getItem(Cart));
    return arr;
}

