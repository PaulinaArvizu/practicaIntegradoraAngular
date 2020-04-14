import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Product } from 'src/app/productos/Product';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductsService } from 'src/app/productos/products.service';

@Component({
	selector: 'app-product',
	templateUrl: './product.component.html',
	styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
	@Input() product: Product;
	@Input() modoLista: boolean;
	@Output() checked = new EventEmitter();
	@Output() unchecked = new EventEmitter();

	monitor = false;

	productSubscription = new Subscription();

	constructor(private router: Router,
				private route: ActivatedRoute,
				private productService: ProductsService) {
		this.productService.productSubject.subscribe(data => {
			// console.log(data);
			// this.product = data.find(p => p.uid == this.route.params._value.id);
		})
	}

	ngOnInit(): void {
		// console.log(this.product);
	}

	eliminar() {
		console.log('delete');
		if(this.modoLista) {
			this.productService.deleteProduct(this.product.uid);
		} else {
			this.productService.deleteMonitor(this.product.uid);
		}
	}

	agregarMonitoreo(value) {
		// console.log(value);
		if(value) this.checked.emit(this.product); //manda el producto a la lista temporal de monitoreados
		else this.unchecked.emit(this.product); //manda el producto para quitarlo de la lista temporal
	}

}
