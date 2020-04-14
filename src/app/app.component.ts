import { Component } from '@angular/core';
import { ProductsService } from './productos/products.service';
import { Product } from './productos/Product';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	title = 'practicaIntegradoraAngular';
	
	constructor() { }
}
