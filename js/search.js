$(document).ready(function () {

    GetCategories();
    CategoryDetector();
    IndexOwlStarter();
    QueryPage();
})

QueryPage = () => {
    var QueryStr = getAllUrlParams().search;
    QueryStr != null ? QueryFilter(QueryStr) : false;


    QueryFilter = (querystr) => {
        $("#bestSeller").text(querystr + " results");
        $("#ProductsContainer").empty();
        var arr = ReadCart();
        var regex = new RegExp(querystr, "i");
        filteredSearch = arr.filter(x => x.brand.match(regex) || x.product_code.match(regex) || x.title.match(regex));

        var htmlitemsum = "";

        $.each(filteredSearch, function (index, value) {
            AddItemToIndex(value);
        })


    }


}

AddItemToIndex = (arr) => {
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



//index.html onclick product//
$(document).on('click', '#ProductContainer', function (e) {
    var id = $(this).attr('data-productid');
    //$(location).attr('href', './product_detail.html?productdetail='+id+'&')
    window.location.href = './product_detail.html?productdetail=' + id + '&';

});

$(document).on('keyup', '#SearchBx2', function () {
    var timeout = null
    clearTimeout(timeout)

    timeout = setTimeout(function () {
        var val = $("#SearchBx1").val();
        SearchBox2(val);
    }, 900)
});

SearchBox2 = (querystr) => {

    var arr = ReadCart();
    var regex = new RegExp(querystr, "i");
    filteredSearch = arr.filter(x => x.brand.match(regex) || x.product_code.match(regex) || x.title.match(regex));

    var htmlitemsum = "";

    $.each(filteredSearch, function (index, value) {

        htmlitemsum += `
        <a href="./product_detail.html?productdetail=${value.id}&"> <b>${value.brand}</b>  ${value.title} </a><br>`;
    });
    $('#SearchResults2').empty();
    var emptyMsg = `Sonuç bulunamadı.`;
    var GoResults = ` <a href="./index.html?search=${querystr}">Sonuçlara gitmek için tıklayın.</a><br>`;
    (htmlitemsum == "") ? $(emptyMsg).appendTo('#SearchResults2') : $(htmlitemsum + GoResults).appendTo('#SearchResults2');
    $('#SearchResults2').css('display', 'block');
}


CategoryDetector = () => {
    var QueryStr = getAllUrlParams().categoryid; // 'shirt-1-2 value'
    if (QueryStr != null) {
        CategoryFilter(QueryStr);
    }

}



ClearTheIndex = () => {
    $(".ProductsContainer").empty();
}

ProductsFillToBody = () => {

    $.get(ProductsUrl, function (arr) {
        $.each(arr, function (index, value) {
            //index,value//

            AddItemToIndex(value);
        });
    })

}


