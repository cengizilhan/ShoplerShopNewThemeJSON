var style = "vertical";
var page = 1;
var pagionationFlag = false;
var minprice=0;
var CatFilter=-1;

$(document).ready(function () {
  style = "vertical";
  ShortBy(style, 1);

  GetCategories();
  priceRange();
  CategoriesFilter();

})

$(document).on('click', '#categoriesid div', function (e) {
  
  if($(this).hasClass('activecategory')) {
    $(this).removeClass('activecategory');
    CatFilter=-5;
    ShortBy(style, page, minprice, -5)
  }else {

    $(this).siblings().removeClass('activecategory not:this');
  
    $(this).addClass('activecategory');
    
    catid=$(this).attr('data-catid');
    CatFilter=catid;
  ShortBy(style, page, minprice, catid)
  }

 })

function CategoriesFilter() {
  $.get(CategoriesUrl, function (arr) { 

    $('#categoriesid').empty();
    for (i = 0; i < arr.length; i++) {
        
        var htmlitem = ` <div data-catid=${arr[i].ID}> <a href="#">
         <h6>${arr[i].CategoryName}</h6>
         </a> <span></span></div>`;
        $(htmlitem).appendTo('#categoriesid');
        
      }
     })
  }


$(document).on('change', '#ShortSelect', function (e) {
  var optionSelected = $("option:selected", this);
  var valueSelected = this.value;
  page = 1;
  $('.PaginationContainer a:eq(' + (page - 1) + ')').click();
  ShortBy(valueSelected, 1);


})

function PaginationButtonCreator(PageCount) {
  $('#paginationul').empty();
  var htmlitem;
  var i;
  for (i = 1; i < PageCount + 1; i++) {
    if (i == 1) {
      htmlitem = `<li class="page-item active" aria-current="page">
      <a class="page-link" id="Paginationa" href="#">${i}</a>
    </li>`;
    } else {
      htmlitem = `<li class="page-item" aria-current="page">
      <a class="page-link" id="Paginationa" href="#">${i}</a>
    </li>`;
    }
    $(htmlitem).appendTo('#paginationul');

  }

}

function priceRange(){
  //maxprice
  $.get(ProductsUrl, function (arr) { 
    arr.sort((a, b) => a.price < b.price ? 1 : -1);
    var maxv=arr[0].price;
    document.getElementById("customRange1").max = maxv;
  })

}

  

function ShortBy(shorttype, page, minprice, CatFilter) {
  $.get(ProductsUrl, function (arr) {


    switch (shorttype) {
      case "Price19":
        //küçükten büyüğe / low to high
        arr.sort((a, b) => a.price > b.price ? 1 : -1);
        break;
      case "Price91":
        //büyükten küçüğe / high to low
        arr.sort((a, b) => a.price < b.price ? 1 : -1);
        break;
      case "TitleAZ":
        arr.sort((a, b) => a.title > b.title ? 1 : -1);
        break;
      case "TitleZA":
        arr.sort((a, b) => a.title < b.title ? 1 : -1);
        
        break;
      default: arr.sort((a, b) => a.title > b.title ? 1 : -1);
    }

if (minprice>1)
{  
  var filteredArr=[];
  for (var i=0;i<arr.length;i++){
   arr[i].price>(minprice-1) ? filteredArr.push(arr[i]):false;      
  }
  arr=filteredArr;
}
if (CatFilter>=0)
{  

  var filteredArr=[];
  for (var i=0;i<arr.length;i++){
   arr[i].category_id==CatFilter ? filteredArr.push(arr[i]):false;      
  }
  arr=filteredArr;
  CatFilter=null;
}

    arr = Pagination(arr, page);


    FillProducts(arr, style);

  })
}

function Pagination(arr, page) {

  var currentpage = page;
  var recPerPage = 6;
  var totalRecords = arr.length;
  var records = arr;
  if (pagionationFlag == false) {
    var TotalPage = Math.ceil(parseFloat(arr.length) / parseFloat(recPerPage));
    PaginationButtonCreator(TotalPage);
    pagionationFlag = true;
  }
  var displayRecords;
  var displayRecordsIndex = Math.max(currentpage - 1, 0) * recPerPage;
  endRec = (displayRecordsIndex) + recPerPage;
  displayRecords = records.slice(displayRecordsIndex, endRec);
  return displayRecords;
}

$(document).on('click', '#Paginationa', function (e) {
  $('#paginationul #Paginationa').not(this).parent().removeClass('active');
  $(this).parent().addClass('active');
  var page = $(this).text();
  ShortBy(style, page);

})

$(document).on('click', '#FillVertical', function (e) {
  style = "vertical";
  var ShortBySelected = $("#ShortSelect option:selected").val();
  ShortBy(ShortBySelected, 1, minprice,CatFilter);
  $("select option:selected").text();
  $(this).addClass('activeBtn');
  $('#FillHorizontal').removeClass('activeBtn');
});
$(document).on('click', '#FillHorizontal', function (e) {
  style = "horizontal";
  var ShortBySelected = $("#ShortSelect option:selected").val();
  ShortBy(ShortBySelected, 1, minprice,CatFilter);
  $(this).addClass('activeBtn');
  $('#FillVertical').removeClass('activeBtn');
});


function Emptybody() {
  $('.ProductsContainer').empty();
}


function FillProducts(arr, style) {
  Emptybody();
  $.each(arr, function (index, value) {
    var imgArr = value.image.split(",");
    var htmlitemHorizontal = ` <div id="ProductCont" class="ProductLandContainer d-lg-flex flex-lg-row d-sm-flex flex-sm-column mt-5 pt-1">
    <div id="owlLandCont">
      <div class="owl-carousel owl-theme ProductOwlContainer">
        <div class="item mx-auto"><img class="img-fluid" src="${imgArr[0]}"></div>
        <div class="item mx-auto"><img class="img-fluid" src="${imgArr[1]}"></div>
        <div class="item mx-auto"><img class="img-fluid" src="${imgArr[2]}"></div>
      </div>
    </div>
    <div class="secondCont">

      <div class="ProductName ">${value.title}</div>
      <div class="d-flex mt-3">
        <div class="Stars  mt-3">
          <i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i
            class="bi bi-star-fill"></i><i class="bi bi-star-fill gray-star"></i>
        </div>
        <span class="reviews">0 reviews</span>
        <a href="#"><span class="submit">Submit a review</span></a>
      </div>
      <div><hr></div>
      <div>
        <div class="Price mt-3 mb-3"><span class="RedPrice">$${value.price}</span> <span class="GrayPrice">$599</span>
        </div>
      </div>
      <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate illum architecto sequi, doloremque fugit temporibus ullam provident </div>
      <div class="mt-3"><button class="AddCart" id="AddToCartBtn" data-productid="2"><i class="bi bi-cart3"></i> Add To Cart</button>
        <button class="AddCart"><i class="bi bi-heart"></i></button></div>

    </div>
    
  </div>`;
    var htmlitemVertical = `  <div id="ProductCont" class="ProductContainer ProductVertical">

  <div class="owl-carousel owl-theme ProductOwlContainer">
    <div class="item mx-auto"><img class="img-fluid" src="${imgArr[0]}"></div>
    <div class="item mx-auto"><img class="img-fluid" src="${imgArr[1]}"></div>
    <div class="item mx-auto"><img class="img-fluid" src="${imgArr[2]}"></div>
  </div>
  <hr class="mx-auto mt-5 mb-4">
  <div class="ProductName mt-4 mx-auto">${value.title}</div>
  <div class="Stars mx-auto mt-3">
    <i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i
      class="bi bi-star-fill"></i><i class="bi bi-star-fill gray-star"></i>
  </div>
  <div class="Price mx-auto mt-3 mb-3"><span class="RedPrice">$${value.price}</span> <span
      class="GrayPrice">$599</span>
  </div>
</div>
`;
    style == "vertical" ? $(htmlitemVertical).appendTo('.ProductsContainer') : $(htmlitemHorizontal).appendTo('.ProductsContainer');
  });
  owlstarter();

}


function owlstarter() {

  $('.owl-carousel').owlCarousel({
    loop: true,
    margin: 45,
    nav: false,
    singleItem: true,
    touchDrag: true,
    mouseDrag: true,
    autoWidth: true,
    center: true,
    items: 1
  })

}