import { Injectable, NgZone } from '@angular/core';
import { HarvestMouse } from '../interface/harvestmouse';
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../interface/user';
import { environment } from '../../environments/environment';


export interface MouseRequestForm{
  filterOption: string[],
  pageSize: number,
  pageIndex: number
}

export interface ResponseFrame{
  result: number,
  payload: any
}

namespace ResponseType {
  export const JSON = 'json' as 'json';
  export const ArrayBuffer = 'arraybuffer' as 'arraybuffer';
  export const Blob = 'blob' as 'blob';
  export const Text = 'text' as 'text';
  export const Event = 'events' as 'events';
  export const Body = 'body' as 'body';
}

// Main domain of the server
let baseUrl: string = environment.serverUrl;

/*
Harvested Mouse information related API end point
*/
let serverHarvestAppBaseUrl: string = baseUrl + 'harvestedmouse/';
export let harvestMouseListUrl: string = serverHarvestAppBaseUrl + 'force_list';
export let harvestMouseFileUploadUrl: string = serverHarvestAppBaseUrl + 'import';
export let harvestMouseDeleteUrl: string = serverHarvestAppBaseUrl + 'delete';
export let harvestMouseUpdateUrl: string = serverHarvestAppBaseUrl + 'update';
export let getDataListUrl: string = serverHarvestAppBaseUrl + 'getdatalist';
export let startParsingUrl: string = serverHarvestAppBaseUrl + 'parsing_imported_mouse';
export let harvestMouseTotalNum: string = serverHarvestAppBaseUrl + 'list_num';
/*
Account information related API end point
*/
let serverAccountAppBaseUrl: string = baseUrl + 'accounts/';
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
export let accountGetLoggedInfoUser: string = serverAccountAppBaseUrl + 'get-logged-user-info';


@Injectable({
  providedIn: 'root'
})
export class LowLevelLinkService {
  last_random_symbol: string = '';

  constructor(private http: HttpClient) { }

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
    let last_random_symbol: string = '';
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
      if(params.length >= 2){
        httpParams = httpParams.set('page_index', params[1]);
        httpParams = httpParams.set('page_size', params[2]);
      }
    }
    httpParams = httpParams.set('symbol', this.last_random_symbol);
    // Insert into the option field

    return this.http.get(url, {
      headers: this.constructHeaederForCORSHeader(),
      params: httpParams,
      withCredentials: true
    });
  }

  constructHeaederForCORSHeader() {
    // Setting up http headers for the file uploading
    let headers = new HttpHeaders({
      'enctype': 'multipart/form-data',
      'Accept': 'application/json',
      'Access-Control-Allow-Origin': environment.clientUrl,
      'Access-Control-Allow-Credentials': 'true'
    });
    return headers;
  }
}

@Injectable({
  providedIn: 'root'
})
export class HarvestedMouseDataproviderService {

  harvestMouseList: HarvestMouse[];

  constructor(
    private http: HttpClient,
    private lowLevelLinkService: LowLevelLinkService) { }

  /*
  Function name: deleteHarvestedMouseRequest
  Description: Making the http delete request to the desired URL server with
                     optional parameters
  */
  deleteHarvestedMouseRequest(harvestedMouseArray: HarvestMouse[]) {
    let url = harvestMouseDeleteUrl;

    // Setting up http headers for the file uploading

    let mouse_list_obj = {
      'mouse_list': harvestedMouseArray
    }
    let options = {
      headers: this.lowLevelLinkService.constructHeaederForCORSHeader(),
      body: mouse_list_obj
    }

    return this.http.request('DELETE', url, options);
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

    let mouse_list_obj = {
      'mouse_list': harvestedMouseArray
    }

    let options = {
      headers: headers,
      body: mouse_list_obj
    }

    return this.http.request('PUT', url, options);
  }

  /*
  Function name: getHarvestMouseList
  Description: Making the get method to query the harvested mouse list
                     from the server
  */
  getHarvestMouseList(mouseRequestForm: MouseRequestForm) {
    let url = harvestMouseListUrl;
    let params: string[] = [mouseRequestForm.filterOption[0], mouseRequestForm.pageIndex + "", mouseRequestForm.pageSize + ""];
    return this.lowLevelLinkService.httpGetRequest(url, params);
  }

  /*
  Function name: getHarvestMouseListNum
  Description: Get the total number of the entire mouse list
  */
  getHarvestMouseListNum(mouseRequestForm: MouseRequestForm){
    let url = harvestMouseTotalNum;
    return this.lowLevelLinkService.httpGetRequest(url, mouseRequestForm.filterOption);
  }

  /*
  Function name: getDataList
  Description: Making the get method to query the inserted set of inserted data
  */
  getDataList(params?: string[]) {
    let url = getDataListUrl;
    return this.lowLevelLinkService.httpGetRequest(url, params);
  }

  /*
  Function name: FileUploadRequest
  Description: Upload the file to the server.
  */
  fileUploadRequest(file: File, url: string) {
    // Make sure there is a file to upload
    if (file) {
      let formData: FormData = new FormData();
      formData.append('file', file, file.name);

      // Insert into the option field
      let options = {
        reportProgress: true,
        observe: ResponseType.Event,
        withCredentials: true,
        headers: this.lowLevelLinkService.constructHeaederForCORSHeader()
      };

      return this.http.post(url, formData, options);
    }
    else {
      return null;
    }
  }

  /*
  Function name: startParsingRequest
  Description: Trigger parsing operation
  */
  startParsingRequest() {
    // Insert into the option field
    let options = {
      responseType: ResponseType.JSON,
      withCredentials: true,
      headers: this.lowLevelLinkService.constructHeaederForCORSHeader()
    };

    return this.http.post(startParsingUrl, new FormData(), options);
  }
}

@Injectable({
  providedIn: 'root'
})
export class AccountInfoProviderService {

  constructor(
    private http: HttpClient,
    private lowLevelLinkService: LowLevelLinkService) { }

  /*
  Function name: validateUserInfo
  Description: This function issues POST request to the backend server
               for user info validation with provided username and password
  */
  validateUserInfo(username: string, password: string) {
    let formData: FormData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    let options = {
      responseType: ResponseType.JSON,
      withCredentials: true,
      headers: this.lowLevelLinkService.constructHeaederForCORSHeader()
    };

    return this.http.post(accountLoginUrl, formData, options);
  }
  /*
  Function name: userLogout
  Description: Log out the user from the server
  */
  userLogout() {
    return this.lowLevelLinkService.httpGetRequest(accountLoggoutUrl);
  }

  /*
  Function name: checkSecretKey
  Description: This function checks the secret is valid
  */
  checkSecretKey(secret_key, username) {
    let formData: FormData = new FormData();
    formData.append('secret_key', secret_key);
    formData.append('username', username);

    // Insert into the option field
    let options = {
      responseType: ResponseType.JSON,
      withCredentials: true,
      headers: this.lowLevelLinkService.constructHeaederForCORSHeader()
    };
    return this.http.post(accountCheckSecretKeyUrl, formData, options);
  }


  /*
  Function name: newUserChangePassword
  Description: This function change the password for new user
  */
  newUserChangePassword(secret_key, username, newpassword) {
    let formData: FormData = new FormData();
    formData.append('secret_key', secret_key);
    formData.append('username', username);
    formData.append('password', newpassword);

    // Insert into the option field
    let options = {
      responseType: ResponseType.JSON,
      withCredentials: true,
      headers: this.lowLevelLinkService.constructHeaederForCORSHeader()
    };
    return this.http.post(accountNewUserPwdKeyUrl, formData, options);
  }

  getAllUserInfo() {
    let url = accountGetAllUserInfoUrl;
    return this.lowLevelLinkService.httpGetRequest(url);
  }

  toggleActivityUser(user: User) {
    let formData: FormData = new FormData();
    formData.append('username', user.username);
    formData.append('is_active', user.is_active + "");  // Convert Boolean to String for transmission

    // Insert into the option field
    let options = {
      withCredentials: true,
      headers: this.lowLevelLinkService.constructHeaederForCORSHeader()
    };
    return this.http.post(accountToggleActivityUser, formData, options);
  }

  createNewUser(username: string, email: string, firstname: string, lastname: string) {
    let formData: FormData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
    formData.append('firstname', firstname);
    formData.append('lastname', lastname);

    // Insert into the option field
    let options = {
      responseType: ResponseType.JSON,
      withCredentials: true,
      headers: this.lowLevelLinkService.constructHeaederForCORSHeader()
    };

    return this.http.post(accountCreateNewUser, formData, options);
  }


  deleteUser(username: string) {
    let formData: FormData = new FormData();
    formData.append('username', username);

    // Insert into the option field
    let options = {
      withCredentials: true,
      headers: this.lowLevelLinkService.constructHeaederForCORSHeader()
    };

    return this.http.post(accountDeleteUser, formData, options);
  }

  getLoggedUserInfo() {
    return this.lowLevelLinkService.httpGetRequest(accountGetLoggedInfoUser);
  }
}