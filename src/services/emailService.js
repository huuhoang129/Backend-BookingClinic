require('dotenv').config();
import nodemailer from 'nodemailer'

let sendSimpleEmail = async (dataSend) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for port 465, false for other ports
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
    });

    let info = await transporter.sendMail({
        from: '"Booking Clinic 👻" <BookingClinic129@gmail.com>', // sender address
        to: dataSend.reciverEmail, // list of receivers
        subject: "Thông tin đặt lịch khám bệnh", // Subject line
        html: getBodyHTMLEmail(dataSend)
    });
}

let getBodyHTMLEmail = (dataSend) => {
    let result = ''
    if (dataSend.language === 'vi') {
        result = `
      <h3>Xin chào ${dataSend.patientName},</h3>
      <p>Cảm ơn bạn đã đặt lịch khám trực tuyến tại Booking Clinic.</p>
      <p>Chi tiết cuộc hẹn của bạn:</p>
      <ul>
        <li><strong>Thời gian:</strong> ${dataSend.time}</li>
        <li><strong>Bác sĩ:</strong> ${dataSend.doctorName}</li>
      </ul>
      <p>Nếu thông tin trên là chính xác, vui lòng nhấn vào liên kết bên dưới để xác nhận và hoàn tất thủ tục:</p>
      <p><a href="${dataSend.redirectLink}" target="_blank">Xác nhận lịch khám</a></p>
      <p>Trân trọng cảm ơn,<br/>Booking Clinic</p>
    `
            ;
    }
    if (dataSend.language === 'en') {
        result = `
        <h3>Dear ${dataSend.patientName},</h3>
        <p>Thank you for booking an online appointment with Booking Clinic.</p>
        <p>Here are your appointment details:</p>
        <ul>
          <li><strong>Date & Time:</strong> ${dataSend.time}</li>
          <li><strong>Doctor:</strong> ${dataSend.doctorName}</li>
        </ul>
        <p>If the above information is correct, please click the link below to confirm and complete your booking:</p>
        <p><a href="${dataSend.redirectLink}" target="_blank">Confirm Appointment</a></p>
        <p>Best regards,<br/>Booking Clinic</p>
      `;
    }
    return result;
}

let getBodyHTMLEmailRemedy = (dataSend) => {
    let result = ''
    if (dataSend.language === 'vi') {
        result = `
      <h3>Xin chào ${dataSend.patientName},</h3>
      <p>Đơn thuốc điện tử của bạn từ Booking Clinic đã sẵn sàng.</p>
      <p>Vui lòng kiểm tra và làm theo hướng dẫn sử dụng thuốc.</p>
      <p>Nếu có bất kỳ thắc mắc nào, đừng ngần ngại liên hệ với chúng tôi.</p>
      <p>Chân thành cảm ơn,<br/>Booking Clinic</p>
    `;
    }
    if (dataSend.language === 'en') {
        result = `
        <h3>Dear ${dataSend.patientName},</h3>
        <p>Your e-prescription from Booking Clinic is now available.</p>
        <p>Please review it and follow the instructions provided.</p>
        <p>If you have any questions, feel free to reach out to us.</p>
        <p>Thank you,<br/>Booking Clinic</p>
      `
    }
    return result;
}

let sendAttachment = async (dataSend) => {
    return new Promise(async (resolve, reject) => {
        try {
            let transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false, // true for port 465, false for other ports
                auth: {
                    user: process.env.EMAIL_APP,
                    pass: process.env.EMAIL_APP_PASSWORD,
                },
            });

            let info = await transporter.sendMail({
                from: '"Booking Clinic 👻" <BookingClinic129@gmail.com>', // sender address
                to: dataSend.email, // list of receivers
                subject: "Ket qua đặt lịch khám bệnh", // Subject line
                html: getBodyHTMLEmailRemedy(dataSend),
                attachments: [
                    {
                        filename: `remedy-${dataSend.patientId}-${new Date().getTime()}.png`,
                        content: dataSend.imgBase64.split("base64,")[1],
                        encoding: 'base64'
                    },
                ],
            });
            resolve(true)
        } catch (e) {
            reject(e)
        }
    })
}
module.exports = {
    sendSimpleEmail: sendSimpleEmail,
    sendAttachment: sendAttachment
}