import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../../products.service';
import { Product, Especificacion } from '../../Product';
import { NgForm } from '@angular/forms';

@Component({
	selector: 'app-product-edit',
	templateUrl: './product-edit.component.html',
	styleUrls: ['./product-edit.component.scss']
})
export class ProductEditComponent implements OnInit {

	productID;
	product: Product;
	newProduct;
	modoNew = false;
	modoEdit = false;
	spec = {
		atributo: '',
		valor: '',
		unidad: ''
	};
	marcas = [];
	ids = [];
	disabled = true;

	@ViewChild('f') form: NgForm;

	constructor(private router: Router,
		private route: ActivatedRoute,
		private productService: ProductsService) {
		let id = Number(this.router.url.split('/')[2]);
		this.product = this.productService.getOneProduct(id);
		this.newProduct = Object.assign({}, this.product);

		this.productService.getProducts().map(p => {
			if (!this.marcas.includes(p.marca))
				this.marcas.push(p.marca);
		});
		this.ids = this.productService.getProducts().map(p => p.uid);

		// this.product = this.productService.getOneProduct(this.route.params._value.id);
		this.productService.productSubject.subscribe(data => {
			// console.log(data);
			this.product = data.find(p => p.uid == id);
			this.newProduct = Object.assign({}, this.product);
			// this.product = data.find(p => p.uid == this.route.params._value.id);

			this.productService.getProducts().map(p => {
				if (!this.marcas.includes(p.marca))
					this.marcas.push(p.marca);
			});
			this.ids = this.productService.getProducts().map(p => p.uid);
		})
	}

	ngOnInit(): void {
		this.modoNew = this.router.url.includes('new');
		this.modoEdit = this.router.url.includes('edit');
	}

	addSpec() {
		this.newProduct.especificacion.push(new Especificacion(this.spec.atributo, this.spec.valor, this.spec.unidad));
		this.isValid();
	}

	deleteSpec(spec) {
		console.log('delete spec');
		let index = this.newProduct.especificacion.findIndex(e => e == spec)
		if (index >= 0) this.newProduct.especificacion.splice(index, 1);
		this.isValid();
	}

	isValid() {
		if(this.modoEdit) {
			this.disabled = this.newProduct.nombre == '' || this.newProduct.marca == '';
		}
		if(this.modoNew) {
			this.disabled = this.newProduct.nombre == '' || this.newProduct.marca == ''
			|| this.newProduct.uid == '' || (this.ids.includes(Number(this.newProduct.uid)));
		}
		// console.log(this.ids);
	}

	procesarFormulario(form: NgForm) {
		if (this.modoEdit) {
			console.log('Guarda edicion');
			this.productService.editProduct(this.newProduct);
		} else if (this.modoNew) {
			console.log('Crea el producto');
			this.productService.newProduct(
				Number(this.newProduct.uid), this.newProduct.nombre,
				this.newProduct.marca, this.newProduct.descripcion,
				this.newProduct.precio, this.newProduct.existencia,
				this.newProduct.especificacion);
		}
	}
}
