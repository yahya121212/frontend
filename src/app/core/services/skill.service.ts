import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SkillService {
  private baseUrl = `${environment.apiUrl}/skills`; // URL to get zip codes

  constructor(private http: HttpClient) {}

  createSkill(skill: any) {
    return this.http.post<any>(`${this.baseUrl}/create`, skill);
  }

  getSkills(): Observable<any> {
    return this.http.get<any>(this.baseUrl);
  }
}
