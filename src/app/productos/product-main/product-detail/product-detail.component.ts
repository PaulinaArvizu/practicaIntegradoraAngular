import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Product } from '../../Product';
import { Subscription } from 'rxjs';
import { ProductsService } from '../../products.service';

@Component({
	selector: 'app-product-detail',
	templateUrl: './product-detail.component.html',
	styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {

	productSubscription = new Subscription();
	product: Product;

	constructor(private router: Router,
				private route: ActivatedRoute,
				private productService: ProductsService) {
		let id = Number(this.router.url.split('/')[2]);
		this.product = this.productService.getOneProduct(id);
		// this.product = this.productService.getOneProduct(this.route.params._value.id);
		this.productService.productSubject.subscribe(data => {
			// console.log(data);
			this.product = data.find(p => p.uid == id);
			// this.product = data.find(p => p.uid == this.route.params._value.id);
		})
		// console.log(this.route.params._value.id);
	}

	ngOnInit(): void {

	}

}
