public without sharing class CustomSearchController {
    @AuraEnabled
    public static Decimal calculateAvgNightlyRate(Property__c prop) {
        Integer count = 0;
        Decimal avgNightlyRate = 0;
        
        for(Nightly_Rate__c rate : prop.Property__r ){
            avgNightlyRate += rate.Nightly_Rate__c;
            count++;          
        }        
        
        return ( count > 0 ) ? avgNightlyRate/count : 0;
    }
    
    @AuraEnabled
    public static List<Decimal> calculateAvgReviewScore(Property__c prop) {
        Integer reviewCount = 0;
        Decimal avgReviewScore = 0;
        List<Decimal> result = new List<Decimal>();
        for(Reviews__c review : prop.Reviews__r) {
            avgReviewScore += Integer.valueof(review.Score__c);
            reviewCount++;
        }
        avgReviewScore = ( reviewCount > 0 ) ? avgReviewScore/reviewCount : 0;
        result.add(reviewCount);
        result.add(avgReviewScore);
        return result;     
    }
    

    //images should have one property called cover (String) which is the base64 of the coverImage
    //it should have another property called imageList which is a list of Sring base64 images
    public class Images {
        @AuraEnabled
        public List<String> imageList { get; set; }
        
        @AuraEnabled
        public String coverImageUrl { get; set; }
        
        public Images(List<String> imageList, String coverImageUrl ) {
            this.imageList = imageList;
            this.coverImageUrl = coverImageUrl;
        }
    }
    
    public class Address {
        @AuraEnabled
        public String Street { get; set; }
        
        @AuraEnabled
        public String City { get; set; }
        
        @AuraEnabled
        public String State { get; set; }
        
        public Address( String street, String city, String state ){
            this.Street = Street;
            this.City = City;
            this.State = State;
        }
    }
    
    public class PropertyWrapper {
        @AuraEnabled
        public Property__c property { get; set; }
        
        @AuraEnabled
        public Decimal averageNightlyRate { get; set; }
        
        @AuraEnabled
        public Decimal averageReviewScore { get; set; }
        
        @AuraEnabled
        public Integer numberOfReviews { get; set; }
        
        @AuraEnabled
        public Address address { get; set; }
        
        @AuraEnabled
        public Images images { get; set; }
        
        @AuraEnabled
        public List<Reviews__c> reviews { get; set; }
        
        public PropertyWrapper(Property__c property, Decimal averageNightlyRate, Decimal averageReviewScore, Integer numberOfReviews, Address address, Images images) {
            this.property = property;
            this.averageNightlyRate = averageNightlyRate;
            this.averageReviewScore = averageReviewScore;
            this.numberOfReviews = numberOfReviews;
            this.address = address;
            this.images = images;
        }
        
        public PropertyWrapper(Property__c property, Decimal averageNightlyRate, Decimal averageReviewScore, Integer numberOfReviews, Address address) {
            this.property = property;
            this.averageNightlyRate = averageNightlyRate;
            this.averageReviewScore = averageReviewScore;
            this.numberOfReviews = numberOfReviews;
            this.address = address;
        }        
    }    
    
    @AuraEnabled
    public static List<PropertyWrapper> findAvailableProperties(date checkInDate, date checkOutDate){
        //List<Property__c> propertiesInCity = [];
        //get me all available properties YYYY-MM-DD
        //Reservations__r will be NULL for properties that are available for booking
        List<PropertyWrapper> propertyWrapper = new List<PropertyWrapper>();
        List<Property__c> availableProperties = new List<Property__c>();
        List<Property__c> properties = [SELECT Id, Name, Maximum_Guests__c, Address__Street__s, Address__City__s, Address__StateCode__s, Number_of_Bedrooms__c, Number_of_Bathrooms__c, Nickname__c, Cover_Photo__c,Property_Description__c,  
                                        (SELECT Check_In_Date__c, Check_Out_Date__c FROM Reservations__r WHERE Check_Out_Date__c >= :checkInDate AND Check_In_Date__c <= :checkOutDate ),
                                        (SELECT Nightly_Rate__c FROM Property__r WHERE Calendar_Date__c >= :checkInDate AND Calendar_Date__c <= :checkOutDate), 
                                        (SELECT Id, Comments__c, Score__c FROM Reviews__r)
                                        FROM Property__c];
        
        // go through the list of properties and calculate the average nightly rate based on the check in and check out date the guest picked        
        for(Property__c prop : properties) {
            if(prop.Reservations__r.size() == 0) {
                System.debug('property ID:');
                System.debug(prop.Id);
                List<ContentDocumentLink> ContentDocIds = [SELECT ContentDocumentId FROM ContentDocumentLink WHERE LinkedEntityId=: prop.Id];
                System.debug('Content Doc Ids:' );
                //System.debug(ContentDocIds);
                List<String> imageList = new List<String>();
                
                Decimal avgNightlyRate = 0;
                Decimal avgReviewScore = 0;
                
                Integer reviewCount = 0;
                Address location = new Address(prop.Address__Street__s, prop.Address__City__s, prop.Address__StateCode__s);
                
                avgNightlyRate = calculateAvgNightlyRate(prop);
                
                //adding the nightly rate to our Property Wrapper, next we will calculate reviews for each property and do the same
                List<Decimal> results = calculateAvgReviewScore(prop);
                avgReviewScore = results[1];
                reviewCount = (Integer)results[0];
                
                
                List<String> newIds = new List<String>();
                for (ContentDocumentLink item : ContentDocIds) {
                    newIds.add((String)item.ContentDocumentId);
                    System.debug(newIds);
                }
                              
                
                //String idString = '\'' + String.join(newIds,'\',\'') + '\'';
               
                /*
                for (ContentVersion item : [SELECT Title, VersionData, ContentDocumentId FROM ContentVersion WHERE ContentDocumentId IN :newIds AND IsLatest = true]) {
                    String data = EncodingUtil.base64Encode(item.VersionData);
                    System.debug('VERSION DATA');
                    System.debug(data);
                    imageListBase64.add(data);
                    
                } */            
                
                Images photos = new Images(imageList, prop.Cover_Photo__c);
                
                propertyWrapper.add(new PropertyWrapper( prop, avgNightlyRate.setScale(2), avgReviewScore.setScale(2), reviewCount, location, photos));
            }
        }
        
        return propertyWrapper;
    }
    /*Need to query for the property the selected and pull all relevant information about that property
*Check in date and check out date are in session storage. I can pass this into my function*/
    @AuraEnabled
    public static PropertyWrapper findProperty(date checkInDate, date checkOutDate, String recordId){
        /*
* Map<String, Object> selectedProperty = (Map<String, Object>) JSON.deserializeUntyped(selectedPropertyJSON);  
Id recordId = (Id) selectedProperty.get('recordId');
*/
        Property__c prop = [SELECT Id, Name, Maximum_Guests__c, Address__Street__s, Address__City__s, Address__StateCode__s, Number_of_Bedrooms__c, Number_of_Bathrooms__c, Nickname__c, Cover_Photo__c,Property_Description__c, Cancellation_Policy__c,
                            (SELECT Amenity_Link__c FROM Property_Amenities__r WHERE Property__r.Id =:recordId),
                            (SELECT Nightly_Rate__c FROM Property__r WHERE Calendar_Date__c >= :checkInDate AND Calendar_Date__c <= :checkOutDate), 
                            (SELECT Id, Comments__c, Score__c FROM Reviews__r)
                            FROM Property__c WHERE Property__c.Id =: recordId LIMIT 1];
        Decimal avgReviewScore = 0;
        Integer reviewCount = 0;
        Address location = new Address(prop.Address__Street__s, prop.Address__City__s, prop.Address__StateCode__s);
        Decimal avgNightlyRate = calculateAvgNightlyRate(prop);
        List<Decimal> results = calculateAvgReviewScore(prop);
        reviewCount = (Integer)results[0];
        avgReviewScore = results[1];
        //List<ContentDocumentLink> ContentDocIds = [SELECT ContentDocumentId FROM ContentDocumentLink WHERE LinkedEntityId=: prop.Id];
        List<ID> ContentDocIds = new List<String>();
        List<String> imageList = new List<String>();
        
        
        for ( ContentDocumentLink item : [SELECT ContentDocumentId, LinkedEntityId FROM ContentDocumentLink WHERE LinkedEntityId= :prop.Id] ) { 
            ContentDocIds.add(item.ContentDocumentId);
        }
        
	
        List<ContentDocument> contentDocs = [SELECT Id, LatestPublishedVersionId FROM ContentDocument WHERE Id IN :ContentDocIds ];
        
        for( contentDocument photo : contentDocs ) {
            String versionId = (String) photo.LatestPublishedVersionId;
            String fullUrl = 'https://norman-dev-ed.develop.my.site.com/lightninghospitality/s/sfsites/c/sfc/servlet.shepherd/version/renditionDownload?rendition=ORIGINAL_Jpg&versionId=' + versionId;
            imageList.add(fullUrl);
        }
        
        /*
        List<ContentVersion> CV3 = [SELECT Title, VersionData, ContentDocumentId FROM ContentVersion WHERE ContentDocumentId IN :ContentDocIds AND IsLatest = true LIMIT 2];
        for (ContentVersion item : CV3) {
            String data = EncodingUtil.base64Encode(item.VersionData);
            imageList.add(data);
        } */               
        
        
        Images photos = new Images(imageList, prop.Cover_Photo__c);
        
        return new PropertyWrapper( prop, avgNightlyRate.setScale(2), avgReviewScore.setScale(2), reviewCount, location, photos);
    }
}

//takes a string searchText and returns a list of strings representing found IDS.
//In the final version, this code is going to return a list of vacant properties.