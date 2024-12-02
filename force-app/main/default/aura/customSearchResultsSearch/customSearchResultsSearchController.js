({
    handleClick : function(component, event, helper) {
        var checkInDate = component.get('v.checkInDate');
        var checkOutDate = component.get('v.checkOutDate');
        
        //var searchText = component.get('v.searchText');
        var action = component.get('c.findAvailableProperties');
        
        // setparams creates a one-time use instance of the searchForIds action
        // in the server-side controller
        action.setParams({checkInDate : checkInDate, checkOutDate : checkOutDate});
        //action.setParams({searchText: searchText});
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === 'SUCCESS') {
                var availableProperties = response.getReturnValue();
                console.log('success!. Return value: ');
                console.log(availableProperties);
                
                sessionStorage.setItem('customSearch--recordIds', JSON.stringify(availableProperties));
                var navEvt = $A.get('e.force:navigateToURL');
                navEvt.setParams({url: '/custom-search-results'});
                navEvt.fire();
            } else {
                console.log('FAILURE. RETURN VALUE:');
                console.log(response.getReturnValue());
            }
        });
        
        //$A.enqueueAction adds the server-side action to the queue.
        $A.enqueueAction(action);
    }
    
    
})