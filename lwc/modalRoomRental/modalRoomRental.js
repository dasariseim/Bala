import { LightningElement, api } from 'lwc';
import BOOKING_OBJECT from '@salesforce/schema/Room_Booking_Detail__c';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import sendMail from '@salesforce/apex/RoomInfoController.sendMail';

export default class ModalCarRental extends LightningElement {
    objectApiName = BOOKING_OBJECT;
    
    @api roomobject;
    @api startdate;
    @api enddate;

    @api status;

    @api show(){
        this.status= true;
    }

    closeModal(){
        this.status = false;
    }

    onSubmitHandler(event){
        event.preventDefault();

        const fields = event.detail.fields;
        fields.Room_Info__c = this.roomobject.Id;
        fields.Start_Date__c = this.startdate;
        fields.End_Date__c = this.enddate;

        console.log(this.startdate+''+this.enddate);

        if(this.startdate === null || this.enddate === null){

            const evt = new ShowToastEvent({
                title: 'Error',
                message: 'Start Date and End Date is mandatory',
                variant : 'error',
                mode: 'dismissable'
            });
            this.dispatchEvent(evt);
        } 
        else if(this.startdate >= this.enddate ){

            const evt = new ShowToastEvent({
                title: 'Error',
                message: 'Start Date should not be later than End Date',
                variant : 'error',
                mode: 'dismissable'
            });
            this.dispatchEvent(evt);
        } 
        else{

        this.template.querySelector('lightning-record-edit-form').submit(fields);
         
                this.status = false; }
    }

    handleSuccess(event){
        const evt = new ShowToastEvent({
            title: 'Hurray! Your Booking Id is: ' + event.detail.id,
            message: 'Room booked successfully from ' + this.startdate + ' to ' + this.enddate,
            variant : 'success',
            mode: 'sticky'
        });
        this.dispatchEvent(evt);

        sendMail({ bookingId : event.detail.id })
            .then((result) => {
               
            })
            .catch((error) => {
                
            });


    }
}