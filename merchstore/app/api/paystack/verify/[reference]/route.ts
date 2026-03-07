// receive reference after payment is done.
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET(req: Request, {params}: {params : {reference: string}}){
    const reference = params.reference;

    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
        method: `GET`,
        headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
    });

    const result = await response.json();

    if(result.data.status === 'success'){
        //1. update supabase: mark order as paid
        const metadata = result.data.metadata;
        const {error} = await supabaseAdmin
        .from('orders')
        .insert([{
            customerEmail: result.data.customer.email,
            totalAmount: result.data.amount / 100, // convert from kobo to naira
            packstackReference: reference,
            status: 'success',
            customerName: metadata.customerName,
            department: metadata.department,
            level: metadata.level,
            totalQuantity: metadata.totalQuantity,
            orderItems: metadata.cartItems, // assuming cartItems is an array of items in the order
        }])

        if (error) return NextResponse.json({error: "Order save failed"}, {status: 500});

        return NextResponse.json({success: true});
    }

    return NextResponse.json({success: false});

}


// [
//   {
//     "productId": "tshirt",
//     "variantId": "tshirt-blue",
//     "name": "T-Shirt",
//     "color": "Blue",
//     "size": "XL",
//     "price": 7000,
//     "quantity": 1
//   }
// ]

