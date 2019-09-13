export interface Category {
    id?: number;
    name: string;
}
export interface City {
    id?: number;
    name: string;
}
export interface Data {
    id?: number;
    name: string;
    city: number;
    category: number;
    price: number;
}
export interface NewData {
    id?: number;
    name: string;
    city: number;
    category: number;
    price: number;
    cityName: string;
    categoryName: string;
}
export interface NewCategories  {
    id?: number;
    name: string;
    isChecked?: boolean;
    sum?: number;
}
export interface FiltersData {
    city : number;
    categories: [];
    price: any;
    cityName: string;
    data?: [];
}
