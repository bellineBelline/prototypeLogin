// ======================================================================
//  HTML要素
// ======================================================================
// ユーザープールの必須項目として設定されている情報（ユーザーの入力情報）
const inputUsername = document.getElementById("txtbox-email").value;           	// 入力されたユーザー名（email）
const inputLastName = document.getElementById("txtbox-lastName").value;        	// 入力された名前
const inputFirstName = document.getElementById("txtbox-firstName").value;      	// 入力された苗字
const inputPassword = document.getElementById("txtbox-password").value;        	// 入力されたパスワード
const divErrorMessage = document.getElementById('div_message');             // エラー表示用のメッセージボックス


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

            divErrorMessage.innerText = "idToken : " + idToken + "\n";
            divErrorMessage.innerText = "accessToken : " + accessToken + "\n";
            divErrorMessage.innerText = "refreshToken : " + refreshToken + "\n";
        },

        onFailure: function(err) {
            alert("ログイン失敗");
            // ログイン失敗時の処理を書く...
			divErrorMessage.innerText = err
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

