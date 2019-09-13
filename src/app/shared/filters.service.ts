import { Injectable} from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { Data, Category, NewCategories} from './interfaces';

const arrFilter = (categories, data): [] => {
  const items: any = [];
  categories.forEach(id => {
    data.forEach(item => {
      if (item.category === id) {
        items.push(item);
      }
    });
  });
  return items;
};

@Injectable({
  providedIn: 'root'
})
export class FiltersService {

  constructor() { }

  public categories = [
    {id: 1, name: 'Category 1'},
    {id: 2, name: 'Category 2'},
    {id: 3, name: 'Category 3'},
    {id: 4, name: 'Category 4'},
    {id: 5, name: 'Category 5'},
  ];

  public cities = [
    {id: 1, name: 'City 1'},
    {id: 2, name: 'City 2'},
    {id: 3, name: 'City 3'},
    {id: 4, name: 'City 4'},
    {id: 5, name: 'City 5'},
    {name: 'all cities'}
  ];

  public data = [
    {id: 1, name: 'Name 1', city: 1, category: 2, price: 50},
    {id: 2, name: 'Name 2', city: 4, category: 1, price: 100},
    {id: 3, name: 'Name 3', city: 5, category: 1, price: 1},
    {id: 4, name: 'Name 4', city: 2, category: 4, price: 150},
    {id: 5, name: 'Name 5', city: 3, category: 5, price: 200}
  ];

  public filetData: Data[] = [];
  public newCategories: Category[] = [];

  private $dataSource = new BehaviorSubject(this.data);
  public dataObservableSubject = this.$dataSource.asObservable();

  getCategories(): Observable<NewCategories[]> {
    this.createNewCategories();
    return of(this.newCategories);
  }

  setFilters({city, categories, price}): Observable<Data[]> {
    if (city && categories.length !== 0 && price) {
      const data = arrFilter(categories, this.data);
      this.filetData = data.filter(item => item[`city`] === city && item[`price`] > price.lower && item[`price`] <= price.upper);
    } else if (city && categories.length !== 0 ) {
      const data = arrFilter(categories, this.data);
      this.filetData = data.filter(item => item[`city`] === city);
    } else if (city && price) {
        this.filetData = this.data
          .filter(item => item.city === city && item.price > price.lower && item.price <= price.upper);
    } else if (categories.length !== 0  && price) {
        const data = arrFilter(categories, this.data);
        this.filetData = data.filter(item => item[`price`] > price.lower && item[`price`] <= price.upper);
    } else if (price) {
        this.filetData = this.data.filter(item => item.price > price.lower && item.price <= price.upper);
    }
    return of(this.filetData);
  }

  emitNewData(data: any[]) {
    this.$dataSource.next(data);
  }


  private createNewCategories() {
    this.categories.forEach(category => {
      const result = new Object();
      const item = {...category};
      item[`isChecked`] = false;
      this.data.forEach(el => result[el.category] ? result[el.category]++ : result[el.category] = 1);
      Object.keys(result).forEach(sum => {
          if ( +sum === category.id) {
            item[`sum`] = result[sum];
          }
      });
      this.newCategories.push(item);
    });
  }
}
