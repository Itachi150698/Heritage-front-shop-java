import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor() { }

    private searchQuery = new BehaviorSubject<string>('');
  currentSearchQuery = this.searchQuery.asObservable();

  updateSearchQuery(query: string) {
    console.log('Search query updated:', query); // Debugging line
    this.searchQuery.next(query);
  }
}
