
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

