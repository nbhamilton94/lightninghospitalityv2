import { createElement } from '@lwc/engine-dom';
import HomeSearchComponent from 'c/homeSearchComponent';
import findAvailableProperties from '@salesforce/apex/CustomSearchController.findAvailableProperties';
import { NavigationMixin, Navigate } from 'lightning/navigation';

describe('c-home-search-component', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    // Things to Test:
    // Component Initialization: Ensure default values are rendered correctly
    // Event Handling: Simulate user input and validate changes in component properties.
    // Apex Calls:
    // NavigationMixin:
    // Error Handling:

    it('should ensure default values are rendered correctly', () => {
        const element = createElement('c-home-search-component', {
            is: HomeSearchComponent
        });
        
        document.body.appendChild(element);

        // Debugging the DOM
        console.log(element.shadowRoot.innerHTML);
    
        // Find elements using querySelector
        const checkInDateTest = element.shadowRoot.querySelector('lightning-input');
        const checkOutDateTest = element.shadowRoot.querySelector('lightning-input');
        const cityTest = element.shadowRoot.querySelector('lightning-combobox');
    
        // Verify elements exist
        expect(checkInDateTest).not.toBeNull();
        expect(checkOutDateTest).not.toBeNull();
        expect(cityTest).not.toBeNull();
    
        // Simulate values
        checkInDateTest.setAttribute('name', 'checkindate');
        checkInDateTest.setAttribute('value', '');
        checkOutDateTest.setAttribute('name', 'checkoutdate');
        checkOutDateTest.setAttribute('value', '');
        cityTest.setAttribute('name', 'city');
        cityTest.setAttribute('value', 'Austin');
    
        // Assert values
        expect(checkInDateTest.value).toBe('');
        expect(checkOutDateTest.value).toBe('');
        expect(cityTest.value).toBe('Austin');
    });
    
    it('should simulate user input and validate changes in component properties', () => {
        const element = createElement('c-home-search-component', {
            is: HomeSearchComponent
        });
        document.body.appendChild(element);

        // Find elements using querySelector
        const inputElements = element.shadowRoot.querySelectorAll('lightning-input');
        const button = element.shadowRoot.querySelector('lightning-button');    
        
        // Verify elements exist
        expect(inputElements).not.toBeNull();
        expect(button).not.toBeNull();
        expect(inputElements.length).toBe(2);
        
        // Get inputs in correct order (matching the HTML structure)
        const checkInDate = inputElements[0];  // First input is check-in
        const checkOutDate = inputElements[1]; // Second input is check-out
        
        return Promise.resolve()
            .then(() => {
                // Simulate user input for check-in date
                const checkinEvent = new CustomEvent('change', {
                    detail: { value: '2023-06-10' }
                });
                Object.defineProperty(checkinEvent, 'target', {
                    writable: false,
                    value: {
                        name: 'checkindate',
                        value: '2023-06-10'
                    }
                });
                checkInDate.dispatchEvent(checkinEvent);
            })
            .then(() => {
                // Simulate user input for check-out date
                const checkoutEvent = new CustomEvent('change', {
                    detail: { value: '2023-06-20' }
                });
                Object.defineProperty(checkoutEvent, 'target', {
                    writable: false,
                    value: {
                        name: 'checkoutdate',
                        value: '2023-06-20'
                    }
                });
                checkOutDate.dispatchEvent(checkoutEvent);
            })
            .then(() => {
                // Find and test city selection
                const cityTest = element.shadowRoot.querySelector('lightning-combobox');
                expect(cityTest).not.toBeNull();
                
                const cityEvent = new CustomEvent('change', {
                    detail: { value: 'Dallas' }
                });
                Object.defineProperty(cityEvent, 'target', {
                    writable: false,
                    value: {
                        name: 'city',
                        value: 'Dallas'
                    }
                });
                cityTest.dispatchEvent(cityEvent);
            })
            .then(() => {
                // Verify the input values are set correctly
                const inputs = element.shadowRoot.querySelectorAll('lightning-input');
                expect(inputs[0].value).toBe('2023-06-10');
                expect(inputs[1].value).toBe('2023-06-20');
                
                const cityCombobox = element.shadowRoot.querySelector('lightning-combobox');
                expect(cityCombobox.value).toBe('Dallas');
            });
    });

    it('should make apex calls', async () => {

        // Mock implementation of Apex call
        findAvailableProperties.mockResolvedValue([
            { propertyId: '123', propertyName: 'Test Property' },
            { propertyId: '456', propertyName: 'Test Property 2' }
        ]);
        
        const element = createElement('c-home-search-component', {
            is: HomeSearchComponent
        });
        
        document.body.appendChild(element);

        // Debugging the DOM
        console.log(element.shadowRoot.innerHTML);
    
        // Find elements using querySelector
        const button = element.shadowRoot.querySelector('lightning-button');
        const inputElements = element.shadowRoot.querySelectorAll('lightning-input');
        const cityTest = element.shadowRoot.querySelector('lightning-combobox');
        
        // Verify elements exist
        expect(button).not.toBeNull();
        expect(inputElements).not.toBeNull();
        expect(cityTest).not.toBeNull();

        let checkOutDate = inputElements[0];
        let checkInDate = inputElements[1];
        
        checkInDate.dispatchEvent(new CustomEvent('change', { detail: { value: '2023-06-10' } })); 

        checkOutDate.dispatchEvent(new CustomEvent('change', { detail: { value: '2023-06-20' } }));
        // Simulate user input

        button.click();
    
        await Promise.resolve();

        // Assert changes
        expect(findAvailableProperties).toHaveBeenCalledTimes(1);
        
    });

    it('should use a navigation mixin for programmatic navigation', () => {
        const element = createElement('c-home-search-component', {
            is: HomeSearchComponent
        });
        
        document.body.appendChild(element);

        // Set required field values before clicking
        const inputElements = element.shadowRoot.querySelectorAll('lightning-input');
        const checkInDate = inputElements[0];
        const checkOutDate = inputElements[1];
        
        checkInDate.dispatchEvent(new CustomEvent('change', { detail: { value: '2023-06-10' } }));
        
        checkOutDate.dispatchEvent(new CustomEvent('change', { detail: { value: '2023-06-20' } }));
        
        // Find and click the button
        const button = element.shadowRoot.querySelector('lightning-button');
        button.click();

        // Wait for any promises to resolve
        return Promise.resolve().then(() => {
            // Verify navigation was called with correct parameters
            expect(Navigate).toHaveBeenCalledWith({
                type: 'standard__webPage',
                attributes: {
                    url: '/custom-search-results'
                }
            });
        });
    });

    it('should handle apex errors gracefully', (done) => {
        // Mock the Apex error with Salesforce error structure
        const mockError = {
            body: {
                message: 'An error occurred while searching for properties',
                errorCode: 'INVALID_REQUEST'
            },
            statusText: 'Bad Request',
            status: 400
        };
        findAvailableProperties.mockRejectedValue(mockError);
        
        const element = createElement('c-home-search-component', {
            is: HomeSearchComponent
        });
        document.body.appendChild(element);

        // Get elements and simulate input
        const inputs = element.shadowRoot.querySelectorAll('lightning-input');
        const comboboxes = element.shadowRoot.querySelectorAll('lightning-combobox');
        const cityInput = comboboxes[0];
        const checkInInput = inputs[0];
        const checkOutInput = inputs[1];

        cityInput.dispatchEvent(new CustomEvent('change', {
            detail: { value: 'Austin' },
            target: { name: 'city', value: 'Austin' }
        }));

        checkInInput.dispatchEvent(new CustomEvent('change', {
            detail: { value: '2024-01-01' },
            target: { name: 'checkindate', value: '2024-01-01' }
        }));

        checkOutInput.dispatchEvent(new CustomEvent('change', {
            detail: { value: '2024-01-07' },
            target: { name: 'checkoutdate', value: '2024-01-07' }
        }));

        // Click the search button
        const button = element.shadowRoot.querySelector('lightning-button');
        button.dispatchEvent(new CustomEvent('click'));

        // Use setTimeout to wait for DOM updates
        setTimeout(() => {
            const errorDiv = element.shadowRoot.querySelector('.slds-text-color_error');
            expect(errorDiv).not.toBeNull();
            expect(errorDiv.textContent.trim()).toBe('An error occurred while searching for properties');
            done();
        }, 0);
    });
});