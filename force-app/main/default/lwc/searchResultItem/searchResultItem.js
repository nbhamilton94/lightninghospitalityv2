import { LightningElement, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class SearchResultItem extends NavigationMixin(LightningElement) {
    //When SearchResultItem is clicked, navigate to the property page
    @api recordId;
    @api propertyName;
    @api nightlyRate;
    @api reviewScore;
    @api numberOfReviews;
    @api coverUrl;
    @api numberOfBedrooms;
    @api numberOfBathrooms;
    @api maximumGuests;
    @api city;
    @api totalPrice;
    @api lengthOfStay;

    connectedCallback() {
        this.totalPrice = Number((this.nightlyRate * this.lengthOfStay).toFixed(2));
    }

    handlePropertyClick() {
        // Dispatch custom event with the propertyId
        const selectEvent = new CustomEvent('propertyselect', {
            detail: this.recordId
        });
        this.dispatchEvent(selectEvent);
    }
}