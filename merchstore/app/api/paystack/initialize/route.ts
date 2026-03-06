import { NextResponse } from 'next/server';

export async function POST(req: Request){
    const {email, amount, productId, size, variantId, color} = await req.json();

    //expected amount in kobo(multiply by 100)
    const amountInKobo = amount * 100;

    const response = await fetch('https://api.paystack.co/transaction/initialize', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email,
            productId,
            size,
            variantId,
            color,
            amount: amountInKobo,
            callback_url: `${process.env.NEXT_PUBLIC_SITE_URL}/verify-payment`, //url for after payment.
        }),
    })

    const data = await response.json();
    return NextResponse.json(data); //authorization_url or an access code.
}


