// JavascriptのCognito SDKを使うときは、アプリクライアントをシークレットキーなしで作成しなければならない

// ======================================================================
//  HTML要素
// ======================================================================
// ユーザープールの必須項目として設定されている情報（ユーザーの入力情報）
const inputUsername = document.getElementById("txtbox-email").value;           	// 入力されたユーザー名（email）
const inputLastName = document.getElementById("txtbox-lastName").value;        	// 入力された名前
const inputFirstName = document.getElementById("txtbox-firstName").value;      	// 入力された苗字
const inputPassword = document.getElementById("txtbox-password").value;        	// 入力されたパスワード

var divResult = document.getElementById("div-resutlogin");					// サインアップ/サインイン結果表示領域

// ======================================================================
//  画面読み込み時の処理 （全てのDOMツリーが読み込まれた後に実行）
// ======================================================================
window.onload = function() {
	// Amazon Cognito 認証情報プロバイダーの初期化
	AWSCognito.config.region = APP_REGION;                            // リージョン
	AWSCognito.config.credentials = new AWS.CognitoIdentityCredentials({
	    IdentityPoolId: ID_IDPOOL                                           // IDプールのID
	});
}

 
// ======================================================================
//  サインアップ処理。
// ======================================================================
function tapSignUp() {
    // ユーザー属性の情報（提出用）
    var attributeList = [];
 
	// 何か1つでも未入力の項目がある場合、処理終了
    if (!inputUsername | !inputLastName | !inputFirstName | !inputPassword) { 
    	return false; 
    }
		    
    // ユーザ属性リストの生成
	var dataFamilyName = {
		Name : "family_name",
		Value : inputLastName
	}
	var dataGivenName = {
		Name : "given_name",
		Value : inputFirstName
	}
	var attributeFamilyName = new AmazonCognitoIdentity.CognitoUserAttribute(dataFamilyName);
	var attributeGivenName = new AmazonCognitoIdentity.CognitoUserAttribute(dataGivenName);
			
    attributeList.push(attributeFamilyName);
    attributeList.push(attributeGivenName);
			
    // サインアップ処理
    userPool.signUp(inputUsername, inputPassword, attributeList, null, function(err, result){
	    if (err) {
			// サインアップに失敗した場合の処理
	    	alert(err);
			divResult.innerText = err
			return;
	    } else {
            //　ローカルストレージに登録したメールアドレスを格納しておく
            window.localStorage.setItem(KEY_LOCALSTORAGE_EMAIL, inputUsername);
	      	// サインアップ成功の場合、アクティベーション画面に遷移する
            moveActivation()
	    }
    });
}

// ======================================================================
//  ユーザー有効化の画面に遷移する
// ======================================================================
function moveActivation() {
    document.location.href = "Login_Activation.html";
}


// ======================================================================
//  ログイン処理
// ======================================================================
function tapLogin() {
    var authenticationData = {
        Username : username,
        Password : password,
    };
    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    var userData = {
        Username : username,
        Pool : userPool
    };

	// ユーザー属性の情報（提出用）
	var attributeList = [];
	// ユーザ属性リストの生成
	var dataFamilyName = {
		Name : "family_name",
		Value : lastName
	}
	var dataGivenName = {
		Name : "given_name",
		Value : firstName
	}
	var attributeFamilyName = new AmazonCognitoIdentity.CognitoUserAttribute(dataFamilyName);
	var attributeGivenName = new AmazonCognitoIdentity.CognitoUserAttribute(dataGivenName);
			
	attributeList.push(attributeFamilyName);
	attributeList.push(attributeGivenName);

    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
            alert("ログイン成功");
            // アクセストークン
            var accessToken = result.accessToken.jwtToken;
            // アクセストークの有効期限
            var exp = result.accessToken.payload.exp;
            // IDトークン
            var idToken = result.idToken.jwtToken;
            // 更新トークン
            var refreshToken = result.refreshToken.token;
            // ログイン時の処理を書く...

			divResult.innerText = divResult.innerText + '\n' +  accessToken
			divResult.innerText = divResult.innerText + '\n' +  exp
			divResult.innerText = divResult.innerText + '\n' +  idToken
			divResult.innerText = divResult.innerText + '\n' +  refreshToken
        },

        onFailure: function(err) {
            alert("ログイン失敗");
            // ログイン失敗時の処理を書く...
			divResult.innerText = err
        },

        newPasswordRequired(userAttributes, requiredAttributes) {
           alert("ユーザーのステータスがFORCE_CHANGE_PASSWORD");
            

		   divResult.innerText = userAttributes
		   divResult.innerText = divResult.innerText + '\n' +  requiredAttributes

           // 仮パスワードを確定させる
           cognitoUser.completeNewPasswordChallenge(password, {}, this);
        }
    });
}



// ======================================================================
//  ログアウト処理
// ======================================================================
function tapLogout() {
    var userPool = AmazonCognitoIdentity.CognitoUserPool(poolData);
    var cognitoUser = userPool.getCurrentUser();
    if (cognitoUser) {
        // ログアウト
        cognitoUser.signOut();
    }
    // ログアウト時の処理
	divResult.innerText = "ログアウト"
 }


//  ■■ ユーザー属性の情報を取得する手段を探す。
//　■■ パスワードを

//　■■ iPhoneアプリを使って同じことができるかどうか？

// ■■ アカウントの削除

//　ユーザー属性変更（パスワード、メールなど）