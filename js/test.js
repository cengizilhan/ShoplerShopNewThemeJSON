$(document).ready(function () {
    $('.LoginBtn').on("click", function () {
        var id = $('#Fid').val();
        var pass = $('#Fpass').val();
        var userid = UserRegisterCntrl(id, pass);
        if (userid) {
            AlertLogin();
            SessionSet(id);
            setTimeout(function () { window.location = "../index.html"; }, 3000);
        }
        else {
            AlertLoginFailed();
        }


    });

    $('.RegisterBtn').on("click", function () {
        var id = $('#Fid').val();
        var pass = $('#Fpass').val();

        if (IDValidation(id) && PasswordValidation(pass)) {
            Register(id, pass);
            AlertRegister();
            SessionSet(id);
            setTimeout(function () { window.location = "../index.html"; }, 3000);
        }

    });



});


function Register(id, pass) {
    var arr = [id, pass]
    localStorage.setItem(UserKey, JSON.stringify(arr));
}

function PasswordValidation(pass) {
    /*- at least 8 characters
    - must contain at least 1 uppercase letter,
     1 lowercase letter, and 1 number
    - Can contain special characters */
    var regex = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm);
    var errMsg = "Parolanız en az 8 karakter olmalı, 1 büyük ve 1 küçük karakter içermeli ve özel bir karakter içermelidir.";

    var flag = "";
    if (pass.match(regex)) {
        flag = true;
    }
    else {
        AlertRegisterFailed(errMsg);
        flag = false;
    }

    return flag;

}

function IDValidation(id) {
    /*
    Value must be from 4 to 20 characters in length, only allow letters and numbers, no special characters, full line is evaluated.
 */
    var regex = new RegExp(/^([A-Za-z0-9]){4,20}$/gm);
    var errMsg = "Kullanıcı adınız 4 ila 20 karakter uzunluğunda olmalıdır, yalnızca harf ve rakamlara izin verilir, özel karakterlere izin verilmez.";
    var flag = "";
    if (id.match(regex)) {
        flag = true;
    }
    else {
        AlertRegisterFailed(errMsg);
        flag = false;
    }
    return flag;
}




function UserRegisterCntrl(id, pass) {

    var user = JSON.parse(localStorage.getItem(UserKey));

    return (id == user[0] && pass == user[1]) ? true : false;
}


function SessionSet(id) {
    sessionStorage.setItem(SessionID, id);
}

function SessionRead() {

        var id= sessionStorage.getItem(SessionID);
     
  


    return id;
    /* return null>no session*/
}

function SessionQuit() {
    sessionStorage.clear();

}
function AlertLogin() {
    if (!$(".alert-box").length) {
        $(
            '<div class="alert-box success" ><div>Başarıyla giriş yaptınız.Anasayfaya yönlendirileceksiniz. </div></div>'
        )
            .prependTo("body")
            .delay(3000)
            .fadeOut(1000, function () {
                $(".alert-box").remove();
            });
    }
}
function AlertRegister() {
    if (!$(".alert-box").length) {
        $(
            '<div class="alert-box success" ><div>Başarıyla kayıt oldunuz.Anasayfaya yönlendirileceksiniz. </div></div>'
        )
            .prependTo("body")
            .delay(3000)
            .fadeOut(1000, function () {
                $(".alert-box").remove();
            });
    }
}
function AlertLoginFailed() {
    if (!$(".alert-box").length) {
        $(
            '<div class="alert-box fail" ><div>Giriş yapılmadı, bilgilerinizi kontrol ediniz. </div></div>'
        )
            .prependTo("body")
            .delay(3000)
            .fadeOut(1000, function () {
                $(".alert-box").remove();
            });
    }
}

function AlertRegisterFailed(msg) {
    if (!$(".alert-box").length) {
        $(
            '<div class="alert-box fail" ><div>' + msg + ' </div></div>'
        )
            .prependTo("body")
            .delay(3000)
            .fadeOut(1000, function () {
                $(".alert-box").remove();
            });
    }
}

function AlertWelcome(msg) {
    if (!$(".alert-box").length) {
        $(
            '<div class="alert-box success" ><div>' + msg + ' </div></div>'
        )
            .prependTo("body")
            .delay(3000)
            .fadeOut(1000, function () {
                $(".alert-box").remove();
            });
    }
}



