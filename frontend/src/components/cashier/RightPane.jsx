import React, { useEffect, useState, useRef } from 'react';
import './rightPane.css';

// COmpare arrays
const areArraysEqual = (arr1, arr2) => {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
    }
    return true;
};

// eslint-disable-next-line react/prop-types
function RightPane({ orderNumber, orderItems, paidItems, centerChange, setProcessFunction, processFunctions, discount}) {
    const [subtotal, setSubtotal] = useState(0);
    const [tax, setTax] = useState(0);
    const [total, setTotal] = useState(0);
    const [orderItemsRows, setOrderItemsRows] = useState([]);
    const [orderItemsChecker, setOrderItemsChecker] = useState([]);



    const processPayment = (paymentType) => {
        // console.log(paymentType);

        centerChange('menu');

        paidItems.push(...orderItems);
        // console.log(paidItems);

        // Reset the subtotal, tax, and total
        orderItems.length = 0;
        setSubtotal(0);
        setTax(0);
        setTotal(0);
    };

    useEffect(() => {
        if (setProcessFunction) {
            setProcessFunction([...processFunctions, processPayment]);  // Passing the function to Component A
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
            <div className="orderItemRow">
                <button className="orderItemRowText">
                    <div className="orderItemsText">{name}</div>
                    <div className="orderItemsPrice">${price}</div>
                </button>
                <button className="editBtn">E</button>
                <button className="orderItemX" onClick={removeItem(menuItem)}>X</button>
            </div>
        );
    }

    function paidItemDisplay(menuItem){
        let name = menuItem.name;
        let price = menuItem.price;
        return (
            <div className="orderItemRow">
                <button className="orderItemRowText">
                    <div className="paidItemsText">{name}</div>
                    <div className="paidItemsPrice">${price}</div>
                </button>
            </div>
        );
    }

    function createPaidText(){
        return (
            <div className="orderItemRow">
                <div className="paidItemText">Payment Complete</div>
            </div>
        )
    }

    function createDiscountText(){
        return (
            <div className="orderItemRow">
                <div className="discountText">{discount * 100}% Discount Applied</div>
            </div>
        );
    }

    const updateOrderItems = () => {
        // Make sure to update the combined list of all items: unpaid + paid
        const paidRows = paidItems.map((item) => paidItemDisplay(item));
        if(paidRows.length > 0){
            paidRows.push(createPaidText());
        }

        const unpaidRows = orderItems.map((item) => orderItemDisplay(item));
        if(unpaidRows.length > 0 && discount > 0){
            unpaidRows.push(createDiscountText());
        }

        setOrderItemsRows([...paidRows, ...unpaidRows]);

        if(!areArraysEqual(orderItems, orderItemsChecker)){
            setOrderItemsChecker([...orderItems]);
            // console.log("x");
            // console.log(orderItemsChecker);
            // console.log(orderItems);
        }
    };

    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    }, [orderItemsChecker]);

    const updateOrderTotal = () => {
        let st = 0;

        for (let i = 0; i < orderItems.length; i++) {
            st += orderItems[i].price;
        }

        // console.log(discount);

        if(discount !== 0){
            st *= 1 - discount;
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
        const intervalId2 = setInterval(updateOrderTotal, 1);

        return () => {
            clearInterval(intervalId1);
            clearInterval(intervalId2);
        } // Cleanup on unmount
    }, [orderItemsChecker, discount]); // Depend on unpaid and paid items

    return (
        <div className="rightRect">
            {/*<button className="tempBtn" onClick={() => console.log(paidItems)}></button>*/}
            <div className="rightPaneContainer1-cash">
                <div className="orderNumberContainer-cash">
                    <div className="orderNumber">Order<br />#{orderNumber}</div>
                </div>

                <hr className="separator" />

                <div className="orderItemsContainer" ref={containerRef}>
                    {orderItemsRows}
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
