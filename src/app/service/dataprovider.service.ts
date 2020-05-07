import { Injectable } from '@angular/core';
import { HarvestMouse } from '../interface/harvestmouse';
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';

let serverBaseUrl: string = ' https://mousemanagement.herokuapp.com/harvestedmouse/';
export let harvestMouseListUrl: string = serverBaseUrl + 'list';
export let harvestMouseFileUploadUrl: string = serverBaseUrl + 'import';

@Injectable({
   providedIn: 'root'
})
export class DataproviderService {

   harvestMouseList: HarvestMouse[];
   constructor(private http: HttpClient) { }

   /*
   Function name: httpPostRequest
   Description: Making the http post request to the desired URL server,
                      the caller must make sure no null value pass into the function
   */
   httpPostRequest(formData: FormData, httpHeader: HttpHeaders, url: string) {
      let options = {
         headers: httpHeader
      }

      return this.http.post(url, formData, options);
   }

   /*
   Function name: httpGetRequest
   Description: Making the http get request to the desired URL server with 
                      optional parameters
   */
   httpGetRequest(url: string, params?: string[]) {
      let httpParams = new HttpParams();
      if (params) {
         for (var idx = 0; idx < params.length; idx++) {
            let para = params[idx];
            let splitedArray = para.split(':');

            // The param must in key : value pair
            if (splitedArray.length == 2) {
               let keyword = splitedArray[0];
               let keywordSplitCheck = para.split(',');

               // The keyword must be colName, operation_ID pair
               if (keywordSplitCheck.length == 2) {
                  let value = splitedArray[1];
                  // adding parameter to the urlParams array
                  httpParams = httpParams.set(keyword, value);
               }
               else {
                  // skip current loop since the value is invalid
                  continue;
               }
            }
            else {
               // skip current loop since the value is invalid
               continue;
            }
         }
      }
      else {
         httpParams = undefined;
      }
      return this.http.get(url, { params: httpParams });
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
   Function name: FileUploadRequest
   Description: Upload the file to the server and make the import operation,
                      fail to provide the file will return null value
   */
   fileUploadRequest(file: File, url: string) {
      // Make sure there is a file to upload
      if (file) {
         let formData: FormData = new FormData();
         formData.append('file', file, file.name);

         // Setting up http headers for the file uploading
         let headers = new HttpHeaders({
            'enctype': 'multipart/form-data',
            'Accept': 'application/json'
         });

         // Insert into the option field
         let options = {
            headers: headers
         }

         return this.httpPostRequest(formData, headers, url);
      }
      else {
         return null;
      }
   }
}
