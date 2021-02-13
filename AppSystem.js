// JavascriptのCognito SDKを使うときは、アプリクライアントをシークレットキーなしで作成しなければならない

// ======================================================================
//  アプリで使用する定数
// ======================================================================
const ID_USERPOOL = 'ap-northeast-1_64AzaRBso';                             // プロトタイプのユーザープールID
const ID_APPCLIENT = '6lvpvjseu6jvvlnar8asbcv4pf';                          // アプリのクライアントID
const ID_IDPOOL = 'ap-northeast-1:6825e999-0c18-4ebe-b556-75c3ebed9885';    // IDプールのID


// --------------------------------------------------
//  HTML要素
// --------------------------------------------------
// ユーザープールの必須項目として設定されている情報（ユーザーの入力情報）
const username = document.getElementById("txtbox-email").value;           	// ユーザー名（email）
const lastName = document.getElementById("txtbox-lastName").value;        	// 名前
const firstName = document.getElementById("txtbox-firstName").value;      	// 苗字
const password = document.getElementById("txtbox-password").value;        	// パスワード

var divResult = document.getElementById("div-resutlogin");					// サインアップ/サインイン結果表示領域

// --------------------------------------------------
//  ユーザープール関連
// --------------------------------------------------
const poolData = {
    UserPoolId : ID_USERPOOL,                                               // ユーザプールID
    ClientId : ID_APPCLIENT                                                 // アプリクライアントID
};
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);



// ======================================================================
//  画面読み込み時の処理 （全てのDOMツリーが読み込まれた後に実行）
// ======================================================================
window.onload = function() {
	// Amazon Cognito 認証情報プロバイダーの初期化
	AWSCognito.config.region = 'ap-northeast-1';                            // リージョン
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
    if (!username | !lastName | !firstName | !password) { 
    	return false; 
    }
		    
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
			
    // サインアップ処理
    userPool.signUp(username, password, attributeList, null, function(err, result){
	    if (err) {
			// サインアップに失敗した場合の処理
	    	alert(err);
			divResult.innerText = err
			return;
	    } else {
	      	// サインアップ成功の場合、アクティベーション画面に遷移する
			divResult.innerText = result
	    }
    });
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