import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type OrderItem = {
	quantity: number;
	name: string;
	color: string;
	size: string;
	price: number;
};

type OrderDetails = {
	customerName: string;
	phoneNumber?: string;
	reference: string;
	totalAmount: number;
	orderItems: OrderItem[];
};

function buildOrderConfirmationHtml(
	customerName: string,
	reference: string,
	totalAmount: number,
	orderItems: OrderItem[],
	phoneNumber?: string,
): string {
	const itemRows = orderItems
		.map(
			(item) => `
      <tr>
        <td style="padding:12px 16px;border-bottom:1px solid #f0f0f0;font-size:14px;color:#374151;">
          ${item.name}
        </td>
        <td style="padding:12px 16px;border-bottom:1px solid #f0f0f0;font-size:14px;color:#6b7280;text-align:center;">
          ${item.color} / ${item.size}
        </td>
        <td style="padding:12px 16px;border-bottom:1px solid #f0f0f0;font-size:14px;color:#374151;text-align:center;">
          ${item.quantity}
        </td>
        <td style="padding:12px 16px;border-bottom:1px solid #f0f0f0;font-size:14px;color:#374151;text-align:right;">
          ₦${(item.price * item.quantity).toLocaleString()}
        </td>
      </tr>`,
		)
		.join("");

	return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Order Confirmation</title>
</head>
<body style="margin:0;padding:0;background-color:#f3f4f6;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f3f4f6;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;">

          <!-- Header -->
          <tr>
            <td style="background-color:#000000;border-radius:12px 12px 0 0;padding:32px 40px;text-align:center;">
              <p style="margin:0 0 4px 0;font-size:13px;color:#ffffff;letter-spacing:2px;text-transform:uppercase;font-weight:600;">Bowen University</p>
              <h1 style="margin:0;font-size:26px;color:#ffffff;font-weight:700;letter-spacing:-0.5px;">Technical Unit Merch</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background-color:#ffffff;padding:40px;">

              <!-- Greeting -->
              <h2 style="margin:0 0 8px 0;font-size:22px;color:#111827;font-weight:700;">
                Order Confirmed! 🎉
              </h2>
              <p style="margin:0 0 24px 0;font-size:15px;color:#6b7280;line-height:1.6;">
                Hi <strong style="color:#111827;">${customerName}</strong>, your order has been received and your payment was successful. We'll let you know when it's ready for pickup.
              </p>

              <!-- Reference badge -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;margin-bottom:32px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="margin:0 0 2px 0;font-size:12px;color:#16a34a;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Order Reference</p>
                    <p style="margin:0;font-size:18px;color:#111827;font-weight:700;font-family:monospace;">${reference}</p>
                    ${phoneNumber ? `<p style="margin:4px 0 0 0;font-size:13px;color:#6b7280;">📞 ${phoneNumber}</p>` : ""}
                  </td>
                </tr>
              </table>

              <!-- Order Items Table -->
              <h3 style="margin:0 0 12px 0;font-size:14px;color:#6b7280;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Order Summary</h3>
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;margin-bottom:24px;">
                <thead>
                  <tr style="background-color:#f9fafb;">
                    <th style="padding:10px 16px;font-size:12px;color:#6b7280;font-weight:600;text-align:left;border-bottom:1px solid #e5e7eb;">Item</th>
                    <th style="padding:10px 16px;font-size:12px;color:#6b7280;font-weight:600;text-align:center;border-bottom:1px solid #e5e7eb;">Variant</th>
                    <th style="padding:10px 16px;font-size:12px;color:#6b7280;font-weight:600;text-align:center;border-bottom:1px solid #e5e7eb;">Qty</th>
                    <th style="padding:10px 16px;font-size:12px;color:#6b7280;font-weight:600;text-align:right;border-bottom:1px solid #e5e7eb;">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemRows}
                </tbody>
              </table>

              <!-- Total -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td style="text-align:right;">
                    <span style="font-size:14px;color:#6b7280;">Total Paid:&nbsp;</span>
                    <span style="font-size:20px;font-weight:700;color:#16a34a;">₦${totalAmount.toLocaleString()}</span>
                  </td>
                </tr>
              </table>

              <!-- Pickup notice -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#fffbeb;border:1px solid #fde68a;border-radius:8px;margin-bottom:8px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="margin:0 0 4px 0;font-size:13px;font-weight:700;color:#92400e;">📦 Pickup Information</p>
                    <p style="margin:0;font-size:13px;color:#78350f;line-height:1.6;">
                      Your merch will be ready for pickup at the <strong>Technical Unit</strong>. Thank you for your purchase!
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f9fafb;border-radius:0 0 12px 12px;padding:24px 40px;text-align:center;border-top:1px solid #e5e7eb;">
              <p style="margin:0 0 4px 0;font-size:13px;color:#6b7280;">Questions? Reply to this email or contact the Technical Unit.</p>
              <p style="margin:0;font-size:12px;color:#9ca3af;">© ${new Date().getFullYear()} Technical Unit · Bowen University</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export const sendOrderConfirmation = async (
	email: string,
	orderDetails: OrderDetails,
) => {
	try {
    const { customerName, reference, totalAmount, orderItems, phoneNumber } = orderDetails;
console.log(orderDetails)
		const {data, error } = await resend.emails.send({
			from: "Technical Unit Merch <orders@bowentechnicalunitmerch.com.ng>",
			to: email,
			subject: `Order Confirmed: #${reference}`,
			html: buildOrderConfirmationHtml(
				customerName,
				reference,
				totalAmount,
				orderItems,
				phoneNumber,
			),
		});
      if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
	} catch (error) {
		console.error("Failed to send order confirmation email:", error);
	}
};
