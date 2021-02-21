// ======================================================================
//  アプリで使用する定数
// ======================================================================
const ID_USERPOOL = 'ap-northeast-1_64AzaRBso';                             // プロトタイプのユーザープールID
const ID_APPCLIENT = '6lvpvjseu6jvvlnar8asbcv4pf';                          // アプリのクライアントID
const ID_IDPOOL = 'ap-northeast-1:6825e999-0c18-4ebe-b556-75c3ebed9885';    // IDプールのID

const APP_REGION = "ap-northeast-1";                                        // アプリのリージョン

const KEY_LOCALSTORAGE_EMAIL = "signup_email";                              // サインアップしたときのメールアドレス


// --------------------------------------------------
//  ユーザープール関連
// --------------------------------------------------
const poolData = {
    UserPoolId : ID_USERPOOL,                                               // ユーザプールID
    ClientId : ID_APPCLIENT                                                 // アプリクライアントID
};

// ユーザープール
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);