$(document).ready(function () {


  ProductDetector();

  collapseProductDetail();
  GetCategories();


})
//index.html onclick product//
$(document).on('click', '#AddToCartBtn', function (e) {
  
  var id = $(this).attr('data-productid');
  var piece=$('#ProductCountValue').text();
  AddtoBasket(id, piece);

});
$(document).on('click', '#IncreaseBtn', function (e) {
var val=$('#ProductCountValue').text();
$('#ProductCountValue').text(++val);


});
$(document).on('click', '#DecreaseBtn', function (e) {
  var val=$('#ProductCountValue').text();
  val ==1 ? true:$('#ProductCountValue').text(--val);
  
  });
  
function AddtoBasket(itemid, piece) {
  $.get(ProductsUrl, function (arr) {
    $.each(arr, function (index, value) {
      if (value.id == itemid) {
        AddCart(value,piece);
      }


    });
  })  
}

function collapseProductDetail() {
  $('#Collapse1').on('click', function (e) {
    var coll1 = $('#CollapseDiv1');
    var coll2 = $('#CollapseDiv2');
    var ColBtn2 = $("#Collapse2");
    var ColBtn1 = $("#Collapse1");
    coll2.addClass("disable");
    ColBtn1.addClass("CollBtnHr");
    ColBtn2.removeClass("CollBtnHr");
    coll1.removeClass("disable");


  })
  $('#Collapse2').on('click', function (e) {
    var coll1 = $('#CollapseDiv1');
    var coll2 = $('#CollapseDiv2');
    var ColBtn1 = $("#Collapse1");
    var ColBtn2 = $("#Collapse2");
    coll1.addClass("disable");
    ColBtn2.addClass("CollBtnHr");
    ColBtn1.removeClass("CollBtnHr");
    coll2.removeClass("disable");

  })

}

function ProductDetector() {
  var QueryStr = getAllUrlParams().productdetail;
  if (QueryStr != null) {
    ProductDetailFill(QueryStr);

    IndexOwlStarter();
  }

}



function ProductDetailFill(productid) {

  $.get(ProductsUrl, function (arr) {
    $.each(arr, function (index, value) {
      if (value.id == productid) {
        var imgArr = value.image.split(",");
        BreadCrumber(value.category_id, value.title);
        var htmlitem = `  <div class="TopRow d-lg-flex flex-lg-row d-sm-flex flex-sm-column ">
            <div class="ProductImgCont" data-productid="${value.id}">
              <div class="ImgVerticalCont">
                <div><img class="img-fluid" src="${imgArr[0]}"></div>
                <div class="smallimgs d-lg-flex justify-content-sm-between 
                d-sm-flex justify-content-lg-evenly
                pt-3
                ">
                  <img class="smallimgs" src="${imgArr[0]}">
                  <img class="smallimgs" src="${imgArr[1]}">
                  <img class="smallimgs" src="${imgArr[2]}">
                </div>
              </div>
            </div>
            <div class="ProductRightDetails d-flex flex-column ">
              <div>
                <h4>${value.title}</h4>
              </div>
              <div class="d-lg-flex flex-lg-row d-sm-flex flex-sm-column  SecondLine">
                <div class="Stars">
                  <i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i
                    class="bi bi-star-fill"></i><i class="bi bi-star-fill gray-star"></i>
                </div>
                <div class="reviews">0 reviews</div>
                <div><a href="#">Submit a review</a></div>
  
              </div>
              <div>
                <hr>
              </div>
              <div class="Price"><span class="RedPrice">$${value.price}</span> <span class="GrayPrice">$599</span> </div>
              <div class="d-flex minicont">
                <div><b>Availability:</b></div>
                <div>In Stock</div>
              </div>
              <div class="d-flex minicont">
                <div><b>Category:</b></div>
                <div>Accessories</div>
              </div>
              <div class="d-flex minicont">
                <div><b>Free Shipping:</b></div>
                <div>-</div>
              </div>
              <div>
                <hr>
              </div>
              <div class="d-flex minicont">
                <div><b>Select Color:</b></div>
                <div>
                  <div>
                    <div class="cc-selector" style="position: relative; bottom:10px;">
                      <input id="visa" type="radio" name="credit-card" value="visa" />
                      <label class="drinkcard-cc visa" for="visa">
                        <i class="bi bi-circle-fill blue"></i> </label>
                      <input id="mastercard" type="radio" name="credit-card" value="mastercard" />
                      <label class="drinkcard-cc mastercard" for="mastercard">
                        <i class="bi bi-circle-fill red"></i>
                      </label>
                      <input id="mastercard" type="radio" name="credit-card" value="mastercard" />
                      <label class="drinkcard-cc mastercard" for="mastercard">
                        <i class="bi bi-circle-fill black"></i>
                      </label>
                      <input id="mastercard" type="radio" name="credit-card" value="mastercard" />
                      <label class="drinkcard-cc mastercard" for="mastercard">
                        <i class="bi bi-circle-fill yellow"></i>
                      </label>
  
                    </div>
                  </div>
                </div>
              </div>
              <div class="d-flex minicont">
                <div><b>Size:</b></div>
                <div>
                  <select class="custom-select">
                    <option selected>12</option>
                    <option value="1">One</option>
                    <option value="2">Two</option>
                    <option value="3">Three</option>
                  </select>
                </div>
              </div>
              <div>
                <hr>
              </div>
              <div class="d-flex justify-content-between">
                <div class="RangeChanger"><button id="DecreaseBtn" ><i class="bi bi-dash"></i></button> <span
                    class="p-md-3 p-xl-3" id="ProductCountValue">1</span><button id="IncreaseBtn" ><i class="bi bi-plus"></i></button> </div>
                <div class="">
                  <button class="AddCart"  id="AddToCartBtn" data-productid="${value.id}"><i class="bi bi-cart3"></i> Add To Cart</button>
                  <button class="AddCart"><i class="bi bi-heart"></i></button>
                </div>
              </div>
              <div>
                <hr>
              </div>
              <div class="d-lg-flex flex-lg-row d-sm-flex flex-sm-column  justify-content-between ">
                <div><button class="AddCart facebook mt-3"><i class="bi bi-facebook "></i> Share on Facebook</button>
                </div>
                <div><button class="AddCart twitter mt-3"><i class="bi bi-twitter"></i> Share on Twitter</button></div>
  
              </div>
            </div>
          </div>
          <div class="ProductBottom mt-5 p-sm-1 p-xl-4">


          <button id="Collapse1" class="CollButton CollBtnHr">Product Information</button>
          <button id="Collapse2" class="CollButton ">Reviews <span>0</span></button>

          <hr class="CollHr">



          <div id="CollapseDiv1" class="pt-5">
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil quisquam dolore ipsum obcaecati asperiores
              fugit magni ut alias. Rem minima odit neque possimus quas? Ducimus officiis perspiciatis placeat porro
              dolorem!
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil quisquam dolore ipsum obcaecati asperiores
              fugit magni ut alias. Rem minima odit neque possimus quas? Ducimus officiis perspiciatis placeat porro
              dolorem!
            </p>
            <p> Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil quisquam dolore ipsum obcaecati
              asperiores fugit magni ut alias. Rem minima odit neque possimus quas? Ducimus officiis perspiciatis
              placeat porro dolorem!
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil quisquam dolore ipsum obcaecati asperiores
              fugit magni ut alias. Rem minima odit neque possimus quas? Ducimus officiis perspiciatis placeat porro
              dolorem!
            </p>
          </div>
          <div id="CollapseDiv2" class="disable pt-5">
            <p> REVIEW

            </p>

          </div>

        </div>
`;
        $(".ProductDetailCont").empty();
        $(htmlitem).appendTo(".ProductDetailCont");
        collapseProductDetail();


      }
    });

  })

}
