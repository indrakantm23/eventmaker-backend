require('dotenv').config({path: __dirname + '/.env'})
var nodemailer = require('nodemailer');
const User = require('./../model/users.model');
const hbs = require('nodemailer-express-handlebars');
// SEND WELCOME MAIL AFTER USER SIGNUP
const sendOnboardingMail = (data) => {
    var transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465, 
        secure: true,
        service: 'gmail',
        auth: {
          user: 'eventmaker23@gmail.com', //process.env.EMAIL,
          pass: 'Vishal@123',//process.env.PASSWORD
        }
      });

      console.log(data.data)
      let bookingData = data.eventData.entryMode === 'free' ? `
                    <table style="width:100%;border-collapse: collapse;">
                        <tr>
                            <th style="border: 1px solid #999;padding: 0.5rem;text-align: left;">Seats Booked</th> 
                            <th style="border: 1px solid #999;padding: 0.5rem;text-align: left;">Amount</th>
                        </tr>
                        <tr>
                            <td style="border: 1px solid #999; padding: 0.5rem;text-align: left;">${data.data}</td>
                            <td style="border: 1px solid #999; padding: 0.5rem;text-align: left;">Free</td>
                        </tr>
                    </table>
                  ` : `
                    <table style="width:100%;border-collapse: collapse;">
                    <tr>
                        <th style="border: 1px solid #999;padding: 0.5rem;text-align: left;">Category</th>
                        <th style="border: 1px solid #999;padding: 0.5rem;text-align: left;">Seats Booked</th> 
                        <th style="border: 1px solid #999;padding: 0.5rem;text-align: left;">Amount</th>
                    </tr>
                    ${data.data.map((el) => {
                        return(el && el.category? `<tr>
                            <td style="border: 1px solid #999; padding: 0.5rem;text-align: left;text-transform: capitalize;">${el.category}</td>
                            <td style="border: 1px solid #999; padding: 0.5rem;text-align: left;">${el.ticket_count}</td>
                            <td style="border: 1px solid #999; padding: 0.5rem;text-align: left;">₹${el.ticket_count * Number(el.amount)}</td>
                        </tr>` : null)
                    })}
                    </table>
    `;
    bookingData = bookingData.replace(/,/g, '');

      const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const DAYS   = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const getEventDates = (start, end)=>{
        if(new Date(start).getDay() === new Date(end).getDay()) {
            return `${DAYS[new Date(start).getDay()]}, ${new Date(start).getDate()} ${MONTHS[new Date(start).getMonth()]}`
        }
        else {
            return `${DAYS[new Date(start).getDay()]}, ${new Date(start).getDate()} ${MONTHS[new Date(start).getMonth()]} onwards`
        }
    }

      transporter.use('compile', hbs({
            viewEngine: 'express-handlebars',
            viewPath: './views/'
      }));
        
        var mailOptions = {
            from: '"Event Maker" <eventmaker23@gmail.com>',
            to: data.user.email,
            subject: 'Booking Confirmation',
            // html: 'Hello '+data.user.firstName+', <br><br>Your booking for '+data.eventData.eventName+' is confirmed. Below is details of your booking.<br><br>'+bookingData+'<br><br><b>Event location:</b> '+data.eventData.full_address+'<br><b>Timings: </b>Event will start on '+getEventDates(data.eventData.startDate, data.eventData.endDate)+' at '+ data.eventData.startTime +'<br><br>With Regards,<br>Team Eventmaker.<br><img style="width: 120px;" src="https://firebasestorage.googleapis.com/v0/b/eventsarounds.appspot.com/o/bucket%2Fevent-maker-logo1.png?alt=media&token=8fe6c6ef-9cda-487c-8434-5ca07dfbc79a"/>',
            
            html: '<div><div style="background: #06101f;height: 100px;overflow: hidden;"><img src="https://firebasestorage.googleapis.com/v0/b/eventsarounds.appspot.com/o/bucket%2Fevent-maker-logo1.png?alt=media&token=8fe6c6ef-9cda-487c-8434-5ca07dfbc79a" alt="Event Maker" style="width: 180px !important;margin: 0 auto !important;display: block !important;margin-top: 11px !important;"></div><div><p><b>Dear '+data.user.firstName+',</b> <br/><br/>Thank you for choosing Event Maker, your booking for '+data.eventData.eventName+' has been confirmed, please find your ticket below - </p></div><div style="min-height: 110px;border: 2px dashed #f1f3f4;margin-top: 30px;padding: 20px;margin-bottom: 25px;"><h1 style="font-size: 18px;text-transform: uppercase;font-family: sans-serif;word-break: break-word;color: #222;text-align: center;border-bottom: 1px solid #ddd;width: 310px;margin: 0 auto;padding-bottom: 5px;">'+data.eventData.eventName+'</h1><p style="text-align: center;margin: 10px;"><b>Location:</b> '+data.eventData.full_address+'</p><p style="text-align: center;margin: 10px;"><b>Timings:</b> Event will start on '+getEventDates(data.eventData.startDate, data.eventData.endDate)+' at '+ data.eventData.startTime +'</p></div>'+bookingData+'<div style="margin-top: 40px;"><p>Warm Regards,<br/>Event Maker</p></div></div>'
        };

        
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else {
                const obj = {
                    bookedOn: new Date(),
                    bookingDetails: data.data,
                    eventData: data.eventData
                };
                // GET AN EVENT
                    User.findById(data.user.id).then((user) => {
                        user.bookings.push(obj);
                        user.save();
                    });

                res.json({status: 200, msg: `Email sent to ${data.user.email}`})
            }
            });
    }





    

    exports.sendOnboardingMail = sendOnboardingMail;