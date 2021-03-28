$(document).ready(function () {
    $(document).on("click", "#RegisterSubmitBtn", function () {
        var pass = $('#InputPassword').val();
        var id = $('#InputUsername').val();
        let register = new Session(id, pass);
        register.register();

    });

    $(document).on("click", "#LoginBtn", function () {
        var pass = $('#inputPassword').val();
        var id = $('#inputUsername').val();
        let login = new Session(id, pass);
        var boo = login.login();

    });
})
 class Session {
    constructor(id, pass) {
        this.id = id;
        this.pass = pass;
    }
    register() {
        let user = { id: this.id, pass: this.pass };
        let records = JSON.parse(localStorage.getItem(UserKey));
        if (localStorage.getItem(UserKey) === null) { //firstrecord
            localStorage.setItem(UserKey, JSON.stringify([user]));
            new swal(RegisterMsg);
            setTimeout(function () { window.location = "./login.html"; }, 3000)
        } else {//record control
            var i;
            var flag = false;
            for (i = 0; i < records.length; i++) {
                if (records[i].id == user.id && records[i].pass == user.pass) {
                    new swal(RegisterErrMsg);
                    flag = true;
                }
            }
            if (flag == false) { //newrecords
                records.push(user);
                localStorage.setItem(UserKey, JSON.stringify(records));
                new swal(RegisterMsg);
                setTimeout(function () { window.location = "./login.html"; }, 3000)
                return true;
            }
        }
    }

    SessionCheck(){
        
        if(sessionStorage.getItem(SessionID)==null) {
            new swal(SessionNullMsg);
            setTimeout(function () { window.location = "./login.html"; }, 3000)
        }
        else{
            return true;
        }
        

    }
    GetId(){
        var id=sessionStorage.getItem(SessionID);
        return id;
    }
  
    login() {
        let user = { id: this.id, pass: this.pass };
        let records = JSON.parse(localStorage.getItem(UserKey));
        var i;
        var flag = false;
        for (i = 0; i < records.length; i++) {
            if (records[i].id == user.id && records[i].pass == user.pass) {
                flag = true;
                new swal(LoginMsg);
                sessionStorage.setItem(SessionID, user.id);
                setTimeout(function () { window.location = "./index.html"; }, 3000)
                return true;
            }
        }
        if (flag == false) {
            new swal(LoginErrMsg);
            return false;
        }


    }

}


