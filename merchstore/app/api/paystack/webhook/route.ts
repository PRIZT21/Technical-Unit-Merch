import {crypto} from 'crypto';//built crypto module in node, no need to install
import {NextResponse} from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { sendOrderConfirmation } from '@/lib/emailService';

export async function POST(req: Request) {
    const body = await req.text(); // Get raw body as text

    // verify the signature
    const hash = crypto
    .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!)
    .update(body)
    .digest('hex');

    if (hash !== req.headers.get('x-paystack-signature')) {
    return new Response('Unauthorized', { status: 401 });
  }

  const event = JSON.parse(body);

   // Only process successful charges
  if (event.event === 'charge.success') {
    const { reference, metadata, customer, amount } = event.data;

    // IDEMPOTENCY: Check if the order was already saved by the Verify route
    const { data: existingOrder } = await supabaseAdmin
      .from('orders')
      .select('paystackReference')
      .eq('paystackReference', reference)
      .single();

    if (!existingOrder) {
      //PERSISTENCE: Save the new fields to your updated table
      const { error } = await supabaseAdmin.from('orders').insert([
        {
          customerEmail: customer.email,
          customerName: metadata.customerName,
          department: metadata.department,    
          level: metadata.level,              
          totalQuantity: metadata.totalQuantity, 
          totalAmount: amount / 100,             // Convert Kobo to Naira
          paystackReference: reference,
          orderItems: metadata.cartItems,        // The snapshot of what they bought
          status: 'success',
        },
      ]);

      //in case verify route crashes(reliability)
      if (!error) {
      // TRIGGER EMAIL HERE
        await sendOrderConfirmation(customer.email, {
          customerName: metadata.customerName,
          reference: reference,
          totalAmount: amount / 100,
          orderItems: metadata.cartItems
        });
      }

      if (error) {
        console.error("Webhook Database Error:", error.message);
        return NextResponse.json({ error: 'Database save failed' }, { status: 500 });
      }
    }
  }

  // ACKNOWLEDGMENT: Paystack needs a 200 OK or they will keep retrying
  return NextResponse.json({ received: true }, { status: 200 });
}

