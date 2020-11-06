import { Component, OnInit } from '@angular/core';
import { CartItem } from 'src/app/common/cart-item';
import { CartServiceService } from 'src/app/services/cart-service.service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css']
})
export class CartDetailsComponent implements OnInit {

  cartItems: CartItem[] = [];
  totalPrice: number = 0;
  totalQuantity: number = 0;



  constructor(private cartService: CartServiceService) { }

  ngOnInit(): void {

    this.listCartDetails();
  }

  listCartDetails() {
    //get a handle tot he cart items
    this.cartItems = this.cartService.cartItems;

    //subscribe to the cart totalPrice
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );

    //subscribe to the cart totalQuantity
    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );

    //compute cart total price and total quantity
    this.cartService.computeCartTotal();


  }

  increaseQuantity(tempCartItem: CartItem){

    this.cartService.addToCart(tempCartItem);
    // // here we increment the quantity of the exact product by 1
    // for(let temCartItem of this.cartItems){
    //   if(temCartItem.id === tempCartItemId){

    //     temCartItem.quantity++;
    //     break;

    //   }
    // }

    // this.listCartDetails();

    // // this.cartService.totalQuantity.subscribe(
    // //   data => this.totalQuantity = data
    // // );

    // // this.cartService.totalPrice.subscribe(
    // //   data => this.totalPrice = data
    // // );

    // // this.cartService.computeCartTotals();


      

  }

  decreaseQuantity(theCartItem: CartItem){
    this.cartService.decreaseQuantity(theCartItem);


  }

  remove(theCartItem: CartItem){
    this.cartService.remove(theCartItem);
  }


}
