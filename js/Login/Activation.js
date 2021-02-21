// サインアップしたユーザーを有効にするための手続き

// ======================================================================
//  HTML要素
// ======================================================================
const inputEmail = document.getElementById('input_email');                  // 入力したメールアドレス
const inputActivateKey = document.getElementById('input_activationKey');    // 入力したアクティベートキー
const divErrorMessage = document.getElementById('div_message');             // エラー表示用のメッセージボックス
 
// ======================================================================
//  画面読み込み時の処理
// ======================================================================
window.onload = function() {
	// Amazon Cognito 認証情報プロバイダーの初期化
	AWSCognito.config.region = APP_REGION;                                  // リージョン
	AWSCognito.config.credentials = new AWS.CognitoIdentityCredentials({
	    IdentityPoolId: ID_IDPOOL                                           // IDプールのID
	});

    // サインアップしたときに入力したメールアドレスを取り出す（ローカルストレージ）
    var email = window.localStorage.getItem(KEY_LOCALSTORAGE_EMAIL);
    inputEmail.value = email;                                               // 入力された状態にしておく
}

 
// ======================================================================
//  ユーザーのアクティベーション処理
// ======================================================================
function activateUser() {
    const email = inputEmail.value; 
    const activationKey = inputActivateKey.value
    
    // 何か1つでも未入力の項目がある場合、処理を中断
    if (!email | !activationKey) {
        // 未入力項目がある旨を表示
        divErrorMessage.innerText = "未入力の項目があります。";
        return false;
    } 
	
    var userData = {
        Username : email,
        Pool : userPool
    };
    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    
    // アクティベーション処理
    cognitoUser.confirmRegistration(activationKey, true, function(err, result){
        if (err) {
            // アクティベーション失敗の場合、エラーメッセージを画面に表示
            if (err.message != null) {
                // それとわかるように表示する
                divErrorMessage.innerText = "";
                divErrorMessage.innerText = err.message;
            }
        } else {
            // アクティベーション成功の場合、サインイン画面に遷移
            console.log("アクティベート完了")
        }
    });
};


// ======================================================================
//  サインイン画面に遷移する
// ======================================================================
function moveSignIn() {
    document.location.href = "Login_SignIn.html";
}