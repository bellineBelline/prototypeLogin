// ======================================================================
//  HTML要素
// ======================================================================
// ユーザープールの必須項目として設定されている情報（ユーザーの入力情報）
const inputUsername = document.getElementById("txtbox-email").value;        // 入力されたユーザー名（email）
const inputPassword = document.getElementById("txtbox-password").value;     // 入力されたパスワード
const divMessage = document.getElementById('div_message');             // エラー表示用のメッセージボックス


// ======================================================================
//  ログイン処理
// ======================================================================
function tapLogin() {
    var authenticationData = {
        Username : inputUsername,
        Password : inputPassword,
    };
    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    var userData = {
        Username : inputUsername,
        Pool : userPool
    };


    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
            // アクセストークン
            var accessToken = result.accessToken.jwtToken;
            // アクセストークの有効期限
            var expiresIn = result.accessToken.payload.exp;
            // IDトークン
            var idToken = result.idToken.jwtToken;
            // 更新トークン
            var refreshToken = result.refreshToken.token;

            // 結果の表示
            var info = "idToken : " + idToken + "\n";
            info = info + "expiresIn : " + expiresIn + "\n";
            info = info + "accessToken : " + accessToken + "\n";
            info = info + "refreshToken : " + refreshToken + "\n";
            showMessage(info);

            // 動作確認のために、アクセストークンをローカルストレージに入れる
            window.localStorage.setItem(KEY_LOCALSTORAGE_ACCESSTOKEN, accessToken);
            window.localStorage.setItem(KEY_LOCALSTORAGE_IDTOKEN, idToken);
            window.localStorage.setItem(KEY_LOCALSTORAGE_REFRESHTOKEN, refreshToken);
        },

        onFailure: function(err) {
            // ログイン失敗時の処理を書く...
			showErrorMessage(err);
        },

        newPasswordRequired(userAttributes, requiredAttributes) {
           alert("ユーザーのステータスがFORCE_CHANGE_PASSWORD");

		   divMessage.innerText = userAttributes
		   showMessage(userAttributes + '\n' +  requiredAttributes)

           // 仮パスワードを確定させる
           cognitoUser.completeNewPasswordChallenge(inputPassword, {}, this);
        }
    });
}


// ======================================================================
//  現在のユーザーの属性情報を取得・表示する
// ======================================================================
var getUserAttribute = function(){
    const cognitoUser = userPool.getCurrentUser();  // 現在のユーザー
    var currentUserData = {};  // ユーザーの属性情報

    // 現在のユーザー情報が取得できているか？
    if (cognitoUser != null) {
        cognitoUser.getSession(function(err, session) {
            if (err) {
                console.log(err);
                divMessage.innerText = ""
                showErrorMessage("ログインできていません: " + err);
            } else {
                // ユーザの属性を取得
                cognitoUser.getUserAttributes(function(err, result) {
                    if (err) {
                        showErrorMessage("ユーザー属性を取得できません: " + err);
                    }
                    
                    // 取得した属性情報を連想配列に格納
                    for (i = 0; i < result.length; i++) {
                        console.log(result)
                        currentUserData[result[i].getName()] = result[i].getValue();
                    }
                    showMessage("ログイン中のユーザー: " + currentUserData["family_name"] + currentUserData["given_name"] );
                });
            }
        });
    } else {
        showErrorMessage("ログインできていません: " + err);
    }
};


// ======================================================================
//  検証（おためし）
// ======================================================================
function checkUser() {
    // トークンを取得する
    var idToken = window.localStorage.getItem(KEY_LOCALSTORAGE_IDTOKEN);
    console.log("公開鍵の取得 from: " + URL_COGNITO_PUBLICKEY)

    fetch(URL_COGNITO_PUBLICKEY,     {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": session.getIdToken().jwtToken
        },
        type　: "GET",
        body: JSON.stringify(data)
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error();
        }
        return response.blob(); // あるいは response.json()
    })
    .then((blob) => {
        console.log(blob)
    })
    .catch((reason) => {
        // エラー
        console.log(reason)
    });
}

// ======================================================================
//  メッセージの表示
// ======================================================================
function showErrorMessage(message) {
    divMessage.style.color = "red";
    divMessage.innerText = message;
}

function showMessage(message) {
    divMessage.style.color = "black";
    divMessage.innerText = message;
}