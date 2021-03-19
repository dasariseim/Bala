public with sharing class RoomInfoController {
    public RoomInfoController() {

    }

     @AuraEnabled(cacheable = true)
     public static String sendMail(string bookingId){

        List<Room_Booking_Detail__c> bDetail = [Select Id,Email__c,Customer_Name__c from Room_Booking_Detail__c where id = :bookingId limit 1];
        String url = 'https://dasari143-dev-ed.lightning.force.com/';
        Messaging.SingleEmailMessage message = new Messaging.SingleEmailMessage();
        message.toAddresses = new String[] { bDetail[0].Email__c };
        message.subject = 'Booking Information';
        message.plainTextBody = 'Dear '+bDetail[0].Customer_Name__c+', Booking has been done refer the link  '+url+'/'+bookingId;
        Messaging.SingleEmailMessage[] messages =   new List<Messaging.SingleEmailMessage> {message};
        Messaging.SendEmailResult[] results = Messaging.sendEmail(messages);

     return '';
     }

     @AuraEnabled(cacheable = true)
    public static List<Room_Info__c> filteredRoomList(String type, Boolean ac,Date startdate, Date enddate){

    System.debug(type+' '+ac);
    if(type == 'None' || type == ''){
        type = '%';
    }

   return [SELECT Id, Name__c, Type__c, Picture_URL__c, Charges_Per_Day__c , AC__c
                        FROM Room_Info__c
                        WHERE Id NOT IN 
                        (SELECT Room_Info__c 
                          FROM Room_Booking_Detail__c
                          WHERE ((Start_Date__c <= :startDate AND End_Date__c >= :startDate) OR
                          (Start_Date__c<= :endDate AND End_Date__c>= :endDate) OR
                          (Start_Date__c > :startDate AND End_Date__c<= :endDate) ) )
                        AND Type__c LIKE :type
                        AND AC__c = :ac];
    }
}


   
