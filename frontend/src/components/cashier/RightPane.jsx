import React, { useEffect, useState, useRef } from 'react';
import './rightPane.css';

// Compare arrays
const areArraysEqual = (arr1, arr2) => {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
    }
    return true;
};

// eslint-disable-next-line react/prop-types
function RightPane({ order, centerChange, setProcessFunction, processFunctions, discount}) {
    const [subtotal, setSubtotal] = useState(0);
    const [tax, setTax] = useState(0);
    const [total, setTotal] = useState(0);
    const [orderItemsRows, setOrderItemsRows] = useState([]);
    const [orderItemsChecker, setOrderItemsChecker] = useState([]);


    // Functions used for Nathan L place orders
    function calculateSubtotal(){
        let st = 0;

        for (let i = 0; i < order.orderItems.length; i++) {
            st += order.orderItems[i].price;
        }

        return parseFloat((st * (1 - discount)).toFixed(2));
    }

    function calculateTax(){
        let st = calculateSubtotal();
        let tax = parseFloat((st * 0.0625).toFixed(2));

        return tax;
    }

    function calculateTotal(){
        let st = calculateSubtotal();
        let tax = calculateTax();
        return parseFloat((st + tax).toFixed(2));
    }


    // Reinsert try statements when fixed
    const handleOrder = async (orderUse, paymentType) => {
        // try {
            let orderItems = orderUse.orderItems;

            // Format extras array - calculate ingredient amount changes
            const extras = orderItems.flatMap(item => {
                // Only process items that have ingredients
                if (!item.ingredients || !item.ingredientCounts) return [];

                return item.ingredients.map(ingredient => {
                    // Handle both object and string ingredient formats
                    const ingredientId = typeof ingredient === 'object' ? ingredient.ingredient : ingredient;
                    const originalAmount = 1;
                    const currentAmount = item.ingredientCounts[ingredientId] || 0;
                    const difference = currentAmount - originalAmount;

                    if (difference === 0) return null;

                    return {ingredient: {id: Number(ingredientId)}, amount: difference};
                });
            }).filter(Boolean);

            // format order items array using the stored menuItemId
            const items = orderItems.map(item => ({
                menuItem: {
                    // using stored original menu item ID
                    id: Number(item.menuItemId)
                }
            }));

            // creating the order object
            const order = {
                customer: {
                    id: Math.floor(Math.random() * 1000) + 1
                },
                employee: {
                    id: 3
                },
                time: new Date().toISOString(),
                price: Number(calculateTotal().toFixed(2)),
                items: items,
                extras: extras
            };


            const response = await fetch('/api/orders/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(order)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'No error details available' }));
                throw new Error(`Server responded with ${response.status}: ${errorData.message}`);
            }

            const responseData = await response.json();
            console.log('Order response:', responseData);

            // clears order
            // setOrderItems([]);
            // setIsOpen(false);
            // setAppliedPromo(null);
            // setPromoError('');
            // setExpandedItems({});

            //yippee it didnt fail
            alert('Order placed successfully!');
        // }
        // catch (error) {
        //     console.error('Error processing order:', error);
        //     alert(`Failed to place order: ${error.message}`);
        // }
    };

    const processPayment = (paymentType) => {
        // handleOrder(order);

        centerChange('menu');

        let st = calculateSubtotal();

        // if(discount !== 0){
        //     st *= 1 - discount;
        // }

        // let total = parseFloat((st * 1.0625).toFixed(2));
        let total = calculateTotal();

        order.paidItems.push(...order.orderItems);
        order.amountPaid += total;
        order.amountPaid = parseFloat(order.amountPaid.toFixed(2));

        // Reset the subtotal, tax, and total
        // console.log(order.orderItems);
        order.orderItems.length = 0;
        // console.log(order.orderItems);
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
        const index = order.orderItems.findIndex((item) => item === menuItem);
        if (index !== -1) {
            order.orderItems.splice(index, 1);
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
        const paidRows = order.paidItems.map((item) => paidItemDisplay(item));
        if(paidRows.length > 0){
            paidRows.push(createPaidText());
        }

        const unpaidRows = order.orderItems.map((item) => orderItemDisplay(item));
        if(unpaidRows.length > 0 && discount > 0){
            unpaidRows.push(createDiscountText());
        }

        setOrderItemsRows([...paidRows, ...unpaidRows]);

        if(!areArraysEqual(order.orderItems, orderItemsChecker)){
            setOrderItemsChecker([...order.orderItems]);
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
        setSubtotal(calculateSubtotal());
        setTax(calculateTax());
        setTotal(calculateTotal());
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
                    <div className="orderNumber">Order<br />#{order.id}</div>
                </div>

                <hr className="separator" />

                <div className="orderItemsContainer" ref={containerRef}>
                    {orderItemsRows}
                </div>
                <hr className="separator" />

                <div className="priceContainer">
                    <div className="subtotal">Subtotal: ${subtotal.toFixed(2)}</div>
                    <div className="tax">Tax: ${tax.toFixed(2)}</div>
                    <div className="total">Total: ${total.toFixed(2)}</div>
                </div>
            </div>

            <button className="pay" onClick={() => centerChange('payment')}>Pay</button>
        </div>
    );
}

export default RightPane;
