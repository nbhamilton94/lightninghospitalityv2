import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import  findAvailableProperties  from '@salesforce/apex/CustomSearchController.findAvailableProperties';

export default class HomeSearchComponent extends NavigationMixin(LightningElement) {

    checkInDate = '';
    checkOutDate = '';
    selectedCity = 'Austin';
    error = '';

    get cityOptions() {
        return [
            { label: 'Austin', value: 'Austin' },
            { label: 'Dallas', value: 'Dallas' }
        ]
    }

    handleFieldChange(event) {
        this.error = ''; // Clear any previous errors
        const fieldName = event.target.name;
        if (fieldName === 'checkindate') {
            this.checkInDate = event.target.value;
        } else if (fieldName === 'checkoutdate') {
            this.checkOutDate = event.target.value;
        } else if (fieldName === 'city') {
            this.selectedCity = event.target.value;
        }
    }

    async handleClick() {
        try {
            this.error = ''; // Clear any previous errors

            console.log('checkInDate: ' + this.checkInDate);
            console.log('checkOutDate: ' + this.checkOutDate);
            console.log('selectedCity: ' + this.selectedCity);

            const availableProperties = await findAvailableProperties({checkInDate : this.checkInDate, checkOutDate : this.checkOutDate});
            
            sessionStorage.setItem('customSearch--checkInDate', JSON.stringify(this.checkInDate));
            sessionStorage.setItem('customSearch--checkOutDate', JSON.stringify(this.checkOutDate));
            sessionStorage.setItem('customSearch--recordIds', JSON.stringify(availableProperties));
            
            this[NavigationMixin.Navigate]({
                type: 'standard__webPage',
                attributes: {
                    url: '/custom-search-results'
                }
            });

        } catch (error) {
            this.error = error.body?.message || error.message || 'An error occurred while searching for properties';
            console.error('Error retrieving available properties', this.error);
        }
    }
}