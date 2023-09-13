import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponseInfoDto } from 'src/modules/shared/interfaces/response.interface';

@Injectable({
  providedIn: 'root',
})
export class GenericService<T> {
  private _baseUrl: string = environment.apiUrl;
  private _controllerName: string = '';
  setControllerName(controllerName: string) {
    this._controllerName = controllerName;
  }
  getControllerName () {
    return this._controllerName;
  }

  constructor(private http: HttpClient) {}

  add(item: T): Observable<ResponseInfoDto<T>> {
    return this.http.post<ResponseInfoDto<T>>(`${this._baseUrl}/${this._controllerName}`, item).pipe(
      catchError((err) => {
        return throwError(() => err);
      }),
    );
  }

  addWithFormData = (model: T, selectedFile?: File | null, formKey?: string) => {
    const formData = new FormData();
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    this.appendNestedObjectToFormData(formData, model);
    if (selectedFile && formKey) formData.append(formKey, selectedFile);
    return this.http.post(`${this._baseUrl}/${this._controllerName}`, formData, { headers, reportProgress: true, observe: 'events' }).pipe(
      catchError((err) => {
        return throwError(() => err.error);
      }),
    );
  };

  getById(id: number | string): Observable<ResponseInfoDto<T>> {
    return this.http.get<ResponseInfoDto<T>>(`${this._baseUrl}/${this._controllerName}/${id}`).pipe(
      catchError((err) => {
        console.log(err);
        return throwError(() => err);
      }),
    );
  }
  getAll(): Observable<ResponseInfoDto<T>> {
    return this.http.get<ResponseInfoDto<T>>(`${this._baseUrl}/${this._controllerName}`).pipe(
      catchError((err) => {
        console.log(err);
        return throwError(() => err);
      }),
    );
  }

  update(item: T): Observable<ResponseInfoDto<T>> {
    return this.http.put<ResponseInfoDto<T>>(`${this._baseUrl}/${this._controllerName}`, item).pipe(
      catchError((err) => {
        console.log(err);
        return throwError(() => err);
      }),
    );
  }

  updateWithFormData = (model: T, selectedFile?: File | null, formKey?: string) => {
    const formData = new FormData();
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    this.appendNestedObjectToFormData(formData, model);
    if (selectedFile && formKey) formData.append(formKey, selectedFile);
    return this.http.put(`${this._baseUrl}/${this._controllerName}`, formData, { headers, reportProgress: true, observe: 'events' }).pipe(
      catchError((err) => {
        console.log(err);
        return throwError(() => err);
      }),
    );
  };

  delete(id: number | string): Observable<ResponseInfoDto<T>> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.delete<ResponseInfoDto<T>>(`${this._baseUrl}/${this._controllerName}`, { headers: headers, params: { id: id } }).pipe(
      catchError((err) => {
        console.log(err);
        return throwError(() => err);
      }),
    );
  }

  appendNestedObjectToFormData(formData: FormData, object: any) {
    for (const key in object) {
      if (object.hasOwnProperty(key)) {
        const value = object[key];
        if (value !== null) {
          if (typeof value === 'object') {
            for (let i = 0; i < value.length; i++) {
              const childObject = value[i];
              for (const childKey in childObject) {
                if (childObject.hasOwnProperty(childKey)) {
                  const childValue = childObject[childKey];
                  if (childValue !== null) {
                    formData.append(`${key}[${i}].${childKey}`, childValue);
                  }
                }
              }
            }
          } else {
            formData.append(key, value);
          }
        }
      }
    }
  }
}
