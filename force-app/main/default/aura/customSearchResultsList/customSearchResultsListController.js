({
    init: function(component, event, helper) {   
        var propertiesJson = sessionStorage.getItem('customSearch--recordIds');
        var checkInDateJson = sessionStorage.getItem('customSearch--checkInDate');
        var checkOutDateJson = sessionStorage.getItem('customSearch--checkOutDate');
        
        if (!$A.util.isUndefinedOrNull(propertiesJson)) {
            var properties = JSON.parse(propertiesJson);
            var checkInDate = JSON.parse(checkInDateJson);
            var checkOutDate = JSON.parse(checkOutDateJson);
            
            console.log (new Date(checkInDate));
            console.log (checkOutDate);
            console.log ('available properties: ');
            console.log(JSON.stringify(properties));
            component.set('v.availableProperties', properties);
            component.set('v.checkInDate', new Date(checkInDate).toISOString().slice(0, 10));
            component.set('v.checkOutDate', new Date(checkOutDate).toISOString().slice(0, 10)); 
            
            //sessionStorage.removeItem('customSearch--recordIds');
            //I need to build an array of objects that contain locations
            //[{location:properties[i]},]
            var locations = [];
            
            properties.forEach( (element) => {        
                locations.push({location : element.address}); 
            });     
        
            console.log('LOCATIONS: '+JSON.stringify(locations));       
            component.set('v.mapMarkers', locations);   
            component.set('v.zoomLevel', 11);           
        }
        
    }
     

})