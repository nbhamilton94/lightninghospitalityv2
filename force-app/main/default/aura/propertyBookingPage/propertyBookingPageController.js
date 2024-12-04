({
    initProperty : function(component, event, helper) {
        //get the record ID from session storage
        //set the component's record ID to the one from storage
        
        var selectedPropertyJson = sessionStorage.getItem('customSearch--recordId');
        var selectedProperty = JSON.parse(selectedPropertyJson);
        component.set('v.selectedProperty', selectedProperty);
        component.set('v.amenities', selectedProperty.property.Property_Amenities__r);
        var locations = [{ 
            location : selectedProperty.address
        }];
        
        component.set('v.mapMarkers', locations);   
        component.set('v.zoomLevel', 11);         
        //console.log(JSON.stringify(selectedProperty));
        
        //get my list of images
        var images = selectedProperty.images.imageList;
        console.log("HELLO I HAVE LOADED:");
        //console.log("IMAGES: " + JSON.stringify(images));
        var pages = Math.ceil(images.length/3);
        var newComponents = [];
        
        //push pageitems into new components
 
        for(let i = 0; i < pages; i++) {
            //need to add the content-id-xx ID to the div
            var contentid = "content-id-";
            if (i <= 9) {
                contentid += "0";
            }
            
            contentid += i;
            //structure the primary div
            if (i === 0) {
                newComponents.push(["div", {
                    "class" : "slds-carousel__panel",
                    "id" : contentid,
                    "aria-labelledby" : contentid,
                    "aria-hidden" : "true",
                    "role" : "tabpanel",
                    "tabindex" : "0"
                }]);                
            } else {
                newComponents.push(["div", {
                    "class" : "slds-carousel__panel",
                    "id" : contentid,
                    "aria-labelledby" : contentid,
                    "aria-hidden" : "false",
                    "role" : "tabpanel",
                    "tabindex" : "-1"
                }]);                  
            }            
        }
        
        
        for(let i = 0; i < images.length; i++){
            
            newComponents.push(["img",{
                "src":images[i],
                "style":"width:33%;"
            }]);             
        }        
        
        $A.createComponents(newComponents, function(components, status, errorMessages) {
            if (status === "SUCCESS") {
				console.log("success");
                
                var carouselPage = []; //each page in the carousel
                var img = []; //represents the image
                var aIndex = 0;
				                
                components.forEach((element) => {
                   	//console.log(element.z.A.tag);
                    var tagName = element.z.A.tag;

                    if(tagName === "div") {

                    	carouselPage.push(element);
                	} else {
                        
                    	img.push(element);    
                    }
            	});            
            
                for(let i = 0; i < img.length; i+=3){
                    
                    if ( aIndex >= carouselPage.length ) {
                        break; // exit if we have tied all elements of array A
                    }
                    
                    // Take the next chunk of 3 elements from the carouselPageItems
                    let chunk = img.slice(i, i+3);
                    console.log("chunk" + JSON.stringify(chunk));
                    // tie this chunk to the current element in array A
                    for (let j = 0; j < chunk.length; j++) {
                        var page = carouselPage[aIndex].get("v.body"); //get me the current page
                        page.push(chunk[j]); //add one out of 3 page items to the current page
                        carouselPage[aIndex].set("v.body", page);

                        
                    }
                    // once we are done pushing the chunks into the page, push the page into the pagebody
                    //carouselBody.push(carouselPage[aIndex]);
                    
                    // Move to the next element in Array A
                    aIndex++;
                }
        		var pageBody = component.get("v.body");
        		pageBody.push.apply(pageBody,carouselPage);
        		
        		component.set("v.body",pageBody);
	
            } 
        });
    },
     handleLeftClick : function(component, event, helper) {
        //for clicking left, we need to know the max transformation
        //because we are "adding" the highest something can be is 0
        //so if we attempt to add and get a value higher than zero, set the value to maxTransformation
                
        console.log('clicked');
     	var carousel = component.find("carousel2");
        var carouselElement = carousel.getElement();
        var numberOfPages = carouselElement.children.length;
        var maxTransformation = numberOfPages * -100;
        
        var regExp = /\(([^)]+)\)/;
        var matches = regExp.exec(carouselElement.style.transform);
        var transformPercentage = parseFloat(matches[1]);
        var test = (transformPercentage + 100 >= 0 ) ? maxTransformation+100 : (transformPercentage + 100);
        test += "%";
        console.log(test);
        var transformation = "translateX(" + test + ")";
        console.log(transformation);
        carouselElement.style.transform = transformation; 
         
     },
     handleRightClick : function(component, event, helper) {
        //calculate transformation limit based on number of pages
        //in carousel
         
        console.log('clicked');
     	var carousel = component.find("carousel2");
        console.log(carousel);
        var carouselElement = carousel.getElement();
        var numberOfPages = carouselElement.children.length;
        var maxTransformation = numberOfPages * -100;
        
        console.log(carouselElement.style.transform);
        //get the current value of translateX 
        
        var regExp = /\(([^)]+)\)/;
        var matches = regExp.exec(carouselElement.style.transform);
        var transformPercentage = parseFloat(matches[1]);
        var test = (transformPercentage - 100 <= maxTransformation ) ? 0 : (transformPercentage - 100);
        test += "%";
        console.log(test);
        var transformation = "translateX(" + test + ")";
        console.log(transformation);
        carouselElement.style.transform = transformation; 
        
     }       
 
})