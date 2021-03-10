$(document).ready(function () {

    GetCategories();
    ProductsFillToBody();
    CategoryDetector();


    IndexOwlStarter();


})

//index.html onclick product//
$(document).on('click', '#ProductContainer', function (e) {
    var id = $(this).attr('data-productid');
    //$(location).attr('href', './product_detail.html?productdetail='+id+'&')
    window.location.href =  './product_detail.html?productdetail='+id+'&';
    
});


function CategoryDetector() {
    var QueryStr = getAllUrlParams().categoryid; // 'shirt-1-2 value'
    if (QueryStr != null) {
        CategoryFilter(QueryStr);
    }

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



function ClearTheIndex() {
    $(".ProductsContainer").empty();
}

function ProductsFillToBody() {

    $.get(ProductsUrl, function (arr) {
        $.each(arr, function (index, value) {
            //index,value//

            AddItemToIndex(value);
        });
    })

}


