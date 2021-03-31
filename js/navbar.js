$(document).ready(function () {
    PriceFill();
});

$(document).on('keyup', '#SearchBx', function () {
    var timeout = null
    clearTimeout(timeout)
    timeout = setTimeout(function () {
        var val = $("#SearchBx").val();
        SearchBox(val);
    }, 900)
});



 SearchBox=(querystr)=> {

    var arr = ReadCart();
    var regex = new RegExp(querystr, "i");
    filteredSearch = arr.filter(x => x.brand.match(regex) || x.product_code.match(regex) || x.title.match(regex));

    var htmlitemsum = "";

    $.each(filteredSearch, function (index, value) {

        htmlitemsum += `
        <a href="./product_detail.html?productdetail=${value.id}&"> <b>${value.brand}</b>  ${value.title} </a><br>`;
    });
    $('#SearchResults').empty();
    var emptyMsg = `Sonuç bulunamadı.`;
    var GoResults = ` <a href="./search.html?search=${querystr}">Sonuçlara gitmek için tıklayın.</a><br>`;
    (htmlitemsum == "") ? $(emptyMsg).appendTo('#SearchResults') : $(htmlitemsum + GoResults).appendTo('#SearchResults');
    $('#SearchResults').css('display', 'block');
}


 PriceFill=()=> {
    var price = TotalPriceCalculator();
    $('.Amount').text('$' + price);

    function PieceFiller() {
        var piece = TotalPieceCalculator();
        $('#pieceHolder').text(piece);

    } PieceFiller();


}

