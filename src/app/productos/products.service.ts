import { Injectable } from '@angular/core';
import { Product, Especificacion } from './Product';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class ProductsService {
	productos: Product[];
	monitoreo: Product[];

	productSubject = new BehaviorSubject<Product[]>([]); //mantiene el ultimo estado del subject (si se modifica algo, todos los componentes se quedan con la ultima version)
	monitorSubject = new BehaviorSubject<Product[]>([]); //mantiene el ultimo estado del subject (si se modifica algo, todos los componentes se quedan con la ultima version)

	constructor() {
		this.productos = [new Product(1, "Smartphone", "LG", "Quadcore 3GHz", 12018.5, 5, [
							new Especificacion('Memoria RAM', '4', 'GB'),
							new Especificacion('Memoria interna', '64', 'GB'),
							new Especificacion('SO', 'Android 9', '')
						]),
						new Product(2, "adios", "adios", "asdf", 5, 4, [])
					];
		this.monitoreo = [];
		// this.addMonitor(1);
		this.productSubject.next(this.getProducts()); //emision del conjunto de productos
		this.monitorSubject.next(this.getMonitors()); //emision del conjunto de monitoreo
	}

	getProducts(): Product[] {
		return this.productos.slice();
	}

	getOneProduct(id): Product {
		let found = this.productos.find(p => p.uid == id);
		return Object.assign({}, found);
	}

	editProduct(newProd): void {
		let product = Object.assign({}, newProd); //hace una copia de lo que recibe
		let index = this.productos.findIndex(p => p.uid == newProd.uid) //busca el indice del producto
		if (index >= 0) this.productos.splice(index, 1, product); //si lo encuentra, lo sustituye con el nuevo
		
		//edita tambien en la lista de monitoreo
		index = this.monitoreo.findIndex(p => p.uid == newProd.uid) //busca el indice del producto
		if (index >= 0) this.monitoreo.splice(index, 1, product); //si lo encuentra, lo sustituye con el nuevo
		
		//actualiza los cambios
		this.productSubject.next(this.getProducts());
		this.monitorSubject.next(this.getMonitors());
		// console.log(this.productos);
		// console.log(this.monitoreo);
	}

	newProduct(uid, nombre, marca, descripcion, precio, existencia, especif): void {
		this.productos.push(new Product(uid, nombre, marca, descripcion, precio, existencia, especif));
		//actualiza los cambios
		this.productSubject.next(this.getProducts());
		this.monitorSubject.next(this.getMonitors());
		// console.log(this.productos);
	}

	deleteProduct(id): void {
		let index = this.productos.findIndex(p => p.uid == id)
		if (index >= 0) this.productos.splice(index, 1);
		// eliminar tambien de lista de monitoreo
		this.deleteMonitor(id);
		
		//actualiza los cambios
		this.productSubject.next(this.getProducts());
		this.monitorSubject.next(this.getMonitors());
	}

	getMonitors(): Product[] {
		return this.monitoreo.slice();
	}

	addMonitor(id) {
		let index = this.productos.findIndex(p => p.uid == id) //busca que exista el producto en la lista orginal
		if (index >= 0 && !this.monitoreo.includes(this.productos[index])) { //si existe y monitoreo no lo tiene, lo agrega
			this.monitoreo.push(this.productos[index]);
		}
		this.monitorSubject.next(this.getMonitors()); //actualiza los cambios
	}

	deleteMonitor(id): void {
		let index = this.monitoreo.findIndex(p => p.uid == id)
		if (index >= 0) this.monitoreo.splice(index, 1);
		this.monitorSubject.next(this.getMonitors()); //actualiza los cambios
	}
}
