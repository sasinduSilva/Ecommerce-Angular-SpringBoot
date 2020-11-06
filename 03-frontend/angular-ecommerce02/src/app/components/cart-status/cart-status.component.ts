import { Component, OnInit } from '@angular/core';
import { CartServiceService } from 'src/app/services/cart-service.service';

@Component({
  selector: 'app-cart-status',
  templateUrl: './cart-status.component.html',
  styleUrls: ['./cart-status.component.css']
})
export class CartStatusComponent implements OnInit {

  totalPrice: number = 0.00;
  totalQuantity: number = 0;

  constructor(private cartService: CartServiceService) { }

  ngOnInit(): void {
    this.upgradeCartStatus();
  }

  upgradeCartStatus() {
    // subscribe to the cart TotalPrice
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );

    //subscribe to the cart totalQuantity
    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );
  }

}
