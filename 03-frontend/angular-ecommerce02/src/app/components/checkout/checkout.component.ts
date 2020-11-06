import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { BraavoShopFormService } from 'src/app/services/braavo-shop-form.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {


  checkoutFormGroup: FormGroup;
  totalPrice: number = 0;
  totalQuantity: number = 0;
  creditCardYears: number[] = [];
  creditCardMonths: number[] =[];

  countries: Country[] = [];

  shippingAddressStates: State[] = [];

  billingAddressStates: State[] = [];

  constructor(private formBuilder: FormBuilder, 
              private braavoShopService: BraavoShopFormService) { }


  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('',[Validators.required,
                                        Validators.minLength(2)]),
      
      lastName: new FormControl('', [Validators.required,
                                     Validators.minLength(2)]),

      
      email: new FormControl('',[Validators.required,
                                  Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])                                     
      

      }),


      shippingAdress: this.formBuilder.group({
        country: new FormControl('',[Validators.required]),

        state: new FormControl('',[Validators.required]),


        city: new FormControl('',[Validators.required,
                                  Validators.minLength(2)]),



        street: new FormControl('',[Validators.required,
                                    Validators.minLength(2)]),


        zipCode: new FormControl('',[Validators.required,
                                    Validators.minLength(2)])

      }),

      billingAddress: this.formBuilder.group({

        country: new FormControl('',[Validators.required]),

        state: new FormControl('',[Validators.required]),


        city: new FormControl('',[Validators.required,
                                  Validators.minLength(2)]),



        street: new FormControl('',[Validators.required,
                                    Validators.minLength(2)]),


        zipCode: new FormControl('',[Validators.required,
                                    Validators.minLength(2)])

      }),

      creditCart: this.formBuilder.group({

        cardType: new FormControl('',[Validators.required]),

        nameOnCard: new FormControl('',[Validators.required,
                                          Validators.minLength(2)]),

        cardNumber: new FormControl('',[Validators.required,
                                        Validators.pattern('[0-9]{16}')]),
        
        cityCode: new FormControl('',[Validators.required,
                                      Validators.pattern('[0-9]{3}')]),
        
                                      
        expMonth: [''],
        expYear: ['']                                      

      })


    });

    //populate credit card months

    const startMonth: number = new Date().getMonth() + 1;
    console.log("startMonth: " + startMonth);

    this.braavoShopService.getCreditCardMonths(startMonth).subscribe(
      data =>{
        console.log("Retrive credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );

    //populate credit card years

    this.braavoShopService.getCreditCardYears().subscribe(
      data => {
        console.log("Retrieve credit card years: " + JSON.stringify(data));
        this.creditCardYears = data;
      }
    )

    //populate countries

    this.braavoShopService.getCountries().subscribe(
      data => {
        console.log("Retrieve countries: " + JSON.stringify(data));
        this.countries = data;
      }
    )


 }

 onSubmit(){

  console.log("handling the submit button");

  if(this.checkoutFormGroup.invalid){
    this.checkoutFormGroup.markAllAsTouched()
  }

  console.log(this.checkoutFormGroup.get('customer').value);
  console.log("The shipping address is " +this.checkoutFormGroup.get('shippingAddress').value.country.name);
  console.log("The shipping address is " +this.checkoutFormGroup.get('shippingAddress').value.state.name);

}

  get firstName() { return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName() { return this.checkoutFormGroup.get('customer.lastName'); }
  get email() { return this.checkoutFormGroup.get('customer.email'); }

  get shippingAddressStreet() { return this.checkoutFormGroup.get('shippingAddress.street'); }
  get shippingAddressCity() { return this.checkoutFormGroup.get('shippingAddress.city'); }
  get shippingAddressState() { return this.checkoutFormGroup.get('shippingAddress.state'); }
  get shippingAddressZipCode() { return this.checkoutFormGroup.get('shippingAddress.zipCode'); }
  get shippingAddressCountry() { return this.checkoutFormGroup.get('shippingAddress.country'); }

  get billingAddressStreet() { return this.checkoutFormGroup.get('billingAddress.street'); }
  get billingAddressCity() { return this.checkoutFormGroup.get('billingAddress.city'); }
  get billingAddressState() { return this.checkoutFormGroup.get('billingAddress.state'); }
  get billingAddressZipCode() { return this.checkoutFormGroup.get('billingAddress.zipCode'); }
  get billingAddressCountry() { return this.checkoutFormGroup.get('billingAddress.country'); }

  get creditCardType() { return this.checkoutFormGroup.get('creditCard.cardType'); }
  get creditCardNameOnCard() { return this.checkoutFormGroup.get('creditCard.nameOnCard'); }
  get creditCardNumber() { return this.checkoutFormGroup.get('creditCard.cardNumber'); }
  get creditCardSecurityCode() { return this.checkoutFormGroup.get('creditCard.securityCode'); }


copyShippingAddressToBillingAddress(event){

  if(event.targer.checked){
    this.checkoutFormGroup.controls.billingAddress.setValue(this.checkoutFormGroup.controls.shippingAddress.value);


    //bug fix for states
    this.billingAddressStates = this.shippingAddressStates;

  }else{
    this.checkoutFormGroup.controls.billingAddress.reset();

    //bug fix for states
    this.billingAddressStates = [];
  }
}

handleMonthsAndYears(){

  const creditCadrFormGrouup = this.checkoutFormGroup.get('creditCart');
  const currentYear: number = new Date().getFullYear();
  const selectedYear: number = Number(creditCadrFormGrouup.value.expYear);

  //if the current year equals the selected yeaer, then start with month

  let startMonth: number;

  if(currentYear === selectedYear){
    startMonth = new Date().getMonth() + 1;
  }else{
    startMonth = 1;
  }

  this.braavoShopService.getCreditCardMonths(startMonth).subscribe(
    data => {
      console.log("Retrieved credit card months: " + JSON.stringify(data));
      this.creditCardMonths = data;
    }
  )


}

getStates(formGroupName: string){
  const formGroup = this.checkoutFormGroup.get(formGroupName);
  
  const countryCode = formGroup.value.country.code;
  const countryName = formGroup.value.country.name;

  console.log(`${formGroupName} country code: ${countryCode}`);
  console.log(`${formGroupName} country code: ${countryName}`);

  this.braavoShopService.getStates(countryCode).subscribe(
    data => {
      if(formGroupName === 'shippingAddress'){
        this.shippingAddressStates = data;
      }else{
        this.billingAddressStates = data;
      }

      //select first item by default

      formGroup.get('state').setValue(data[0]);
    }
  );



}


}
