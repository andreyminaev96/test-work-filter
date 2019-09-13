import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { FiltersService } from 'src/app/shared/filters.service';
import { NewCategories, FiltersData } from './../../shared/interfaces';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent implements OnInit, OnDestroy{
  public showSelectOption = false;
  public showFiltersDropDown: boolean;
  public valueRange = { lower: 0, upper: 250 };
  public categoryFilter: number[] = [];
  public categories: NewCategories[] = [];
  public selectValue = `all cities`;
  public cityId: number;
  public innerWidth: any;
  public isDesktop: boolean;
  private cSub: Subscription;
  private fSub: Subscription;

  constructor(public service: FiltersService) { }

  ngOnInit() {
    const localFilters = JSON.parse(localStorage.getItem('filtersData'));
    this.setLocaleFilters(localFilters);

    this.innerWidth = window.innerWidth;
    if (this.innerWidth < 768) {
      this.isDesktop = false;
      this.showFiltersDropDown = false;
    } else {
      this.isDesktop = true;
      this.showFiltersDropDown = false;
    }

    this.cSub = this.service.getCategories().subscribe(categories => {
      if (localFilters) {
        categories.forEach(category => {
          localFilters[`categories`].forEach(item => {
            if (category.id === item) {
              category.isChecked = true;
            }
          });
        });
      }
      this.categories = [...categories];
    });

  }


  @HostListener('window:resize')
    onResize() {
      this.innerWidth = window.innerWidth;
      if (this.innerWidth < 768) {
        this.isDesktop = false;
      } else {
        this.isDesktop = true;
        this.showFiltersDropDown = false;
      }
    }

  setLocaleFilters(localFilters: FiltersData) {
    if (localFilters) {
      this.categoryFilter = [...localFilters[`categories`]];
      this.cityId = +localFilters.city;
      this.valueRange = localFilters.price;
      this.selectValue = localFilters.cityName;

      if (!localFilters.city) {
        localFilters.city = null;
      }

      this.handlerFilters(localFilters);
    }
  }


  openSelect() {
    this. showSelectOption = !this.showSelectOption;
  }

  selectChanges(cityName: string, id: number) {
    this.selectValue = cityName;
    this.cityId = id;
  }

  handlerCheckbox(ev: Event, id: number) {
    const { target } = ev;

    if (!target[`checked`]) {
      this.categoryFilter.push(id);
    } else {
      this.categoryFilter = this.categoryFilter.filter(item => item !== id);
    }
  }

  handlerFilters(filters?: FiltersData) {

    if (!this.isDesktop) {
      this.openFiltersDropDown();
    }

    const filtersData = {
      city : this.cityId,
      categories: this.categoryFilter,
      price: this.valueRange,
      cityName: this.selectValue,
      data: [],
    };

    if (filters) {
      this.service.emitNewData(filters.data);
      localStorage.clear();
    } else {
      this.fSub = this.service.setFilters({...filtersData}).subscribe(data => {
        filtersData[`data`] = data;
        localStorage.setItem('filtersData', JSON.stringify(filtersData));
        this.service.emitNewData(data);
      });
    }
  }

  openFiltersDropDown() {
    this.showFiltersDropDown = !this.showFiltersDropDown;
  }

  ngOnDestroy() {
    if (this.cSub) {
      this.cSub.unsubscribe();
    }
    if (this.fSub) {
      this.fSub.unsubscribe();
    }
  }

}
