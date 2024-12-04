import { LightningElement, api, track } from 'lwc';
import findProperty from '@salesforce/apex/CustomSearchController.findProperty';

//given a list of images, construct and return a carousel to be set into the page body
function createCarousel(images){
    var pages = Math.ceil(images.length/3);
    var carouselItems = [];

    // Create panels with their images
    for(let i = 0; i < pages; i++) {
        const pageItems = images.slice(i * 3, (i + 1) * 3);
        carouselItems.push({
            id: `panel-${i}`,
            type: 'panel',
            hidden: i !== 0, 
            panelClass: i === 0 ? 'slds-carousel__panel' : 'slds-carousel__panel slds-hide', 
            items: pageItems.map((url, index) => ({
                id: `image-${i}-${index}`,
                url: url
            }))
        });
    }

    console.log('Carousel Items:', JSON.stringify(carouselItems, null, 2));
    return carouselItems;
}

export default class BookingPage extends LightningElement {
    @api amenities;
    @api mapMarkers;
    @api markersTitle;
    @api selectedMarkerValue;
    @api zoomLevel = 11;
    @api checkInDate;
    @api checkOutDate;
    
    @track property;
    @track images = [];
    @track carousel = [];
    @track isLoading = true;
    @track currentPanelIndex = 0;
    @track translateX = 0;

    selectedPropertyId;

    get carouselKey() {
        return this.selectedPropertyId ? `carousel-${this.selectedPropertyId}` : 'default-carousel';
    }

    get panelStyle() {
        return `transform: translateX(-${this.currentPanelIndex * 100}%)`;
    }

    renderedCallback() {
        
        if (this.template.querySelector('.slds-carousel__panels')) {
            this.template.querySelector('.slds-carousel__panels').style.transition = 'transform 0.5s ease-in-out';
        }
    }

    async connectedCallback() {
        this.isLoading = true;
        try {
            this.selectedPropertyId = JSON.parse(sessionStorage.getItem('customSearch--recordId'));
            this.checkInDate = new Date(sessionStorage.getItem('customSearch--checkInDate')).toISOString().slice(0, 10);
            this.checkOutDate = new Date(sessionStorage.getItem('customSearch--checkOutDate')).toISOString().slice(0, 10);
            
            console.log('CHECK IN DATE: ', this.checkInDate);
            console.log('CHECK OUT DATE: ', this.checkOutDate);
            console.log('SELECTED PROPERTY ID: ', this.selectedPropertyId);

            this.property = await findProperty({ 
                checkInDate: this.checkInDate,
                checkOutDate: this.checkOutDate,
                recordId: this.selectedPropertyId
            });
            console.log('PROPERTY: ', this.property);

            if(this.property) {
                this.images = this.property.images.imageList;
                this.carousel = createCarousel(this.images);
            } else {
                console.error('Property not found');
            }
        } catch (error) {
            console.error('Error fetching property:', error);
        } finally {
            this.isLoading = false;
        }
    }

    handleLeftClick(event) {
        const totalPanels = this.carousel.length;
        if (totalPanels > 1) {
            this.currentPanelIndex = (this.currentPanelIndex - 1 + totalPanels) % totalPanels;
            console.log('Current Panel Index: ', this.currentPanelIndex);
        }
    }

    handleRightClick(event) {
        const totalPanels = this.carousel.length;
        if (totalPanels > 1) {
            this.currentPanelIndex = (this.currentPanelIndex + 1) % totalPanels;
            console.log('Current Panel Index: ', this.currentPanelIndex);
        }
    }
}
