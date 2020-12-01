import { Injectable } from '@angular/core';
import { HarvestMouse } from '../interface/harvestmouse';
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import hmacSHA512 from 'crypto-js/hmac-sha512';
import * as CryptoJS from 'crypto-js';
import { User } from '../interface/user';

let local_dev: Boolean = false;
let client_side_url = local_dev ? "http://localhost:4200" : "https://mousemanagementsite.herokuapp.com";
let baseUrl: string = local_dev ? 'http://localhost:8000/api/' : 'https://mousemanagement.herokuapp.com/api/';
let serverHarvestAppBaseUrl: string = baseUrl + 'harvestedmouse/';
let serverAccountAppBaseUrl: string = baseUrl + 'accounts/';
export let harvestMouseListUrl: string = serverHarvestAppBaseUrl + 'force_list';
export let harvestMouseFileUploadUrl: string = serverHarvestAppBaseUrl + 'import';
export let harvestMouseDeleteUrl: string = serverHarvestAppBaseUrl + 'delete';
export let harvestMouseUpdateUrl: string = serverHarvestAppBaseUrl + 'update';
export let getDataListUrl: string = serverHarvestAppBaseUrl + 'getdatalist';

export let accountLoginUrl: string = serverAccountAppBaseUrl + 'login';
export let accountLoggoutUrl: string = serverAccountAppBaseUrl + 'logout';
export let accountIsLoginUrl: string = serverAccountAppBaseUrl + 'islogin';

export let accountCheckSecretKeyUrl: string = serverAccountAppBaseUrl + 'checksecretuser';
export let accountNewUserPwdKeyUrl: string = serverAccountAppBaseUrl + 'newuserpwdchange';

export let accountGetAllUserInfoUrl: string = serverAccountAppBaseUrl + 'getalluserinfo';
export let accountToggleActivityUser: string = serverAccountAppBaseUrl + 'toggle-activity-user';

export let accountIsAdmin: string = serverAccountAppBaseUrl + 'is-admin';
export let accountCreateNewUser: string = serverAccountAppBaseUrl + 'create';

export let accountDeleteUser: string = serverAccountAppBaseUrl + 'delete-user';


@Injectable({
  providedIn: 'root'
})
export class DataproviderService {

  harvestMouseList: HarvestMouse[];
  last_random_symbol: string = '';
  constructor(private http: HttpClient) { }

  /*
  Function name: httpPostRequest
  Description: Making the http post request to the desired URL server,
                     the caller must make sure no null value pass into the function
  */
  httpPostRequest(formData: FormData, url: string, options?) {
    return this.http.post(url, formData, options);
  }

  /*
  Function name: httpGetRequest
  Description: Making the http get request to the desired URL server with
                     optional parameters
  */
  httpGetRequest(url: string, params?: string[]) {
    let httpParams = new HttpParams();
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    let localresult = '';
    for (var i = 0; i < 30; i++) {
      localresult += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    this.last_random_symbol = localresult;

    while (this.last_random_symbol === localresult) {
      localresult = '';
      for (var i = 0; i < 10; i++) {
        localresult += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
    }

    this.last_random_symbol = localresult;

    if (params) {
      httpParams = httpParams.set('filter', params[0]);
    }
    httpParams = httpParams.set('symbol', this.last_random_symbol);
    // Insert into the option field

    return this.http.get(url, {
      headers: this.constructHeaederForCORSHeader(),
      params: httpParams,
      withCredentials: true
    });
  }

  /*
  Function name: httpDeleteRequest
  Description: Making the http delete request to the desired URL server with
                     optional parameters
  */
  httpDeleteRequest(harvestedMouseArray: HarvestMouse[], httpHeader: HttpHeaders, url: string) {
    let mouse_list_obj = {
      'mouse_list': harvestedMouseArray
    }
    let options = {
      headers: httpHeader,
      body: mouse_list_obj
    }

    return this.http.request('DELETE', url, options);
  }

  /*
  Function name: httpPutRequest
  Description: Making the http put request to the desired URL server with
                     optional parameters
  */
  httpPutRequest(harvestedMouseArray: HarvestMouse[], httpHeader: HttpHeaders, url: string) {
    let mouse_list_obj = {
      'mouse_list': harvestedMouseArray
    }
    let options = {
      headers: httpHeader,
      body: mouse_list_obj
    }

    return this.http.request('PUT', url, options);
  }

  /*
  Function name: deleteHarvestedMouseRequest
  Description: Making the http delete request to the desired URL server with
                     optional parameters
  */
  deleteHarvestedMouseRequest(harvestedMouseArray: HarvestMouse[]) {
    let url = harvestMouseDeleteUrl;

    // Setting up http headers for the file uploading
    let headers = new HttpHeaders({
      'enctype': 'multipart/form-data',
      'Accept': 'application/json'
    });

    return this.httpDeleteRequest(harvestedMouseArray, headers, url);
  }

  /*
  Function name: updateHarvestedMouseRequest
  Description: Making the http put request to the desired URL server with
                     optional parameters
  */
  updateHarvestedMouseRequest(harvestedMouseArray: HarvestMouse[]) {
    let url = harvestMouseUpdateUrl;

    // Setting up http headers for the file uploading
    let headers = new HttpHeaders({
      'enctype': 'multipart/form-data',
      'Accept': 'application/json'
    });

    return this.httpPutRequest(harvestedMouseArray, headers, url);
  }

  /*
  Function name: getHarvestMouseList
  Description: Making the get method to query the harvested mouse list
                     from the server
  */
  getHarvestMouseList(params?: string[]) {
    let url = harvestMouseListUrl;
    return this.httpGetRequest(url, params);
  }

  /*
  Function name: getDataList
  Description: Making the get method to query the inserted set of inserted data
  */
  getDataList(params?: string[]) {
    let url = getDataListUrl;
    return this.httpGetRequest(url, params);
  }

  /*
  Function name: FileUploadRequest
  Description: Upload the file to the server and make the import operation,
                     fail to provide the file will return null value
  */
  fileUploadRequest(file: File, url: string) {
    // Make sure there is a file to upload
    if (file) {
      let formData: FormData = new FormData();
      formData.append('file', file, file.name);

      // Insert into the option field
      let options = {
        headers: this.constructHeaederForCORSHeader()
      }

      return this.httpPostRequest(formData, url, options);
    }
    else {
      return null;
    }
  }

  /*
  Function name: ValidateUserInfo
  Description: This function issues POST request to the backend server
               for user info validation with provided username and password
  */
  ValidateUserInfo(username: string, password: string) {
    let formData: FormData = new FormData();
    // formData.append('username', this.encodeString(username));
    // formData.append('password', this.encodeString(password));
    formData.append('username', username);
    formData.append('password', password);
    let options = {
      observe: "response",
      withCredentials: true,
      headers: this.constructHeaederForCORSHeader()
    };

    return this.httpPostRequest(formData, accountLoginUrl, options);
  }

  /*
  Function name: UserLoggout
  Description: Log out the user from the server
  */
  UserLoggout() {
    return this.httpGetRequest(accountLoggoutUrl);
  }

  /*
  Function name: CheckIsLogin
  Description: Check if the user has login into the server
  */
  CheckIsLogin() {
    let formData: FormData = new FormData();

    let options = {
      observe: "response",
      withCredentials: true,
      headers: this.constructHeaederForCORSHeader()
    };

    return this.httpPostRequest(formData, accountIsLoginUrl, options);
  }

  /*
  Function name: CheckSecretKey
  Description: This function checks the secret is valid
  */
  CheckSecretKey(secret_key, username) {
    let formData: FormData = new FormData();
    formData.append('secret_key', secret_key);
    formData.append('username', username);

    // Insert into the option field
    let options = {
      responseType: 'json',
      observe: "response",
      withCredentials: true,
      headers: this.constructHeaederForCORSHeader()
    };

    return this.httpPostRequest(formData, accountCheckSecretKeyUrl, options);
  }

  /*
  Function name: NewUserChangePassword
  Description: This function change the password for new user
  */
  NewUserChangePassword(secret_key, username, newpassword) {
    let formData: FormData = new FormData();
    formData.append('secret_key', secret_key);
    formData.append('username', username);
    formData.append('password', newpassword);

    // Insert into the option field
    let options = {
      responseType: 'json',
      observe: "response",
      withCredentials: true,
      headers: this.constructHeaederForCORSHeader()
    };

    return this.httpPostRequest(formData, accountNewUserPwdKeyUrl, options);
  }

  GetAllUserInfo() {
    let url = accountGetAllUserInfoUrl;
    return this.httpGetRequest(url);
  }

  ToggleActivityUser(user: User) {
    let formData: FormData = new FormData();
    formData.append('username', user.username);
    formData.append('is_active', user.is_active + "");  // Convert Boolean to String for transmission

    // Insert into the option field
    let options = {
      observe: "body",
      withCredentials: true,
      headers: this.constructHeaederForCORSHeader()
    };

    return this.httpPostRequest(formData, accountToggleActivityUser, options);
  }

  CreateNewUser(username: string, email: string, firstname: string, lastname: string) {
    let formData: FormData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
    formData.append('firstname', firstname);
    formData.append('lastname', lastname);

    // Insert into the option field
    let options = {
      observe: "body",
      withCredentials: true,
      headers: this.constructHeaederForCORSHeader()
    };

    return this.httpPostRequest(formData, accountCreateNewUser, options);
  }


  DeleteUser(username: string) {
    let formData: FormData = new FormData();
    formData.append('username', username);

    // Insert into the option field
    let options = {
      observe: "body",
      withCredentials: true,
      headers: this.constructHeaederForCORSHeader()
    };

    return this.httpPostRequest(formData, accountDeleteUser, options);
  }


  IsAdmin() {
    let formData: FormData = new FormData();

    // Insert into the option field
    let options = {
      observe: "body",
      withCredentials: true,
      headers: this.constructHeaederForCORSHeader()
    };

    return this.httpPostRequest(formData, accountIsAdmin, options);
  }

  constructHeaederForCORSHeader() {
    // Setting up http headers for the file uploading
    let headers = new HttpHeaders({
      'enctype': 'multipart/form-data',
      'Accept': 'application/json',
      'Access-Control-Allow-Origin': client_side_url,
      'Access-Control-Allow-Credentials': 'true'
    });
    return headers;
  }

  /*
  Function name: encodeString
  Description: Helper function for encrypting incoming string
  */
  encodeString(stringToEncode) {
    // using AES, key will be get from the server, stick to fixed value
    // To-DO
    try {
      var text = this.padOrTruncate(stringToEncode);
      var key = CryptoJS.enc.Hex.parse("abcdef");
      // padding and truncating
      var encrypted = CryptoJS.AES.encrypt(text, key, {
        // iv: this.iv,
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.NoPadding
      });
      return CryptoJS.enc.Hex.stringify(encrypted.ciphertext);
    } catch (e) {
      return stringToEncode;
    }
  }

  padOrTruncate(str: string): string {
    var result: string = '';
    if (str.length % 32 == 0)
      return str;

    result = str + '';
    while (!(result.length % 32 == 0)) {
      result = result + " ";
    }

    return result;
  }

  decodeString(stringToDecode) {
    // using AES, key will be get from the server, stick to fixed value
    // To-DO
    try {
      const bytes = CryptoJS.AES256.decrypt(stringToDecode, "mousemanagement");
      if (bytes.toString()) {
        return JSON.parse(bytes.toString(hmacSHA512.Utf8));
      }
      return stringToDecode;
    } catch (e) {
      return stringToDecode;
    }
  }

}
