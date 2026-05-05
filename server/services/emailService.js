const emailjs = require('@emailjs/nodejs');

const initEmailJS = () => {
  emailjs.init({
    publicKey: process.env.EMAILJS_PUBLIC_KEY,
    privateKey: process.env.EMAILJS_PRIVATE_KEY,
  });
};

const sendEmail = async (params, serviceId = process.env.EMAILJS_SERVICE_INQUIRY, templateId = process.env.EMAILJS_TEMPLATE_INQUIRY) => {
  if (!serviceId || !templateId) {
    console.warn('[MailSender] EmailJS configuration incomplete (missing serviceId or templateId).');
    return { success: false, error: 'Configuration missing' };
  }
  try {
    const response = await emailjs.send(
      serviceId,
      templateId,
      params
    );
    return { success: true, response };
  } catch (err) {
    console.error('[MailSender] Error sending email via EmailJS:', err);
    return { success: false, error: err.message || err };
  }
};

module.exports = { initEmailJS, sendEmail };
