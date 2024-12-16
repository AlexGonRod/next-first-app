'use server'

import { z } from 'zod'
import { sql } from '@vercel/postgres'
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const formSchema = z.object({
	id: z.string(),
	customerId: z.string(),
	amount: z.coerce.number(),
	status: z.enum(['pending', 'paid']),
	date: z.string()
})

const CreateInvoice = formSchema.omit({ id: true, date: true })

const logMessage = (msg: string) => {
	return {
		message: msg
	}
}

export async function createInvoice(formData: FormData) {
  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
	const amountInCents = amount * 100;
	const date = new Date().toISOString().split('T')[0];

	try {
		await sql`
		INSERT INTO invoices (customer_id, amount, status, date)
		VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
	  `;
		
	} catch (error) {
		console.error('Database Error:', error);
		logMessage('Error in database: Failed to create Invode')
	}
	
		revalidatePath('/dashboard/invoices');
		redirect('/dashboard/invoices');
}

// Use Zod to update the expected types
const UpdateInvoice = formSchema.omit({ id: true, date: true });
 
// ...
 
export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
 
  const amountInCents = amount * 100;
 try {
	 await sql`
	   UPDATE invoices
	   SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
	   WHERE id = ${id}
	 `;
	
 } catch (error) {
	 console.error('Database Error:', error);
	  logMessage( 'Error in database: Failed to update Invoice')
	}
	 revalidatePath('/dashboard/invoices');
	 redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
	throw new Error('Failed to Delete Invoice');
	try {
		await sql`DELETE FROM invoices WHERE id = ${id}`;
		revalidatePath('/dashboard/invoices');
		logMessage('Deleted Invoice')
		
	} catch (error) {
		console.error('Database Error:', error);
		logMessage('Database error: failed to delete Invoice')
	}
}