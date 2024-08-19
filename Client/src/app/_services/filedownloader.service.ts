import {
  HttpClient,
  HttpHeaders,
  HttpResponse,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GlobalServiceService } from '../_global/-global-service.service';

@Injectable({
  providedIn: 'root',
})
export class FiledownloaderService {
  baseUrl = environment.apiUrl;
  http: any;
  constructor(
    private httpClient: HttpClient,
    private globalService: GlobalServiceService
  ) {}

  downloadFile(url: string): Observable<Blob> {
    if (url === null) {
      // Handle null URL gracefully
    }

    const serverUrl = `${this.baseUrl}/Utill/Download`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept-Language': this.globalService.getCurrentLanguage(),
      // Add any additional headers as needed
    });

    const params = new HttpParams().set('fileUrl', url);

    const options = {
      headers: headers,
      reportProgress: true,
      responseType: 'blob' as 'json', // Set responseType to 'blob'
      params: params, // Set params
    };

    return this.http.get(serverUrl, options).pipe(
      map((response: HttpResponse<Blob>) => {
        return response.body; // Return the blob response
      }),
      catchError((error) => {
        return throwError('Failed to download file'); // Handle error gracefully
      })
    );
  }

  saveFile(blob: Blob, fileName: string): void {
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    link.target = '_blank';
    link.click();
    document.body.removeChild(link);
  }

  // Example usage
  downloadAndSaveFile(url: string, fileName: string): void {
    this.downloadFile(url).subscribe((blob: Blob) => {
      this.saveFile(blob, fileName);
    });
  }

  downloadFileLocal(url: string) {}

  download(fileUrl: string) {
    return this.httpClient.get(
      `${this.baseUrl}Utill/Download?fileUrl=${encodeURIComponent(fileUrl)}`,
      {
        reportProgress: true,
        responseType: 'blob',
      }
    );
  }
  saveAndDownload(data: HttpResponse<Blob>) {}

  downloadBase64File(
    base64String: string,
    fileName: string,
    mimeType: string
  ): void {
    // Convert Base64 string to a Blob
    const blob = this.base64ToBlob(base64String, mimeType);

    // Create a URL for the Blob
    const url = window.URL.createObjectURL(blob);

    // Create an anchor element and simulate a click to download the file
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();

    // Cleanup
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  private base64ToBlob(base64String: string, mimeType: string): Blob {
    // Decode Base64 string
    const byteCharacters = atob(base64String);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  }
}
