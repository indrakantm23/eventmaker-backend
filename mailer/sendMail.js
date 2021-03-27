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
          user: process.env.EMAIL,
          pass: process.env.PASSWORD
        }
      });

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
                        return(`<tr>
                            <td style="border: 1px solid #999; padding: 0.5rem;text-align: left;text-transform: capitalize;">${el.category}</td>
                            <td style="border: 1px solid #999; padding: 0.5rem;text-align: left;">${el.ticket_count}</td>
                            <td style="border: 1px solid #999; padding: 0.5rem;text-align: left;">₹${el.ticket_count * Number(el.amount)}</td>
                        </tr>`)
                    })}
                    </table>
    `;

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
            html: 'Hello '+data.user.firstName+', <br><br>Your booking for '+data.eventData.eventName+' is confirmed. Below is details of your booking.<br><br>'+bookingData+'<br><br><b>Event location:</b> '+data.eventData.full_address+'<br><b>Timings: </b>Event will start on '+getEventDates(data.eventData.startDate, data.eventData.endDate)+' at '+ data.eventData.startTime +'<br><br>With Regards,<br>Team Eventmaker.<br><img style="width: 120px;" src="https://firebasestorage.googleapis.com/v0/b/eventsarounds.appspot.com/o/bucket%2Fevent-maker-logo1.png?alt=media&token=8fe6c6ef-9cda-487c-8434-5ca07dfbc79a"/>'
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