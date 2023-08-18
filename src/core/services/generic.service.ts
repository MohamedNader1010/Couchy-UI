import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environment';

@Injectable({
  providedIn: 'root',
})
export class GenericService<T> {
  private _baseUrl: string = environment.apiUrl;
  private _controllerName: string = '';
  setControllerName(controllerName: string) {
    this._controllerName = controllerName;
  }
  constructor(private http: HttpClient) {}

  add(item: T): Observable<T> {
    return this.http.post<T>(`${this._baseUrl}/${this._controllerName}`, item).pipe(
      catchError((err) => {
        console.log(err);
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
        console.log(err);
        return throwError(() => err);
      }),
    );
  };

  getById(id: number): Observable<T> {
    return this.http.get<T>(`${this._baseUrl}/${this._controllerName}/${id}`).pipe(
      catchError((err) => {
        console.log(err);
        return throwError(() => err);
      }),
    );
  }
  getAll(): Observable<T[]> {
    return this.http.get<T[]>(`${this._baseUrl}/${this._controllerName}`).pipe(
      catchError((err) => {
        console.log(err);
        return throwError(() => err);
      }),
    );
  }

  update(item: T): Observable<T> {
    return this.http.put<T>(`${this._baseUrl}/${this._controllerName}`, item).pipe(
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

  delete(id: number): Observable<void> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.delete<void>(`${this._baseUrl}/${this._controllerName}`, { headers: headers, params: { id: id } }).pipe(
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
