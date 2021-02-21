// サインアップしたユーザーを有効にするための手続き

// ======================================================================
//  HTML要素
// ======================================================================
const inputEmail = document.getElementById('input_email');                  // 入力したメールアドレス
const inputActivateKey = document.getElementById('input_activationKey');    // 入力したアクティベートキー
 
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
    const username = document.getElementById("txtbox-email").value; 
    const keyActivation = document.getElementById("activationKey").value
    var activationKey = $("#activationKey").val();
    
    // 何か1つでも未入力の項目がある場合、処理を中断
    if (!email | !activationKey) {
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
                $("div#message span").empty();
                $("div#message span").append(err.message);
            }
        } else {
            // アクティベーション成功の場合、サインイン画面に遷移
        }
    });
};