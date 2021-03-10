$(document).ready(function () {


    GetCategories();

    FillCarts();


})

$(document).on('click', '#ProductRemove', function (e) {
    var id = $(this).attr('data-productid');
    //$(location).attr('href', './product_detail.html?productdetail='+id+'&')
    RemoveCart(id);
    

    emptyCarts();
    FillCarts();

});
$(document).on('click', '#IncreaseBtn', function (e) {

 
    var val = $(this).parent().attr('data-productid');
    CartCountChanger(val, "+");
    FillCarts();

});

$(document).on('click', '#DecreaseBtn', function (e) {


    var val = $(this).parent().attr('data-productid');
    CartCountChanger(val, "-");
    FillCarts();


});

function emptyCarts() {
    $("#tableOne").empty();
    var tablehader = `  <tr>
   <th>
     <span></span>
   </th>
   <th><span>PRODUCT</span></th>
   <th></th>
   <th><span>PRICE</span></th>
   <th><span>QTY</span></th>
   <th><span>UNIT PRICE</span></th>
 </tr>
`;
    $(tablehader).appendTo("#tableOne");
}

function FillCarts() {
    emptyCarts();
    var arr = ReadCart();

    $.each(arr, function (index, value) {

        var imgArr = value.image.split(",");
        var totalprice = parseInt(value.price) * parseInt(value.basket_piece);

        var htmlitem = ` <tr>
        <td valign="middle">
            <button data-productid="${value.id}" id="ProductRemove"><i class="bi bi-x"></i></button>
        </td>
        <td valign="middle"><img class="img-fluid" src="${imgArr[0]}"></td>
            <td valign="middle">${value.title}</td>
            <td valign="middle">$ ${totalprice}</td>
            <td valign="middle">
            <div data-productid="${value.id}"  class="RangeChanger"><button id="DecreaseBtn" ><i class="bi bi-dash"></i></button> <span
            class="p-md-3 p-xl-3" id="ProductCountValue">${value.basket_piece}</span><button id="IncreaseBtn" ><i class="bi bi-plus"></i></button> </div>
            </td>
            <td valign="middle">$ ${value.price}</td>
    </tr>`;

        $(htmlitem).appendTo("#tableOne");

    })

    var totalprice = TotalPriceCalculator();

    $("#totalcount").text(totalprice);


}