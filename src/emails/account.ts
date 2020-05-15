import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

export const sendWelcomeEmail = (email: string, name: string) => {
    sgMail.send({
        to: email,
        from: 'adrian.kubica.ak@gmail.com',
        subject: 'Thanks for joining in',
        text: `Welcome to the app ${name}. Let me know how you get along with the app`
    })
}

export const sendCancelationEmail = (email: string, name: string) => {
    sgMail.send({
        to: email,
        from: 'adrian.kubica.ak@gmail.com',
        subject: 'Thanks for beeing with us',
        text: `See you soon ${name}.`
    })
}