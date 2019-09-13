import { Component, OnInit } from '@angular/core';
import { FiltersService } from 'src/app/shared/filters.service';
import { Data, NewData } from './../../shared/interfaces';

@Component({
  selector: 'app-filter-content',
  templateUrl: './filter-content.component.html',
  styleUrls: ['./filter-content.component.scss'],
})
export class FilterContentComponent implements OnInit {
  public imgUrl = 'https://i.ytimg.com/vi/2HcBR3DQUQ4/maxresdefault.jpg';
  public cards: NewData[];

  constructor(private service: FiltersService) { }

  ngOnInit() {
    this.service.dataObservableSubject.subscribe((data: Data[]) => {
      const newDate = this.createNewDate(data);
      this.cards = [...newDate];
    });
  }

  createNewDate(data: Data[]) {
    const tmpArray = [];
    data.forEach(el => {
      const item = { ...el };
      this.service.cities.forEach(city => {
        if (el.city === city.id) {
          item[`cityName`] = city.name;
        }
      });
      this.service.categories.forEach(category => {
        if (el.category === category.id) {
          item[`categoryName`] = category.name;
        }
      });
      tmpArray.push(item);
    });
    return tmpArray;
  }

}
