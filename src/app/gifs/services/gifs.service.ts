import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchResponse } from '../interfaces/gifs.interfaces';

@Injectable({ providedIn: 'root' })
export class GifsService {
  private _tagsHistory: string[] = [];
  private apiKey: string = 'Px4RxlymgZnlcA8YoYDCeb5JYGrb3U49';
  private baseUrl: string = 'http://api.giphy.com/v1/gifs';
  public gifList: Gif[] = [];

  constructor(private http: HttpClient) {
    this.loadLocalStorage();
  }

  get tagsHistory() {
    return [...this._tagsHistory];
  }

  private organizeHistory(tag: string) {
    tag = tag.trim().toLowerCase();
    this._tagsHistory = this._tagsHistory.filter((t) => t !== tag);
    this._tagsHistory.unshift(tag);
    this._tagsHistory = this._tagsHistory.slice(0, 10);
    this.saveLocalStorage();
  }

  private saveLocalStorage() {
    localStorage.setItem('history', JSON.stringify(this._tagsHistory));
  }

  private loadLocalStorage() {
    const history = localStorage.getItem('history');
    if (history) {
      this._tagsHistory = JSON.parse(history);
    }
    if (this._tagsHistory.length === 0) return;
    this.searchTag(this._tagsHistory[0]);
  }

  searchTag(tag: string) {
    if (tag.trim().length === 0) return;
    this.organizeHistory(tag);
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('q', tag)
      .set('limit', '10');
    this.http
      .get<SearchResponse>(`${this.baseUrl}/search`, { params })
      .subscribe(({ data }) => {
        this.gifList = data;
      });
  }
}
