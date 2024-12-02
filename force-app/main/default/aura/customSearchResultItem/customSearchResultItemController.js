({
    handleClick: function(component, event, helper) {
        var recordId = component.get("v.recordId");
        var checkInDate = new Date(sessionStorage.getItem('customSearch--checkInDate')).toISOString().slice(0, 10);
        var checkOutDate = new Date(sessionStorage.getItem('customSearch--checkOutDate')).toISOString().slice(0, 10);
        
              
        var action = component.get('c.findProperty');
        
        console.log('action: ' + action);

        //Need to pass in the recordId of the property and do a query to get reviews
        action.setParams({checkInDate: checkInDate, checkOutDate: checkOutDate, recordId: recordId});
        
        //Execute the function
        action.setCallback(this, function(response) {
            console.log('setting callback: ');
            
            var state = response.getState();
            if (state === 'SUCCESS') {
                //sessionStorage.setItem('customSearch--recordId', recordId);
                var property = response.getReturnValue();
                console.log('Success!. Property: ');
                console.log(JSON.stringify(property));
                
                sessionStorage.setItem('customSearch--recordId', JSON.stringify(property));
                var navEvt = $A.get('e.force:navigateToURL');
                navEvt.setParams({url: '/property-booking-page'});
                navEvt.fire();
            } else {
                console.log('FAILURE. RETURN VALUE:');
                console.log(response.getReturnValue());
            }
        });
        
        $A.enqueueAction(action);
        
    }
})