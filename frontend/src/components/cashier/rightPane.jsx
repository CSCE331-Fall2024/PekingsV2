import React, { useEffect, useState } from 'react';
import './rightPane.css';

// eslint-disable-next-line react/prop-types
function RightPane({ orderNumber, orderItems, centerChange, setProcessFunction }) {
    const [subtotal, setSubtotal] = useState(0);
    const [tax, setTax] = useState(0);
    const [total, setTotal] = useState(0);
    const [allOrderItemsRows, setAllOrderItemsRows] = useState([]);
    const [paidItemsRows, setPaidItemsRows] = useState([]);
    const [unpaidItemRows, setUnpaidItemRows] = useState([]);

    // UseEffect to log paidItemsRows when it changes
    useEffect(() => {
        console.log("Updated paidItemsRows:", paidItemsRows);
    }, [paidItemsRows]);

    const processPayment = () => (paymentType) => {
        console.log(paymentType);

        centerChange('menu');

        // Clone the current unpaidItemRows and add them to paidItemsRows
        const items = [...unpaidItemRows];

        // Update paidItemsRows using functional state update
        setPaidItemsRows((prevPaidItems) => [...prevPaidItems, ...items]);

        // Clear the order items (non-mutating approach)
        setAllOrderItemsRows([]);
        setUnpaidItemRows([]);

        orderItems.length = 0;
        setSubtotal(0);
        setTax(0);
        setTotal(0);

        // State updates are asynchronous, so the log here will not show updated `paidItemsRows`
        // instead, rely on the `useEffect` that logs `paidItemsRows` when it changes.
    };

    useEffect(() => {
        if (setProcessFunction) {
            setProcessFunction(processPayment);  // Passing the function to Component A
        }
    }, [setProcessFunction]);

    let removeItem = (menuItem) => () => {
        const index = orderItems.findIndex((item) => item === menuItem);
        if (index !== -1) {
            orderItems.splice(index, 1);
        }
    };

    function orderItemDisplay(menuItem) {
        let name = menuItem.name;
        let price = menuItem.price;
        return (
            <div className="orderItemRow" key={name}>
                <button className="orderItemRowText">
                    <div className="orderItemsText">{name}</div>
                    <div className="orderItemsPrice">${price}</div>
                </button>
                <button className="editBtn">E</button>
                <button className="orderItemX" onClick={removeItem(menuItem)}>X</button>
            </div>
        );
    }

    const updateOrderItems = () => {
        // Make sure to update the combined list of all items: unpaid + paid
        const rows = orderItems.map((item) => orderItemDisplay(item));
        // const paidRows = paidItemsRows.map((item) => orderItemDisplay(item));

        // Combine paid and unpaid items into allOrderItemsRows
        setAllOrderItemsRows([...paidItemsRows, ...rows]);
    };

    const updateOrderTotal = () => {
        let st = 0;

        for (let i = 0; i < orderItems.length; i++) {
            st += orderItems[i].price;
        }

        st = parseFloat(st.toFixed(2));
        let tax = parseFloat((st * 0.0625).toFixed(2));
        let total = parseFloat((st * 1.0625).toFixed(2));

        setSubtotal(st);
        setTax(tax);
        setTotal(total);
    };

    useEffect(() => {
        updateOrderItems(); // Update the items when `paidItemsRows` or `unpaidItemRows` change
        updateOrderTotal(); // Update totals whenever orderItems change

        // Cleanup intervals, though using `setInterval` may not be necessary
        const intervalId1 = setInterval(updateOrderItems, 1);
        const intervalId2 = setInterval(updateOrderTotal, 1); // Check every second

        return () => {
            clearInterval(intervalId1);
            clearInterval(intervalId2);
        } // Cleanup on unmount
    }, [paidItemsRows, unpaidItemRows, orderItems]); // Depend on unpaid and paid items

    return (
        <div className="rightRect">
            <div className="rightPaneContainer1-cash">
                <div className="orderNumberContainer-cash">
                    <div className="orderNumber">Order<br />#{orderNumber}</div>
                </div>

                <hr className="separator" />

                <div className="orderItemsContainer">
                    {allOrderItemsRows}
                </div>
                <hr className="separator" />

                <div className="priceContainer">
                    <div className="subtotal">Subtotal: ${subtotal}</div>
                    <div className="tax">Tax: ${tax}</div>
                    <div className="total">Total: ${total}</div>
                </div>
            </div>

            <button className="pay" onClick={() => centerChange('payment')}>Pay</button>
        </div>
    );
}

export default RightPane;
