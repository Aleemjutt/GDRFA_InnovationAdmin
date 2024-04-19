import {
  HttpClient,
  HttpEvent,
  HttpHeaders,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UploadServiceService {
  private baseUrl = environment.apiUrl;
  constructor(private httpClient: HttpClient) {}

  upload(file: File, folderName: string): Observable<HttpEvent<any>> {
    console.log(file, 'file in service');
    const formData: FormData = new FormData();

    formData.append('file', file);
    formData.append('DirToSave', folderName);
    console.log(formData, 'form data');
    const req = new HttpRequest(
      'POST',
      `${this.baseUrl}Utill/UploadMultiPart`,
      formData,
      {
        reportProgress: true,
        responseType: 'json',
      }
    );

    return this.httpClient.request(req);
  }

  uploadMultiples(
    files: { file: File; instance: string }[],
    folderName: string
  ): Observable<HttpEvent<any>> {
    // Create FormData
    const formData: FormData = new FormData();

    // Append files with unique names to FormData
    for (let i = 0; i < files.length; i++) {
      formData.append(`file${i + 1}`, files[i].file);
      // Append instance name as well if needed
      // formData.append(`instance${i + 1}`, files[i].instance);
    }

    // Append additional data (if needed)
    formData.append('DirToSave', folderName);

    // Set headers
    const headers = new HttpHeaders({
      'Content-Type': 'multipart/form-data',
    });

    // Create a new HttpRequest
    const req = new HttpRequest(
      'POST',
      `${this.baseUrl}Utill/UploadMultiPartWithArrayOfInstance`,
      formData,
      {
        headers,
        reportProgress: true, // Enable progress tracking
        responseType: 'json',
      }
    );

    // Send the request
    return this.httpClient.request(req);
  }

  getFiles(): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/files`);
  }
}
