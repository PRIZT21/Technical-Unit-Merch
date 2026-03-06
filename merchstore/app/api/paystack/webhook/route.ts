import {crypto} from 'crypto';//built crypto module in node, no need to install
import {NextResponse} from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
    const body = await req.text(); // Get raw body as text

    // verify the signature
    const hash = crypto
    .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
    .update(body)
    .digest('hex');

    if (hash !== req.headers.get('x-paystack-signature')) {
        return NextResponse.json({error: "Invalid signature"}, {status: 400});
    }

    const event = JSON.parse(body);

    // Only care about successful charges
    if (event.event === 'charge.success') {
    const reference = event.data.reference;

    // Check if order already exists (so we don't double-record it)
    const { data: existingOrder } = await supabase
      .from('orders')
      .select('id')
      .eq('paystackReference', reference)
      .single();

    if (!existingOrder) {
      // Save the order and trigger email 
      await supabase.from('orders').insert([{
        customerEmail: event.data.customer.email,
        totalAmount: event.data.amount / 100,
        paystackReference: reference,
        status: 'success',
        orderItems: event.data.metadata.cartItems
      }]);
      
    }
  }

  return NextResponse.json({ status: 'success' }, { status: 200 });


}

