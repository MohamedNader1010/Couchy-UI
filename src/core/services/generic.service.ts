import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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
    return this.http.post<T>(`${this._baseUrl}/${this._controllerName}`, item);
  }

  getById(id: number): Observable<T> {
    return this.http.get<T>(`${this._baseUrl}/${this._controllerName}/${id}`);
  }
  getAll(): Observable<T[]> {
    return this.http.get<T[]>(`${this._baseUrl}/${this._controllerName}`);
  }

  update(item: T): Observable<T> {
    return this.http.put<T>(`${this._baseUrl}/${this._controllerName}`, item);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this._baseUrl}/${this._controllerName}/${id}`);
  }
}
