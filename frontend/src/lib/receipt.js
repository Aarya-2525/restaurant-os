export const generateReceiptText = (order) => {
    const date = new Date(order.created_at).toLocaleString();
    const itemsText = order.items.map(item => {
        const name = item.menu_item?.name || item.menu_item_name || `Item ${item.menu_item}`;
        const price = parseFloat(item.menu_item?.price || item.price || 0).toFixed(2);
        const total = (price * item.quantity).toFixed(2);
        return `${name} x${item.quantity} | ${total}`;
    }).join('\n');

    const totalPrice = order.items.reduce((sum, item) => {
        const price = parseFloat(item.menu_item?.price || item.price || 0);
        return sum + (price * item.quantity);
    }, 0).toFixed(2);

    return `{reset,center}
{b,size:2x} RESTAURANT BILL
{reset,center}
Order #${order.id}
Table ${order.table_number}
${date}
---
${itemsText}
---
{b,size:1.5x} TOTAL | ₹${totalPrice}
---
{center}
Thank you for dining with us!
Please visit again.
`;
};
