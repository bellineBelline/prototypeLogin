// JavascriptのCognito SDKを使うときは、アプリクライアントをシークレットキーなしで作成しなければならない

// ======================================================================
//  アプリで使用する定数
// ======================================================================
const ID_USERPOOL = 'ap-northeast-1_64AzaRBso'                              // プロトタイプのユーザープールID
const ID_APPCLIENT = '6lvpvjseu6jvvlnar8asbcv4pf'                           // アプリのクライアントID
const ID_IDPOOL = 'ap-northeast-1:6825e999-0c18-4ebe-b556-75c3ebed9885'     // IDプールのID

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
 
    // ユーザープールの必須項目として設定されている情報（ユーザーの入力情報）
	var username = document.getElementById("txtbox-email").value;           // ユーザー名（email）
	var lastName = document.getElementById("txtbox-lastName").value;        // 名前
	var firstName = document.getElementById("txtbox-firstName").value;      // 苗字
	var password = document.getElementById("txtbox-password").value;        // パスワード
			
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
	    	alert(err);
			return;
	    } else {
	      	// サインアップ成功の場合、アクティベーション画面に遷移する
	    }
    });
}