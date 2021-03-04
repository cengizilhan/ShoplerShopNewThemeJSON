
/*
login html
register html

*/
// A $( document ).ready() block.
$(document).ready(function () {

    GetCategories();
    ProductsFillToBody();
    CategoryDetector();


    IndexOwlStarter();


})

//index.html onclick product//
$(document).on('click', '#ProductContainer', function(e) {
 var test3=$(this).attr('data-productid');
           console.log(test3);
    }) ;
   







function ProductsFillToBody() {

    $.get(ProductsUrl, function (arr) {
        $.each(arr, function (index, value) {
            //index,value//

            AddItemToIndex(value);
        });
    })

}



function ClearTheIndex() {
    $(".ProductsContainer").empty();
}

function AddItemToIndex(arr) {
    var imgArr = arr.image.split(",");
    var htmlitem = `<div class="ProductContainer" id="ProductContainer" data-productid="${arr.id}">
    <div class="owl-carousel owl-theme ProductOwlContainer">
    <div class="item mx-auto"><img  src="${imgArr[0]}"></div>
    <div class="item mx-auto"><img  src="${imgArr[1]}"></div>
    <div class="item mx-auto"><img  src="${imgArr[2]}"></div>
    </div>
    <hr class="mx-auto mt-5 mb-4">
    <div class="ProductName mt-4 mx-auto">${arr.title}</div>
    <div class="Stars mx-auto mt-3">
    <i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i
    class="bi bi-star-fill"></i><i class="bi bi-star-fill gray-star"></i>
    </div>
    <div class="Price mx-auto mt-3 mb-3"><span class="RedPrice">$ ${arr.price}</span> <span class="GrayPrice">$599</span>
    </div>
    </div>`;

    $(htmlitem).appendTo(".ProductsContainer");
    IndexOwlStarter();
}



function IndexOwlStarter() {
    $('.owl-carousel').owlCarousel({
        loop: true,
        margin: 35,
        nav: false,
        singleItem: true,
        touchDrag: true,
        mouseDrag: true,
        autoWidth: false,
        center: true,
        items: 1,

        responsive: {
            0: {
                items: 1,
                autoWidth: false
            },
            908: {
                items: 1,
                autoWidth: false
            },
            1236: {
                items: 1,
                autoWidth: false
            }
        }

    })
}

function CategoryFilter(CategoryId) {

    $.get(ProductsUrl, function (arr) {
        var FilteredArr = $(arr).filter(function (index, value) {
            return value.category_id == CategoryId;
        });
        ClearTheIndex();

        $.each(FilteredArr, function (index, value) {
            //index,value//
            AddItemToIndex(value);
        });
    })

}

function GetCategories() {

    $.get(CategoriesUrl, function (arr) {
        console.warn(arr);

        $.each(arr, function (index, value) {
            var htmlitem = ` 
            <li><a class="dropdown-item" data-catid="${value.ID}" href="${value.link}&">${value.CategoryName}</a></li>`;
            $(htmlitem).appendTo('#CategoryDropDown');
        });
    })

}

function CategoryDetector() {
    var QueryStr = getAllUrlParams().categoryid; // 'shirt-1-2 value'
    if (QueryStr != null) {
        CategoryFilter(QueryStr);
    }

}

//url query function//
function getAllUrlParams(url) {

    // get query string from url (optional) or window
    var queryString = url ? url.split('?')[1] : window.location.search.slice(1);

    // we'll store the parameters here
    var obj = {};

    // if query string exists
    if (queryString) {

        // stuff after # is not part of query string, so get rid of it
        queryString = queryString.split('#')[0];

        // split our query string into its component parts
        var arr = queryString.split('&');

        for (var i = 0; i < arr.length; i++) {
            // separate the keys and the values
            var a = arr[i].split('=');

            // set parameter name and value (use 'true' if empty)
            var paramName = a[0];
            var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];

            // (optional) keep case consistent
            paramName = paramName.toLowerCase();
            if (typeof paramValue === 'string') paramValue = paramValue.toLowerCase();

            // if the paramName ends with square brackets, e.g. colors[] or colors[2]
            if (paramName.match(/\[(\d+)?\]$/)) {

                // create key if it doesn't exist
                var key = paramName.replace(/\[(\d+)?\]/, '');
                if (!obj[key]) obj[key] = [];

                // if it's an indexed array e.g. colors[2]
                if (paramName.match(/\[\d+\]$/)) {
                    // get the index value and add the entry at the appropriate position
                    var index = /\[(\d+)\]/.exec(paramName)[1];
                    obj[key][index] = paramValue;
                } else {
                    // otherwise add the value to the end of the array
                    obj[key].push(paramValue);
                }
            } else {
                // we're dealing with a string
                if (!obj[paramName]) {
                    // if it doesn't exist, create property
                    obj[paramName] = paramValue;
                } else if (obj[paramName] && typeof obj[paramName] === 'string') {
                    // if property does exist and it's a string, convert it to an array
                    obj[paramName] = [obj[paramName]];
                    obj[paramName].push(paramValue);
                } else {
                    // otherwise add the property
                    obj[paramName].push(paramValue);
                }
            }
        }
    }

    return obj;
}