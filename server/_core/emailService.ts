import { ENV } from "./env";

interface OrderEmailData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  totalAmount: number;
  items: Array<{
    productName: string;
    quantity: number;
    price: number;
    size?: string;
  }>;
  paymentMethod: string;
  notes?: string;
}

export async function sendOrderNotificationEmail(orderData: OrderEmailData) {
  try {
    // Get admin email from environment or use default
    const adminEmail = "admin@qualityspices.com";

    // Format the email content
    const itemsHtml = orderData.items
      .map(
        (item) =>
          `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.productName}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${item.size || "N/A"}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">₹${(item.price / 100).toFixed(2)}</td>
      </tr>
    `
      )
      .join("");

    const emailContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .section { margin-bottom: 20px; }
        .section-title { font-size: 18px; font-weight: bold; color: #92400e; margin-bottom: 10px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th { background-color: #fef3c7; padding: 10px; text-align: left; font-weight: bold; }
        .total-row { background-color: #fef3c7; font-weight: bold; }
        .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">🌿 New Order Received</h1>
          <p style="margin: 5px 0 0 0;">Order #${orderData.orderNumber}</p>
        </div>

        <div class="section">
          <div class="section-title">Customer Information</div>
          <p><strong>Name:</strong> ${orderData.customerName}</p>
          <p><strong>Email:</strong> ${orderData.customerEmail}</p>
          <p><strong>Phone:</strong> ${orderData.customerPhone}</p>
        </div>

        <div class="section">
          <div class="section-title">Shipping Address</div>
          <p>${orderData.address}</p>
          <p>${orderData.city}, ${orderData.state} ${orderData.postalCode}</p>
        </div>

        <div class="section">
          <div class="section-title">Order Items</div>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th style="text-align: center;">Quantity</th>
                <th style="text-align: center;">Size</th>
                <th style="text-align: right;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
              <tr class="total-row">
                <td colspan="3" style="padding: 10px; text-align: right;">Total Amount:</td>
                <td style="padding: 10px; text-align: right;">₹${(orderData.totalAmount / 100).toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="section">
          <div class="section-title">Payment Method</div>
          <p>${orderData.paymentMethod.toUpperCase()}</p>
        </div>

        ${
          orderData.notes
            ? `
        <div class="section">
          <div class="section-title">Order Notes</div>
          <p>${orderData.notes}</p>
        </div>
        `
            : ""
        }

        <div class="footer">
          <p>This is an automated notification from Quality Kitchen Spices</p>
          <p>Please do not reply to this email</p>
        </div>
      </div>
    </body>
    </html>
    `;

    // Send email using the Manus notification API
    const response = await fetch(`${ENV.forgeApiUrl}/notification/email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ENV.forgeApiKey}`,
      },
      body: JSON.stringify({
        to: adminEmail,
        subject: `New Order Received - #${orderData.orderNumber} from ${orderData.customerName}`,
        html: emailContent,
      }),
    });

    if (!response.ok) {
      throw new Error(`Email API error: ${response.statusText}`);
    }

    console.log(`[Email] Order notification sent to ${adminEmail}`);
    return true;
  } catch (error) {
    console.error("[Email] Failed to send order notification:", error);
    return false;
  }
}

export async function sendOrderConfirmationEmail(orderData: OrderEmailData) {
  try {
    const itemsHtml = orderData.items
      .map(
        (item) =>
          `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.productName}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${item.size || "N/A"}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">₹${(item.price / 100).toFixed(2)}</td>
      </tr>
    `
      )
      .join("");

    const emailContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .section { margin-bottom: 20px; }
        .section-title { font-size: 18px; font-weight: bold; color: #92400e; margin-bottom: 10px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th { background-color: #fef3c7; padding: 10px; text-align: left; font-weight: bold; }
        .total-row { background-color: #fef3c7; font-weight: bold; }
        .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">✓ Order Confirmed</h1>
          <p style="margin: 5px 0 0 0;">Order #${orderData.orderNumber}</p>
        </div>

        <div class="section">
          <p>Thank you for your order, <strong>${orderData.customerName}</strong>!</p>
          <p>We have received your order and will process it shortly. You will receive a shipping notification once your order is dispatched.</p>
        </div>

        <div class="section">
          <div class="section-title">Order Summary</div>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th style="text-align: center;">Quantity</th>
                <th style="text-align: center;">Size</th>
                <th style="text-align: right;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
              <tr class="total-row">
                <td colspan="3" style="padding: 10px; text-align: right;">Total Amount:</td>
                <td style="padding: 10px; text-align: right;">₹${(orderData.totalAmount / 100).toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="section">
          <div class="section-title">Shipping Address</div>
          <p>${orderData.address}</p>
          <p>${orderData.city}, ${orderData.state} ${orderData.postalCode}</p>
        </div>

        <div class="section">
          <p><strong>Need help?</strong> Contact us at support@qualityspices.com</p>
        </div>

        <div class="footer">
          <p>Quality Kitchen Spices - Premium Spices for Every Kitchen</p>
        </div>
      </div>
    </body>
    </html>
    `;

    const response = await fetch(`${ENV.forgeApiUrl}/notification/email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ENV.forgeApiKey}`,
      },
      body: JSON.stringify({
        to: orderData.customerEmail,
        subject: `Order Confirmation - #${orderData.orderNumber}`,
        html: emailContent,
      }),
    });

    if (!response.ok) {
      throw new Error(`Email API error: ${response.statusText}`);
    }

    console.log(`[Email] Order confirmation sent to ${orderData.customerEmail}`);
    return true;
  } catch (error) {
    console.error("[Email] Failed to send order confirmation:", error);
    return false;
  }
}
