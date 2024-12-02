import { LightningElement, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class SearchResultsList extends NavigationMixin(LightningElement) {
    
    //The @api decorator is used to make a property or method public and accessible from outside the component
    @api availableProperties;
    @api mapMarkers;
    @api markersTitle = 'Available Properties';
    @api selectedMarkerValue;
    @api zoomLevel = 11;
    @api checkInDate;
    @api checkOutDate;
    @api availablePropertiesNotEmpty;
    @api lengthOfStay;

    //Internal properties not to be exposed to the parent.
    availablePropertiesJSON;
    checkinDateJSON;
    checkOutDateJSON;
    body;
    /* 
        connectedCallback is called when the component is inserted into the DOM
        It's essentially the same thing as Aura init
    */
    connectedCallback() {
        //retrieve available properties JSON from session storage
        try {
            this.availablePropertiesJSON = sessionStorage.getItem('customSearch--recordIds');
            this.checkinDateJSON = sessionStorage.getItem('customSearch--checkInDate');
            this.checkOutDateJSON = sessionStorage.getItem('customSearch--checkOutDate');

            //Parse each JSON
            this.availableProperties = JSON.parse(this.availablePropertiesJSON);
            this.checkInDate = JSON.parse(this.checkinDateJSON);
            this.checkOutDate = JSON.parse(this.checkOutDateJSON);
            console.log('CHECK IN DATE: ', this.checkInDate);
            console.log('CHECK OUT DATE: ', this.checkOutDate);
            
            // Calculate length of stay
            const checkIn = new Date(this.checkInDate);
            const checkOut = new Date(this.checkOutDate);
            const timeDiff = checkOut.getTime() - checkIn.getTime();
            this.lengthOfStay = Number((timeDiff / (1000 * 3600 * 24)).toFixed(2));
            console.log('LENGTH OF STAY: ', this.lengthOfStay);

            this.availablePropertiesNotEmpty = this.availableProperties.length > 0;

            this.mapMarkers = this.availableProperties.map(property => { 
                // Format price with dollar sign and no decimal places

                const description = property.property.Property_Description__c + 
                                  '\n\nView full property details for more information.';
                
                return {
                    location: {
                        Street: property.address.Street,
                        City: property.address.City,
                        State: property.address.State,
                        Country: 'USA'
                    },
                    title: property.property.Nickname__c,
                    description: description,
                    value: property.property.Id, 
                    mapIcon: {
                        path: 'M 125,5 155,90 245,90 175,145 200,230 125,180 50,230 75,145 5,90 95,90 z',
                        fillColor: '#4fa5a0',
                        fillOpacity: 0.8,
                        strokeWeight: 1,
                        scale: 0.1,
                    }
                };
            });
            
        //select the entire page and remove the surrounding padding to make the map flush with the page
        this.body = document.querySelector('div[class="slds-col--padded contentRegion comm-layout-column"]');
        console.log('BODY: ', this.body);
        this.body.className = ''; 
        
        } catch (error) {
            console.log('Error parsing JSON: ', error);
        }
    }
    
    renderedCallback() {
        // Remove padding from Experience Builder container
        const container = document.querySelector('div[class="slds-col--padded contentRegion comm-layout-column"]');
        if (container) {
            container.style.padding = '0';
            container.style.margin = '0';
            container.style.maxHeight = '100vh';
            container.style.maxWidth = '100%';
        }
        
        // Remove padding from body and html
        document.body.style.margin = '0';
        document.body.style.padding = '0';
        document.documentElement.style.margin = '0';
        document.documentElement.style.padding = '0';
    }    

    handleMarkerSelect(event) {
        const selectedMarker = event.detail.selectedMarkerValue;
        const selectedProperty = this.availableProperties.find(
            property => property.property.Id === selectedMarker
        );
        
        if (selectedProperty) {
            // Navigate to property detail or show modal with full details
            this.navigateToPropertyPage(selectedProperty);
        }
    }

    navigateToPropertyPage(event){
        const recordId = event.detail;
        sessionStorage.setItem('customSearch--recordId', recordId);

        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: '/property-booking-page'
            }
        });
    }
    //pass an array of properties to the child SearchResukltsItem component
        //Title, Bedrooms, Bathrooms, Max Guests, Cover Photo, Nightly Rate, Total, Reviews
    //when a user clicks on a property, navigate to the property detail page
    
    //display available properties once retreived 
    //Property locations should be displayed on the map

}