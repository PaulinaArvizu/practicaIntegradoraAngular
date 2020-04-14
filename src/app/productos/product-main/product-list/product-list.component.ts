import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Product } from '../../Product';
import { Subscription } from 'rxjs';
import { ProductsService } from '../../products.service';

@Component({
	selector: 'app-product-list',
	templateUrl: './product-list.component.html',
	styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
	modoLista = false;
	modoMonitoreo = false;
	productList: Product[];
	productListMonitoreo: Product[];
	temp;
	busqueda = '';
	
	productSubscription = new Subscription();

	constructor(private router: Router,
		private route: ActivatedRoute,
		private productService: ProductsService) {
		this.productList = this.productService.getProducts();
		this.productListMonitoreo = [];
		this.temp = [];
		this.productService.productSubject.subscribe(data => {
			// console.log(data);
			this.productList = data;
		})
		this.productService.monitorSubject.subscribe(data => {
			// console.log(data);
			this.productListMonitoreo = data;
		})
	}

	ngOnInit(): void {
		this.modoLista = this.router.url.includes('product');
		this.modoMonitoreo = this.router.url.includes('monitoreo');
	}

	buscar() {
		// console.log('buscar');
		if (this.modoLista) {
			this.productList = this.productService.getProducts().filter(p => p.nombre.toUpperCase().includes(this.busqueda.toUpperCase())
				|| p.descripcion.toUpperCase().includes(this.busqueda.toUpperCase()));
		}
		else if (this.modoMonitoreo) {
			this.productListMonitoreo = this.productService.getProducts().filter(p => p.nombre.toUpperCase().includes(this.busqueda.toUpperCase())
				|| p.descripcion.toUpperCase().includes(this.busqueda.toUpperCase()));
		}
	}

	addMonitor(prod) {
		console.log('add monitor');
		if(!this.temp.includes(prod)) this.temp.push(prod);
		// console.log(this.temp);
	}

	removeMonitor(prod) {
		console.log('remove monitor');
		let index = this.temp.findIndex(p => p.uid == prod.uid)
		if (index >= 0) this.temp.splice(index, 1);
		// console.log(this.temp);
	}

	agregarSeleccion() {
		console.log('update monitor');
		this.temp.forEach(p => {
			if(!this.productListMonitoreo.includes(p)) {
				this.productService.addMonitor(p.uid);
			}
		})
		// console.log(this.productListMonitoreo);
	}

}
