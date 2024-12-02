({
    initBookingComponentController : function(component, event, helper) {
        var checkInDate = component.get('v.checkInDate');
        var checkOutDate = component.get('v.checkOutDate');
        
        component.set('v.checkInDate', new Date(checkInDate).toISOString().slice(0, 10));
        component.set('v.checkOutDate', new Date(checkOutDate).toISOString().slice(0, 10));         
        
    }
})