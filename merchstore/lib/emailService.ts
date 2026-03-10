import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOrderConfirmation = async (email: string, orderDetails: any) => {
  try {
    const { customerName, reference, totalAmount, orderItems } = orderDetails;

    await resend.emails.send({
      from: 'Technical Unit Merch <ctech.bui@bowen.edu.ng>', // sender email & name
      to: email,
      subject: `Order Confirmed: #${reference}`,
    //   create a template in the frontend to make it look better.
      html: `
        <div>
          <h2>Hi ${customerName}, thanks for your order!</h2>
          <p>We've received your payment of <strong>₦${totalAmount.toLocaleString()}</strong>.</p>
          <p><strong>Order Reference:</strong> ${reference}</p>
          <hr />
          <h3>Order Summary:</h3>
          <ul>
            ${orderItems.map((item: any) => `
              <li>${item.quantity}x ${item.name} (${item.color} - ${item.size})</li>
            `).join('')}
          </ul>
          <hr />
          <p>Your merch will be ready for pickup soon!</p>
        </div>
      `,
    });
    console.log(`Email sent to ${email}`); //remove after testing
  } catch (error) {
    console.error("Failed to send email:", error);
  }
};